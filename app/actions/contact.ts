"use server";
import * as z from "zod";
import { Resend } from "resend";
import env from "@/app/lib/env";
import {
  ContactConfirmationEmail,
  ContactAdminNotificationEmail,
} from "../components/email-templates/ContactTemplates";

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
  const raw = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    company: formData.get("company"),
    seats: formData.get("seats"),
    usecase: formData.get("usecase"),
  };

  const result = contactSchema.safeParse(raw);

  if (!result.success) {
    const errorMsg = result.error.issues[0]?.message || "Invalid input";
    return { success: false, message: errorMsg, error: errorMsg };
  }

  const { firstName, lastName, email, company, seats, usecase } = result.data;
  const submittedAt = new Date().toUTCString();

  try {
    const { error } = await resend.batch.send([
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
    ]);

    if (error) {
      console.error("Resend batch error:", error);
      return {
        success: false,
        message: "Something went wrong. Please try again.",
        error: error.message,
      };
    }

    return { success: true, message: "Inquiry submitted" };
  } catch (err) {
    console.error("Contact form error:", err);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
      error: "Submission failed",
    };
  }
}
