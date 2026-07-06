"use server";
import * as z from "zod";
import { Resend } from "resend";
import env from "@/app/lib/env";
import {
  EarlyAccessConfirmationEmail,
  EarlyAccessAdminNotificationEmail,
} from "../components/email-templates/EarlyAccessTemplates";
import { EarlyAccessSheetService } from "@/app/lib/sheets";

const resend = new Resend(env.RESEND_API_KEY);

const earlyAccessSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email address"),
  phone: z.string().min(1, "Contact number is required"),
  os: z.enum(["macOS", "Windows"], {
    error: "Please select your primary OS",
  }),
});

export type ActionState = {
  success: boolean;
  message: string;
  error?: string;
};

export async function requestEarlyAccess(
  initialState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const raw = Object.fromEntries(formData);

  const result = earlyAccessSchema.safeParse(raw);

  if (!result.success) {
    const errorMsg = result.error.issues[0]?.message || "Invalid input";
    return { success: false, message: errorMsg, error: errorMsg };
  }

  const { firstName, lastName, email, phone, os } = result.data;
  const submittedAt = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());

  // Run both operations concurrently and independently.
  // Promise.allSettled guarantees both are always attempted regardless of
  // whether the other one fails.
  const [emailResult, sheetsResult] = await Promise.allSettled([
    // Operation 1: Send confirmation + admin notification emails via Resend
    resend.batch.send([
      {
        from: `Ugle <${env.RESEND_FROM_EMAIL}>`,
        to: [email],
        subject: `${firstName}, you're on the Ugle early access list ⚡`,
        react: EarlyAccessConfirmationEmail({ firstName, email, os }),
      },
      {
        from: `Ugle <${env.RESEND_FROM_EMAIL}>`,
        to: [env.ADMIN_EMAIL],
        subject: `New early access request: ${firstName} ${lastName} (${os})`,
        react: EarlyAccessAdminNotificationEmail({
          firstName,
          lastName,
          email,
          phone,
          os,
          submittedAt,
        }),
      },
    ]),

    // Operation 2: Append lead row to Google Sheets
    new EarlyAccessSheetService().append({
      firstName,
      lastName,
      email,
      phone,
      os,
      submittedAt,
    }),
  ]);

  // Log individual failures server-side for visibility
  if (emailResult.status === "rejected") {
    console.error("[EarlyAccess] Resend failed:", emailResult.reason);
  } else if (emailResult.value.error) {
    console.error("[EarlyAccess] Resend batch error:", emailResult.value.error);
  }

  if (sheetsResult.status === "rejected") {
    console.error("[EarlyAccess] Google Sheets failed:", sheetsResult.reason);
  }

  // Option A: succeed if at least one method captured the lead
  const emailOk =
    emailResult.status === "fulfilled" && !emailResult.value.error;
  const sheetsOk = sheetsResult.status === "fulfilled";

  if (!emailOk && !sheetsOk) {
    return {
      success: false,
      message: "Something went wrong. Please try again.",
      error: "All submission methods failed",
    };
  }

  return { success: true, message: "Request submitted" };
}
