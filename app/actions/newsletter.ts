"use server";
import * as z from "zod";
import { Resend } from "resend";
import env from "@/app/lib/env";
import {
  NewsletterAdminNotificationEmail,
  NewsletterWelcomeEmail,
} from "../components/email-templates/NewsletterTemplates";
import { NewsletterSheetService } from "@/app/lib/sheets";
import { verifyTurnstile } from "@/app/lib/turnstile";

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
  const turnstileToken = formData.get("cf-turnstile-response") as string | null;
  const isHuman = await verifyTurnstile(turnstileToken);

  if (!isHuman) {
    return {
      success: false,
      message: "Verification failed. Please try again.",
      error: "Verification failed. Please try again.",
    };
  }

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

  const [emailResult, sheetsResult] = await Promise.allSettled([
    resend.batch.send([
      {
        from: `Ugle <${env.RESEND_FROM_EMAIL}>`,
        to: [subscriberEmail],
        subject: "Welcome to Ugle — you're in 🎬",
        react: NewsletterWelcomeEmail({ email: subscriberEmail }),
      },
      {
        from: `Ugle <${env.RESEND_FROM_EMAIL}>`,
        to: env.ADMIN_EMAIL,
        subject: `New subscriber: ${subscriberEmail}`,
        react: NewsletterAdminNotificationEmail({
          subscriberEmail,
          subscribedAt,
        }),
      },
    ]),

    new NewsletterSheetService().append({
      email: subscriberEmail,
      subscribedAt,
    }),
  ]);

  if (emailResult.status === "rejected") {
    console.error("[Newsletter] Resend failed:", emailResult.reason);
  } else if (emailResult.value.error) {
    console.error("[Newsletter] Resend batch error:", emailResult.value.error);
  }

  if (sheetsResult.status === "rejected") {
    console.error("[Newsletter] Google Sheets failed:", sheetsResult.reason);
  }

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
