import { and, desc, eq } from "drizzle-orm";
import { Resend } from "resend";
import { getDb } from "@/app/lib/db";
import { customers, licenses, orders } from "@/app/lib/db/schema";
import {
  getAppUrl,
  getSupportEmail,
  resendConfig,
} from "@/app/lib/env";
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

export async function issueTrialLicense(opts: {
  email: string;
  name?: string;
}) {
  const customer = await upsertCustomer({
    email: opts.email,
    name: opts.name,
  });

  if (await customerHasUsedTrial(customer.id)) {
    throw new Error(
      "A trial has already been issued for this email. Please purchase a licence or contact support.",
    );
  }

  const keygen = await createKeygenLicense({
    plan: "trial",
    email: customer.email,
    name: opts.name,
  });

  const db = getDb();
  const [license] = await db
    .insert(licenses)
    .values({
      customerId: customer.id,
      keygenLicenseId: keygen.id,
      keygenLicenseKey: keygen.key,
      plan: "trial",
      status: "trial",
      expiresAt: keygen.expiry ? new Date(keygen.expiry) : null,
      trialUsed: true,
    })
    .returning();

  await sendLicenseEmail({
    email: customer.email,
    name: opts.name,
    plan: "trial",
    licenseKey: keygen.key,
    expiresAt: license.expiresAt,
    customerId: customer.id,
  });

  await sendSupportAlert({
    subject: `Trial issued: ${customer.email}`,
    kind: "success",
    email: customer.email,
    plan: "trial",
    details: `Keygen license ${keygen.id}`,
  });

  return { customer, license, key: keygen.key };
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

  if (order.plan !== "monthly" && order.plan !== "annual") {
    throw new Error("Order plan is not a paid plan");
  }
  const plan = order.plan as PaidPlan;

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
    try {
      await reinstateKeygenLicense(license.keygenLicenseId);
    } catch {
      // ignore if not suspended
    }
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
    try {
      await reinstateKeygenLicense(license.keygenLicenseId);
    } catch {
      // ignore if not suspended
    }

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

  await sendLicenseEmail({
    email: customer.email,
    name: customer.name ?? undefined,
    plan,
    licenseKey: license.keygenLicenseKey,
    expiresAt: license.expiresAt,
    customerId: customer.id,
    amountTotalInr: order.amountTotalInr,
  });

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

  if (order.licenseId) {
    const [license] = await db
      .select()
      .from(licenses)
      .where(eq(licenses.id, order.licenseId))
      .limit(1);
    if (license) {
      await revokeKeygenLicense(license.keygenLicenseId);
      await db
        .update(licenses)
        .set({ status: "revoked", updatedAt: new Date() })
        .where(eq(licenses.id, license.id));
    }
  }

  await db
    .update(orders)
    .set({ status: "refunded", updatedAt: new Date() })
    .where(eq(orders.id, order.id));

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
  kind: "success" | "failed" | "dropped" | "stuck" | "refund";
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
    subject: `[Ugle payments] ${opts.subject}`,
    react: PaymentSupportAlertEmail(opts),
  });

  if (error) {
    console.error("[support-alert] Resend failed:", error.message);
  }
}
