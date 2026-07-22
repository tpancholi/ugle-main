import { and, desc, eq, ne } from "drizzle-orm";
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
  extendKeygenLicenseForOrder,
  getKeygenLicense,
  keygenAlreadyAppliedToOrder,
  reinstateKeygenLicense,
  revokeKeygenLicense,
  type CreatedLicense,
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

  // Claim pending → fulfilling (not paid). Paid is set only after Keygen+DB succeed
  // so a crash mid-flight cannot leave a "paid but unlicensed" order, and retries
  // can resume from fulfilling without treating the order as done.
  if (order.status === "pending") {
    const claim = await db
      .update(orders)
      .set({
        status: "fulfilling",
        cfPaymentId: opts.cfPaymentId ?? order.cfPaymentId,
        updatedAt: new Date(),
      })
      .where(and(eq(orders.id, order.id), eq(orders.status, "pending")))
      .returning();
    if (claim.length === 0) {
      // Lost the race — re-read and recurse once for the winner's end state.
      const [again] = await db
        .select()
        .from(orders)
        .where(eq(orders.id, order.id))
        .limit(1);
      if (again?.status === "paid") {
        return { order: again, alreadyProcessed: true as const };
      }
      if (again?.status === "fulfilling") {
        return fulfillClaimedOrder({
          order: again,
          plan,
          cfPaymentId: opts.cfPaymentId,
        });
      }
      return { order: again ?? order, alreadyProcessed: true as const };
    }
    return fulfillClaimedOrder({
      order: claim[0],
      plan,
      cfPaymentId: opts.cfPaymentId,
    });
  }

  // status === fulfilling — resume (Keygen ops are idempotent via lastCashfreeOrderId)
  return fulfillClaimedOrder({
    order,
    plan,
    cfPaymentId: opts.cfPaymentId,
  });
}

async function maybeReinstateKeygen(license: typeof licenses.$inferSelect) {
  if (license.status !== "suspended") return;
  await reinstateKeygenLicense(license.keygenLicenseId);
}

async function applyKeygenForOrder(opts: {
  license: typeof licenses.$inferSelect | undefined;
  customer: typeof customers.$inferSelect;
  plan: PaidPlan;
  order: typeof orders.$inferSelect;
}): Promise<{
  licenseRow: typeof licenses.$inferSelect;
  createdKeygenId: string | null;
}> {
  const db = getDb();
  const { customer, plan, order } = opts;
  let license = opts.license;
  const orderId = order.cashfreeOrderId;

  if (license && license.status === "trial") {
    const remote = await getKeygenLicense(license.keygenLicenseId);
    let converted: CreatedLicense;
    if (keygenAlreadyAppliedToOrder(remote, orderId)) {
      converted = remote;
    } else {
      await maybeReinstateKeygen(license);
      converted = await convertKeygenLicenseToPaid(
        license.keygenLicenseId,
        plan,
        orderId,
      );
    }
    const [updated] = await db
      .update(licenses)
      .set({
        plan,
        status: "active",
        keygenLicenseKey: converted.key || license.keygenLicenseKey,
        expiresAt: converted.expiry ? new Date(converted.expiry) : null,
        cancelAtPeriodEnd: false,
        updatedAt: new Date(),
      })
      .where(eq(licenses.id, license.id))
      .returning();
    return { licenseRow: updated, createdKeygenId: null };
  }

  if (
    license &&
    (order.isRenewal ||
      license.status === "active" ||
      license.status === "expired" ||
      license.status === "suspended")
  ) {
    const remote = await getKeygenLicense(license.keygenLicenseId);
    let updatedKeygen: CreatedLicense;
    if (keygenAlreadyAppliedToOrder(remote, orderId)) {
      updatedKeygen = remote;
    } else {
      await maybeReinstateKeygen(license);
      if (license.plan !== plan) {
        updatedKeygen = await convertKeygenLicenseToPaid(
          license.keygenLicenseId,
          plan,
          orderId,
        );
      } else {
        updatedKeygen = await extendKeygenLicenseForOrder(
          license.keygenLicenseId,
          plan,
          orderId,
        );
      }
    }
    const [updated] = await db
      .update(licenses)
      .set({
        plan,
        status: "active",
        keygenLicenseKey: updatedKeygen.key || license.keygenLicenseKey,
        expiresAt: updatedKeygen.expiry ? new Date(updatedKeygen.expiry) : null,
        cancelAtPeriodEnd: false,
        updatedAt: new Date(),
      })
      .where(eq(licenses.id, license.id))
      .returning();
    return { licenseRow: updated, createdKeygenId: null };
  }

  const created = await createKeygenLicense({
    plan,
    email: customer.email,
    name: customer.name ?? undefined,
    cashfreeOrderId: orderId,
  });
  try {
    const [createdRow] = await db
      .insert(licenses)
      .values({
        customerId: customer.id,
        keygenLicenseId: created.id,
        keygenLicenseKey: created.key,
        plan,
        status: "active",
        expiresAt: created.expiry ? new Date(created.expiry) : null,
        trialUsed: true,
      })
      .returning();
    return { licenseRow: createdRow, createdKeygenId: created.id };
  } catch (err) {
    try {
      await revokeKeygenLicense(created.id);
    } catch (revokeErr) {
      console.error("[applyKeygenForOrder] revoke after insert fail:", revokeErr);
    }
    throw err;
  }
}

async function fulfillClaimedOrder(opts: {
  order: typeof orders.$inferSelect;
  plan: PaidPlan;
  cfPaymentId?: string;
}) {
  const db = getDb();
  const { order, plan } = opts;
  let createdKeygenId: string | null = null;

  try {
    const [customer] = await db
      .select()
      .from(customers)
      .where(eq(customers.id, order.customerId))
      .limit(1);
    if (!customer) throw new Error("Customer not found for order");

    const existingLicense = order.licenseId
      ? (
          await db
            .select()
            .from(licenses)
            .where(eq(licenses.id, order.licenseId))
            .limit(1)
        )[0]
      : await getLatestLicenseForCustomer(customer.id);

    const applied = await applyKeygenForOrder({
      license: existingLicense,
      customer,
      plan,
      order,
    });
    createdKeygenId = applied.createdKeygenId;
    const license = applied.licenseRow;

    // Mark paid only while still fulfilling — loses the race cleanly if refunded.
    const [paidOrder] = await db
      .update(orders)
      .set({
        status: "paid",
        licenseId: license.id,
        cfPaymentId: opts.cfPaymentId ?? order.cfPaymentId,
        updatedAt: new Date(),
      })
      .where(and(eq(orders.id, order.id), eq(orders.status, "fulfilling")))
      .returning();

    if (!paidOrder) {
      // Refund (or other terminal transition) won the race after Keygen ran.
      if (createdKeygenId) {
        try {
          await revokeKeygenLicense(createdKeygenId);
        } catch (revokeErr) {
          console.error(
            "[fulfillClaimedOrder] compensate-revoke failed:",
            revokeErr,
          );
        }
      }
      await sendSupportAlert({
        subject: `Fulfil vs refund race: ${order.cashfreeOrderId}`,
        kind: "stuck",
        email: customer.email,
        plan,
        details: `Order left fulfilling/refunded after Keygen work for licence ${license.keygenLicenseId}. Inspect Keygen + DB.`,
      });
      const err = new Error(
        `Order ${order.cashfreeOrderId} is no longer fulfilling; cannot mark paid`,
      );
      (err as Error & { code?: string }).code = "ORDER_TERMINAL";
      throw err;
    }

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
  } catch (err) {
    // Do NOT roll fulfilling → pending after Keygen may have mutated state.
    // Retries resume from fulfilling; Keygen is idempotent via lastCashfreeOrderId.
    // Only compensate brand-new Keygen licences created in this attempt.
    if (
      createdKeygenId &&
      !(err instanceof Error && (err as Error & { code?: string }).code === "ORDER_TERMINAL")
    ) {
      try {
        await revokeKeygenLicense(createdKeygenId);
      } catch (revokeErr) {
        console.error(
          "[fulfillClaimedOrder] rollback revoke of new licence failed:",
          revokeErr,
        );
      }
    }
    throw err;
  }
}

export async function handleRefundedOrder(
  cashfreeOrderId: string,
  depth = 0,
): Promise<{ alreadyProcessed: boolean }> {
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

  const priorStatus = order.status;
  // CAS on the exact status we observed so a concurrent fulfill→paid is not
  // misclassified as a pending refund (which would skip Keygen revoke).
  const claim = await db
    .update(orders)
    .set({ status: "refunded", updatedAt: new Date() })
    .where(and(eq(orders.id, order.id), eq(orders.status, priorStatus)))
    .returning();
  if (claim.length === 0) {
    if (depth >= 2) return { alreadyProcessed: true as const };
    return handleRefundedOrder(cashfreeOrderId, depth + 1);
  }

  // Revoke Keygen only when this order had actually paid for the licence, and
  // no other paid order still depends on the same licence (renewals share id).
  const shouldConsiderRevoke =
    priorStatus === "paid" && Boolean(order.licenseId);

  if (priorStatus === "fulfilling") {
    await sendSupportAlert({
      subject: `Refund during fulfil: ${cashfreeOrderId}`,
      kind: "stuck",
      email: "unknown",
      plan: order.plan,
      details: `Order was fulfilling when refunded. Keygen may have been mutated for licence ${order.licenseId ?? "none"} — inspect and revoke/adjust manually if needed.`,
    });
  }

  if (shouldConsiderRevoke && order.licenseId) {
    const [otherPaid] = await db
      .select()
      .from(orders)
      .where(
        and(
          eq(orders.licenseId, order.licenseId),
          eq(orders.status, "paid"),
          ne(orders.id, order.id),
        ),
      )
      .limit(1);

    if (otherPaid) {
      await sendSupportAlert({
        subject: `Refund kept licence (shared): ${cashfreeOrderId}`,
        kind: "refund",
        email: "unknown",
        plan: order.plan,
        details: `Order refunded but licence ${order.licenseId} is still referenced by paid order ${otherPaid.cashfreeOrderId}. Keygen NOT revoked.`,
      });
    } else {
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
    details: `Cashfree order ${cashfreeOrderId}; prior status ${priorStatus}; revoke=${shouldConsiderRevoke}`,
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
