import { and, desc, eq, inArray } from "drizzle-orm";
import { Resend } from "resend";
import { getDb } from "@/app/lib/db";
import { customers, licenses, orders } from "@/app/lib/db/schema";
import {
  getAppUrl,
  getSupportEmail,
  databaseConfig,
  resendConfig,
} from "@/app/lib/env";
import {
  DISPOSABLE_EMAIL_MESSAGE,
  isDisposableEmail,
} from "@/app/lib/disposable-email";
import {
  convertKeygenLicenseToPaid,
  createKeygenLicense,
  reinstateKeygenLicense,
  renewKeygenLicense,
  revokeKeygenLicense,
} from "@/app/lib/keygen";
import { signManageJwt } from "@/app/lib/manage-token";
import type { PaidPlan } from "@/app/lib/pricing";
import { PLAN_LABEL, formatInr, planPricing } from "@/app/lib/pricing";
import {
  LicenseDeliveryEmail,
  PaymentSupportAlertEmail,
  TrialRequestReceivedEmail,
} from "@/app/components/email-templates/LicenseTemplates";

export async function upsertCustomer(opts: {
  email: string;
  phone?: string;
  name?: string;
}) {
  const db = getDb();
  const email = opts.email.trim().toLowerCase();
  const [existing] = await db
    .select()
    .from(customers)
    .where(eq(customers.email, email))
    .limit(1);
  if (existing) {
    const [updated] = await db
      .update(customers)
      .set({
        phone: opts.phone ?? existing.phone,
        name: opts.name ?? existing.name,
        updatedAt: new Date(),
      })
      .where(eq(customers.id, existing.id))
      .returning();
    return updated;
  }
  const [created] = await db
    .insert(customers)
    .values({
      email,
      phone: opts.phone,
      name: opts.name,
    })
    .returning();
  return created;
}

export async function getCustomerByEmail(email: string) {
  const db = getDb();
  const [row] = await db
    .select()
    .from(customers)
    .where(eq(customers.email, email.trim().toLowerCase()))
    .limit(1);
  return row ?? null;
}

export async function getLatestLicenseForCustomer(customerId: string) {
  const db = getDb();
  const [row] = await db
    .select()
    .from(licenses)
    .where(eq(licenses.customerId, customerId))
    .orderBy(desc(licenses.createdAt))
    .limit(1);
  return row ?? null;
}

export async function customerHasUsedTrial(customerId: string) {
  const db = getDb();
  const [row] = await db
    .select()
    .from(licenses)
    .where(
      and(eq(licenses.customerId, customerId), eq(licenses.trialUsed, true)),
    )
    .limit(1);
  return Boolean(row);
}

export async function requestTrialLicense(opts: {
  email: string;
  name?: string;
}) {
  if (!resendConfig.success) {
    throw new Error(
      "Email is not configured — trial request cannot be delivered to support",
    );
  }

  const email = opts.email.trim().toLowerCase();
  const name = opts.name?.trim() || undefined;

  if (isDisposableEmail(email)) {
    throw new Error(DISPOSABLE_EMAIL_MESSAGE);
  }

  // If we already issued a trial for this email in our DB, tell the user
  // (paid/manual fulfilment may have recorded it). Do not call Keygen.
  if (databaseConfig.success) {
    try {
      const customer = await upsertCustomer({ email, name });
      if (await customerHasUsedTrial(customer.id)) {
        throw new Error(
          "A trial has already been issued for this email. Please purchase a licence or contact support.",
        );
      }
    } catch (err) {
      if (
        err instanceof Error &&
        (err.message.startsWith("A trial has already been issued") ||
          err.message === DISPOSABLE_EMAIL_MESSAGE)
      ) {
        throw err;
      }
      // DB optional for the request path — still notify support below.
      console.error("[requestTrialLicense] DB check skipped:", err);
    }
  }

  await sendSupportAlert({
    subject: `Trial request: ${email}`,
    kind: "trial_request",
    email,
    plan: "trial",
    details: [
      "Manual trial key needed — do not auto-issue from the website.",
      name ? `Name: ${name}` : "Name: (not provided)",
      `Requested at: ${new Date().toISOString()}`,
    ].join("\n"),
  });

  // Confirm to the requester (no licence key — support will send it).
  const { error } = await new Resend(resendConfig.data.RESEND_API_KEY).emails.send({
    from: `Ugle <${resendConfig.data.RESEND_FROM_EMAIL}>`,
    to: [email],
    replyTo: getSupportEmail(),
    subject: "We received your Ugle trial request",
    react: TrialRequestReceivedEmail({ name, email }),
  });

  if (error) {
    console.error("[requestTrialLicense] requester email failed:", error.message);
  }

  return { email, name };
}

export async function fulfillPaidOrder(opts: {
  cashfreeOrderId: string;
  cfPaymentId?: string;
}) {
  const db = getDb();
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.cashfreeOrderId, opts.cashfreeOrderId))
    .limit(1);

  if (!order) {
    throw new Error(`Order not found: ${opts.cashfreeOrderId}`);
  }

  if (order.status === "paid") {
    return { order, alreadyProcessed: true as const };
  }

  // Never fulfil (or reinstate) from a terminal non-paid state — e.g. a
  // refunded order must not be re-claimed into a free Keygen reinstatement.
  if (
    order.status === "refunded" ||
    order.status === "failed" ||
    order.status === "dropped"
  ) {
    const err = new Error(
      `Order ${opts.cashfreeOrderId} is ${order.status} and cannot be fulfilled`,
    );
    (err as Error & { code?: string }).code = "ORDER_TERMINAL";
    throw err;
  }

  if (order.plan !== "monthly" && order.plan !== "annual") {
    throw new Error("Order plan is not a paid plan");
  }
  const plan = order.plan as PaidPlan;

  // Atomically claim only while still pending. Webhook + return-page can race;
  // only one caller wins. Terminal statuses above are rejected before this.
  const claim = await db
    .update(orders)
    .set({
      status: "paid",
      cfPaymentId: opts.cfPaymentId ?? order.cfPaymentId,
      updatedAt: new Date(),
    })
    .where(and(eq(orders.id, order.id), eq(orders.status, "pending")))
    .returning();
  if (claim.length === 0) {
    return { order, alreadyProcessed: true as const };
  }

  try {
    return await fulfillClaimedOrder({
      order,
      plan,
      cfPaymentId: opts.cfPaymentId,
    });
  } catch (err) {
    // Roll the claim back so a later retry can re-attempt Keygen/DB work.
    // Email failures are handled inside fulfillClaimedOrder and do not reach here.
    await db
      .update(orders)
      .set({ status: "pending", updatedAt: new Date() })
      .where(eq(orders.id, order.id));
    throw err;
  }
}

async function maybeReinstateKeygen(license: typeof licenses.$inferSelect) {
  // Only reinstate when our DB says suspended — avoids swallowing Keygen errors
  // for unrelated reinstate failures on active licences.
  if (license.status !== "suspended") return;
  await reinstateKeygenLicense(license.keygenLicenseId);
}

async function fulfillClaimedOrder(opts: {
  order: typeof orders.$inferSelect;
  plan: PaidPlan;
  cfPaymentId?: string;
}) {
  const db = getDb();
  const { order, plan } = opts;

  const [customer] = await db
    .select()
    .from(customers)
    .where(eq(customers.id, order.customerId))
    .limit(1);
  if (!customer) throw new Error("Customer not found for order");

  let license = order.licenseId
    ? (
        await db
          .select()
          .from(licenses)
          .where(eq(licenses.id, order.licenseId))
          .limit(1)
      )[0]
    : await getLatestLicenseForCustomer(customer.id);

  let licenseKey: string;
  let keygenId: string;
  let expiresAt: Date | null;

  if (license && license.status === "trial") {
    await maybeReinstateKeygen(license);
    const converted = await convertKeygenLicenseToPaid(
      license.keygenLicenseId,
      plan,
    );
    licenseKey = converted.key || license.keygenLicenseKey;
    keygenId = converted.id;
    expiresAt = converted.expiry ? new Date(converted.expiry) : null;

    const [updated] = await db
      .update(licenses)
      .set({
        plan,
        status: "active",
        keygenLicenseKey: licenseKey,
        expiresAt,
        cancelAtPeriodEnd: false,
        updatedAt: new Date(),
      })
      .where(eq(licenses.id, license.id))
      .returning();
    license = updated;
  } else if (
    license &&
    (order.isRenewal ||
      license.status === "active" ||
      license.status === "expired" ||
      license.status === "suspended")
  ) {
    await maybeReinstateKeygen(license);

    let updatedKeygen;
    if (license.plan !== plan) {
      // Plan switch: set policy + fresh term from now (do not also renew)
      updatedKeygen = await convertKeygenLicenseToPaid(
        license.keygenLicenseId,
        plan,
      );
    } else {
      updatedKeygen = await renewKeygenLicense(license.keygenLicenseId);
    }

    licenseKey = updatedKeygen.key || license.keygenLicenseKey;
    keygenId = updatedKeygen.id;
    expiresAt = updatedKeygen.expiry ? new Date(updatedKeygen.expiry) : null;
    const [updated] = await db
      .update(licenses)
      .set({
        plan,
        status: "active",
        keygenLicenseKey: licenseKey,
        expiresAt,
        cancelAtPeriodEnd: false,
        updatedAt: new Date(),
      })
      .where(eq(licenses.id, license.id))
      .returning();
    license = updated;
  } else {
    const created = await createKeygenLicense({
      plan,
      email: customer.email,
      name: customer.name ?? undefined,
    });
    licenseKey = created.key;
    keygenId = created.id;
    expiresAt = created.expiry ? new Date(created.expiry) : null;
    const [createdRow] = await db
      .insert(licenses)
      .values({
        customerId: customer.id,
        keygenLicenseId: keygenId,
        keygenLicenseKey: licenseKey,
        plan,
        status: "active",
        expiresAt,
        trialUsed: true,
      })
      .returning();
    license = createdRow;
  }

  const [paidOrder] = await db
    .update(orders)
    .set({
      status: "paid",
      licenseId: license.id,
      cfPaymentId: opts.cfPaymentId ?? order.cfPaymentId,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, order.id))
    .returning();

  // Email is best-effort AFTER Keygen + DB succeed. Failure must not roll the
  // order back to pending (that would re-run renew/convert and extend again).
  try {
    await sendLicenseEmail({
      email: customer.email,
      name: customer.name ?? undefined,
      plan,
      licenseKey: license.keygenLicenseKey,
      expiresAt: license.expiresAt,
      customerId: customer.id,
      amountTotalInr: order.amountTotalInr,
    });
  } catch (emailErr) {
    const detail =
      emailErr instanceof Error ? emailErr.message : "licence email failed";
    console.error("[fulfillClaimedOrder] licence email failed:", emailErr);
    await sendSupportAlert({
      subject: `Licence email failed: ${customer.email} (${plan})`,
      kind: "stuck",
      email: customer.email,
      plan,
      details: `Order ${order.cashfreeOrderId} is PAID and Keygen ${license.keygenLicenseId} is active, but email failed: ${detail}. Resend the key manually.`,
    });
  }

  await sendSupportAlert({
    subject: `Payment success: ${customer.email} (${plan})`,
    kind: "success",
    email: customer.email,
    plan,
    details: `Cashfree order ${order.cashfreeOrderId}; Keygen ${license.keygenLicenseId}; ${formatInr(order.amountTotalInr)}`,
  });

  return { order: paidOrder, license, alreadyProcessed: false as const };
}

export async function handleRefundedOrder(cashfreeOrderId: string) {
  const db = getDb();
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.cashfreeOrderId, cashfreeOrderId))
    .limit(1);
  if (!order) throw new Error(`Order not found for refund: ${cashfreeOrderId}`);

  if (order.status === "refunded") {
    return { alreadyProcessed: true as const };
  }

  // Atomic claim: only one refund handler proceeds from a non-refunded row.
  // Prefer claiming from paid; also allow pending edge-cases so we still revoke
  // if somehow refunded before our paid mark landed.
  const claim = await db
    .update(orders)
    .set({ status: "refunded", updatedAt: new Date() })
    .where(
      and(
        eq(orders.id, order.id),
        inArray(orders.status, ["pending", "paid", "failed", "dropped"]),
      ),
    )
    .returning();
  if (claim.length === 0) {
    return { alreadyProcessed: true as const };
  }

  if (order.licenseId) {
    const [license] = await db
      .select()
      .from(licenses)
      .where(eq(licenses.id, order.licenseId))
      .limit(1);
    if (license && license.status !== "revoked") {
      try {
        await revokeKeygenLicense(license.keygenLicenseId);
        await db
          .update(licenses)
          .set({ status: "revoked", updatedAt: new Date() })
          .where(eq(licenses.id, license.id));
      } catch (revokeErr) {
        const detail =
          revokeErr instanceof Error ? revokeErr.message : "revoke failed";
        console.error("[handleRefundedOrder] Keygen revoke failed:", revokeErr);
        await sendSupportAlert({
          subject: `Keygen revoke FAILED after refund: ${cashfreeOrderId}`,
          kind: "stuck",
          email: "unknown",
          plan: order.plan,
          details: `Order marked refunded in DB but Keygen license ${license.keygenLicenseId} may still be active (${detail}). Revoke manually.`,
        });
      }
    }
  }

  const [customer] = await db
    .select()
    .from(customers)
    .where(eq(customers.id, order.customerId))
    .limit(1);

  await sendSupportAlert({
    subject: `Refund processed: ${customer?.email ?? order.customerId}`,
    kind: "refund",
    email: customer?.email ?? "unknown",
    plan: order.plan,
    details: `Cashfree order ${cashfreeOrderId}; license revoked`,
  });

  return { alreadyProcessed: false as const };
}

async function sendLicenseEmail(opts: {
  email: string;
  name?: string;
  plan: "trial" | PaidPlan;
  licenseKey: string;
  expiresAt: Date | null;
  customerId: string;
  amountTotalInr?: number;
}) {
  if (!resendConfig.success) {
    throw new Error(
      "Email is not configured — licence key cannot be delivered",
    );
  }

  const token = await signManageJwt({
    customerId: opts.customerId,
    email: opts.email,
  });
  const manageUrl = `${getAppUrl()}/manage?token=${encodeURIComponent(token)}`;
  const pricing = opts.plan === "trial" ? null : planPricing(opts.plan);

  const { data, error } = await new Resend(
    resendConfig.data.RESEND_API_KEY,
  ).emails.send({
    from: `Ugle <${resendConfig.data.RESEND_FROM_EMAIL}>`,
    to: [opts.email],
    replyTo: getSupportEmail(),
    subject:
      opts.plan === "trial"
        ? "Your Ugle 15-day trial licence"
        : `Your Ugle ${PLAN_LABEL[opts.plan]} licence`,
    react: LicenseDeliveryEmail({
      name: opts.name,
      email: opts.email,
      plan: opts.plan,
      licenseKey: opts.licenseKey,
      expiresAt: opts.expiresAt?.toISOString() ?? null,
      manageUrl,
      amountTotalInr: opts.amountTotalInr ?? pricing?.total,
      downloadUrl: `${getAppUrl()}/download`,
    }),
  });

  if (error) {
    throw new Error(`Failed to send licence email: ${error.message}`);
  }
  if (!data?.id) {
    throw new Error("Failed to send licence email: no message id returned");
  }
}

export async function sendSupportAlert(opts: {
  subject: string;
  kind: "success" | "failed" | "dropped" | "stuck" | "refund" | "trial_request";
  email: string;
  plan: string;
  details: string;
}) {
  if (!resendConfig.success) return;
  const to = [getSupportEmail(), ...resendConfig.data.ADMIN_EMAIL];
  const unique = [...new Set(to)];

  const { error } = await new Resend(resendConfig.data.RESEND_API_KEY).emails.send({
    from: `Ugle <${resendConfig.data.RESEND_FROM_EMAIL}>`,
    to: unique,
    subject:
      opts.kind === "trial_request"
        ? `[Ugle trial] ${opts.subject}`
        : `[Ugle payments] ${opts.subject}`,
    react: PaymentSupportAlertEmail(opts),
  });

  if (error) {
    console.error("[support-alert] Resend failed:", error.message);
  }
}
