"use server";

import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import * as z from "zod";
import { createCashfreeOrder } from "@/app/lib/cashfree";
import { getDb } from "@/app/lib/db";
import { orders } from "@/app/lib/db/schema";
import {
  cashfreeConfig,
  databaseConfig,
  keygenConfig,
  resendConfig,
} from "@/app/lib/env";
import {
  getLatestLicenseForCustomer,
  issueTrialLicense,
  upsertCustomer,
} from "@/app/lib/licensing/fulfill";
import { planPricing, type PaidPlan } from "@/app/lib/pricing";

export type LicensingActionState = {
  success: boolean;
  message: string;
  error?: string;
  licenseKey?: string;
  paymentSessionId?: string;
  cashfreeMode?: "sandbox" | "production";
  manageHint?: string;
};

const trialSchema = z.object({
  email: z.email("Invalid email address"),
  name: z.string().optional(),
});

const checkoutSchema = z.object({
  email: z.email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Enter a valid mobile number")
    .max(15, "Enter a valid mobile number"),
  name: z.string().optional(),
  plan: z.enum(["monthly", "annual"]),
});

function requireLicensingStack() {
  if (!databaseConfig.success) {
    throw new Error("Database is not configured (DATABASE_URL)");
  }
  if (!keygenConfig.success) {
    throw new Error("Keygen is not configured");
  }
}

export async function startTrial(
  _prev: LicensingActionState,
  formData: FormData,
): Promise<LicensingActionState> {
  try {
    requireLicensingStack();
    if (!resendConfig.success) {
      throw new Error(
        "Email is not configured (RESEND_API_KEY / RESEND_FROM_EMAIL). Cannot deliver licence key.",
      );
    }
    const parsed = trialSchema.safeParse({
      email: formData.get("email"),
      name: formData.get("name") || undefined,
    });
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message || "Invalid input";
      return { success: false, message: msg, error: msg };
    }

    await issueTrialLicense(parsed.data);
    return {
      success: true,
      message:
        "Trial licence created. Check your email for the key and manage link.",
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Could not start trial";
    return { success: false, message: msg, error: msg };
  }
}

export async function startCheckout(
  _prev: LicensingActionState,
  formData: FormData,
): Promise<LicensingActionState> {
  try {
    requireLicensingStack();
    if (!cashfreeConfig.success) {
      throw new Error("Cashfree is not configured");
    }

    const parsed = checkoutSchema.safeParse({
      email: formData.get("email"),
      phone: String(formData.get("phone") || "").replace(/\s+/g, ""),
      name: formData.get("name") || undefined,
      plan: formData.get("plan"),
    });
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message || "Invalid input";
      return { success: false, message: msg, error: msg };
    }

    const plan = parsed.data.plan as PaidPlan;
    const pricing = planPricing(plan);
    const customer = await upsertCustomer({
      email: parsed.data.email,
      phone: parsed.data.phone,
      name: parsed.data.name,
    });

    const existingLicense = await getLatestLicenseForCustomer(customer.id);
    const isRenewal = Boolean(
      existingLicense &&
        (existingLicense.status === "active" ||
          existingLicense.status === "trial" ||
          existingLicense.status === "expired" ||
          existingLicense.status === "suspended"),
    );

    const cashfreeOrderId = `ugle_${plan}_${randomUUID().replace(/-/g, "").slice(0, 20)}`;

    const db = getDb();
    const [order] = await db
      .insert(orders)
      .values({
        customerId: customer.id,
        licenseId: existingLicense?.id,
        plan,
        status: "pending",
        cashfreeOrderId,
        amountBaseInr: pricing.base,
        amountGstInr: pricing.gst,
        amountTotalInr: pricing.total,
        isRenewal,
      })
      .returning();

    const cf = await createCashfreeOrder({
      orderId: cashfreeOrderId,
      plan,
      customerId: customer.id,
      email: customer.email,
      phone: parsed.data.phone,
      name: parsed.data.name,
    });

    await db
      .update(orders)
      .set({
        paymentSessionId: cf.paymentSessionId,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, order.id));

    return {
      success: true,
      message: "Redirecting to Cashfree…",
      paymentSessionId: cf.paymentSessionId,
      cashfreeMode: cashfreeConfig.data.CASHFREE_ENV,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Checkout failed";
    return { success: false, message: msg, error: msg };
  }
}
