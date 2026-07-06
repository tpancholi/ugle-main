"use server";
import * as z from "zod";
import { Resend } from "resend";
import env from "@/app/lib/env";
import {
  ContactConfirmationEmail,
  ContactAdminNotificationEmail,
} from "../components/email-templates/ContactTemplates";
import { ContactFormSheetService } from "@/app/lib/sheets";

const resend = new Resend(env.RESEND_API_KEY);

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email address"),
  company: z.string().min(1, "Company name is required"),
  seats: z.string().min(1, "Please select a seat count"),
  usecase: z.string().min(1, "Please describe your use case"),
});

export type ActionState = {
  success: boolean;
  message: string;
  error?: string;
};

export async function submitContactInquiry(
  initialState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const raw = Object.fromEntries(formData);

  const result = contactSchema.safeParse(raw);

  if (!result.success) {
    const errorMsg = result.error.issues[0]?.message || "Invalid input";
    return { success: false, message: errorMsg, error: errorMsg };
  }

  const { firstName, lastName, email, company, seats, usecase } = result.data;
  const submittedAt = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());

  const [emailResult, sheetsResult] = await Promise.allSettled([
    resend.batch.send([
      // Confirmation email → submitter
      {
        from: `Ugle <${env.RESEND_FROM_EMAIL}>`,
        to: [email],
        subject: `${firstName}, we've received your Ugle inquiry`,
        react: ContactConfirmationEmail({ firstName, email }),
      },
      // Notification email → admin
      {
        from: `Ugle <${env.RESEND_FROM_EMAIL}>`,
        to: [env.ADMIN_EMAIL],
        subject: `New sales inquiry: ${firstName} ${lastName} — ${company} (${seats} seats)`,
        react: ContactAdminNotificationEmail({
          firstName,
          lastName,
          email,
          company,
          seats,
          usecase,
          submittedAt,
        }),
      },
    ]),

    new ContactFormSheetService().append({
      firstName,
      lastName,
      email,
      company,
      seats,
      usecase,
      submittedAt,
    }),
  ]);

  // Log individual failures server-side for visibility
  if (emailResult.status === "rejected") {
    console.error("[Demo] Resend failed:", emailResult.reason);
  } else if (emailResult.value.error) {
    console.error("[Demo] Resend batch error:", emailResult.value.error);
  }

  if (sheetsResult.status === "rejected") {
    console.error("[Demo] Google Sheets failed:", sheetsResult.reason);
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
