"use server";
import * as z from "zod";
import { Resend } from "resend";
import env from "@/app/lib/env";
import { NewsletterAdminNotificationEmail, NewsletterWelcomeEmail } from "../components/email-templates/NewsletterTemplates";

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
  const subscribedAt = new Date().toUTCString();

  try {
    const { error } = await resend.batch.send([
      // Welcome email → subscriber
      {
        from: `Ugle <${env.RESEND_FROM_EMAIL}>`,
        to: [subscriberEmail],
        subject: "Welcome to Ugle — you're in 🎬",
        react: NewsletterWelcomeEmail({ email: subscriberEmail }),
      },
      // Notification email → admin
      {
        from: `Ugle <${env.RESEND_FROM_EMAIL}>`,
        to: [env.ADMIN_EMAIL],
        subject: `New subscriber: ${subscriberEmail}`,
        react: NewsletterAdminNotificationEmail({
          subscriberEmail,
          subscribedAt,
        }),
      },
    ]);

    if (error) {
      console.error("Resend batch error:", error);
      return {
        success: false,
        message: "Something went wrong. Please try again.",
        error: error.message,
      };
    }

    return {
      success: true,
      message: "Successfully Joined",
    };
  } catch (err) {
    console.error("Newsletter subscription error:", err);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
      error: "Subscription failed",
    };
  }
}
