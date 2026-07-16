"use server";

import { eq } from "drizzle-orm";
import * as z from "zod";
import { getDb } from "@/app/lib/db";
import { licenses } from "@/app/lib/db/schema";
import { databaseConfig } from "@/app/lib/env";
import { verifyManageJwt } from "@/app/lib/manage-token";
import {
  getLatestLicenseForCustomer,
  upsertCustomer,
} from "@/app/lib/licensing/fulfill";

export type ManageState = {
  success: boolean;
  message: string;
  error?: string;
};

export async function cancelRenewal(
  _prev: ManageState,
  formData: FormData,
): Promise<ManageState> {
  try {
    if (!databaseConfig.success) {
      throw new Error("Database is not configured");
    }
    const token = String(formData.get("token") || "");
    const session = await verifyManageJwt(token);
    if (!session) {
      return {
        success: false,
        message: "This manage link is invalid or expired.",
        error: "invalid_token",
      };
    }

    const license = await getLatestLicenseForCustomer(session.customerId);
    if (!license) {
      return {
        success: false,
        message: "No licence found for this account.",
        error: "no_license",
      };
    }

    const db = getDb();
    await db
      .update(licenses)
      .set({ cancelAtPeriodEnd: true, updatedAt: new Date() })
      .where(eq(licenses.id, license.id));

    return {
      success: true,
      message:
        "Auto-renew reminders cancelled. Your licence stays valid until the current period ends.",
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Could not cancel";
    return { success: false, message: msg, error: msg };
  }
}

const magicLinkSchema = z.object({
  email: z.email(),
});

/** Request a fresh manage link by email (re-uses license delivery path). */
export async function requestManageLink(
  _prev: ManageState,
  formData: FormData,
): Promise<ManageState> {
  try {
    if (!databaseConfig.success) {
      throw new Error("Database is not configured");
    }
    const parsed = magicLinkSchema.safeParse({
      email: formData.get("email"),
    });
    if (!parsed.success) {
      return {
        success: false,
        message: "Enter a valid email",
        error: "invalid_email",
      };
    }

    const customer = await upsertCustomer({ email: parsed.data.email });
    const license = await getLatestLicenseForCustomer(customer.id);
    if (!license) {
      return {
        success: false,
        message: "No licence found for that email.",
        error: "no_license",
      };
    }

    // Lazy import to avoid circular deps with fulfill email helper
    const { signManageJwt } = await import("@/app/lib/manage-token");
    const { getAppUrl, resendConfig } = await import("@/app/lib/env");
    const { Resend } = await import("resend");
    const { LicenseDeliveryEmail } = await import(
      "@/app/components/email-templates/LicenseTemplates"
    );

    if (!resendConfig.success) {
      throw new Error("Email is not configured");
    }

    const token = await signManageJwt({
      customerId: customer.id,
      email: customer.email,
    });
    const manageUrl = `${getAppUrl()}/manage?token=${encodeURIComponent(token)}`;

    const { error } = await new Resend(resendConfig.data.RESEND_API_KEY).emails.send({
      from: `Ugle <${resendConfig.data.RESEND_FROM_EMAIL}>`,
      to: [customer.email],
      subject: "Your Ugle licence manage link",
      react: LicenseDeliveryEmail({
        email: customer.email,
        name: customer.name ?? undefined,
        plan: license.plan,
        licenseKey: license.keygenLicenseKey,
        expiresAt: license.expiresAt?.toISOString() ?? null,
        manageUrl,
        downloadUrl: `${getAppUrl()}/download`,
      }),
    });

    if (error) {
      throw new Error(`Failed to send manage link: ${error.message}`);
    }
    return {
      success: true,
      message: "If that email has a licence, a manage link is on its way.",
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Could not send link";
    return { success: false, message: msg, error: msg };
  }
}
