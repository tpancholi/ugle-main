"use server";
import * as z from "zod";
import { Resend } from "resend";
import env from "@/app/lib/env";
import {
  NewsletterAdminNotificationEmail,
  NewsletterWelcomeEmail,
} from "../components/email-templates/NewsletterTemplates";
import { NewsletterSheetService } from "@/app/lib/sheets";

const resend = new Resend(env.RESEND_API_KEY);

const newsletterSchema = z.object({
  email: z.email("Invalid Input"),
});

export type ActionState = {
  success: boolean;
  message: string;
  error?: string;
};

export async function newsletterJoin(
  initialState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = formData.get("email");

  const result = newsletterSchema.safeParse({ email });

  if (!result.success) {
    const errorMsg = result.error.issues[0]?.message || "Invalid Input";
    return {
      success: false,
      message: errorMsg,
      error: errorMsg,
    };
  }

  const subscriberEmail = result.data.email;
  const subscribedAt = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());

  // Run both operations concurrently and independently.
  // Promise.allSettled guarantees both are always attempted regardless of
  // whether the other one fails.
  const [emailResult, sheetsResult] = await Promise.allSettled([
    // Operation 1: Send welcome + admin notification emails via Resend
    resend.batch.send([
      {
        from: `Ugle <${env.RESEND_FROM_EMAIL}>`,
        to: [subscriberEmail],
        subject: "Welcome to Ugle — you're in 🎬",
        react: NewsletterWelcomeEmail({ email: subscriberEmail }),
      },
      {
        from: `Ugle <${env.RESEND_FROM_EMAIL}>`,
        to: [env.ADMIN_EMAIL],
        subject: `New subscriber: ${subscriberEmail}`,
        react: NewsletterAdminNotificationEmail({
          subscriberEmail,
          subscribedAt,
        }),
      },
    ]),

    // Operation 2: Append subscriber row to Google Sheets
    new NewsletterSheetService().append({
      email: subscriberEmail,
      subscribedAt,
    }),
  ]);

  // Log individual failures server-side for visibility
  if (emailResult.status === "rejected") {
    console.error("[Newsletter] Resend failed:", emailResult.reason);
  } else if (emailResult.value.error) {
    console.error("[Newsletter] Resend batch error:", emailResult.value.error);
  }

  if (sheetsResult.status === "rejected") {
    console.error("[Newsletter] Google Sheets failed:", sheetsResult.reason);
  }

  // Option A: succeed if at least one method captured the lead
  const emailOk =
    emailResult.status === "fulfilled" && !emailResult.value.error;
  const sheetsOk = sheetsResult.status === "fulfilled";

  if (!emailOk && !sheetsOk) {
    return {
      success: false,
      message: "Something went wrong. Please try again.",
      error: "All subscription methods failed",
    };
  }

  return {
    success: true,
    message: "Successfully Joined",
  };
}
