"use server";
import * as z from "zod";
import { Resend } from "resend";
import env from "@/app/lib/env";
import {
  EarlyAccessConfirmationEmail,
  EarlyAccessAdminNotificationEmail,
} from "../components/email-templates/EarlyAccessTemplates";

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
  const raw = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    os: formData.get("os"),
  };

  const result = earlyAccessSchema.safeParse(raw);

  if (!result.success) {
    const errorMsg = result.error.issues[0]?.message || "Invalid input";
    return { success: false, message: errorMsg, error: errorMsg };
  }

  const { firstName, lastName, email, phone, os } = result.data;
  const submittedAt = new Date().toUTCString();

  try {
    const { error } = await resend.batch.send([
      // Confirmation email → requester
      {
        from: `Ugle <${env.RESEND_FROM_EMAIL}>`,
        to: [email],
        subject: `${firstName}, you're on the Ugle early access list ⚡`,
        react: EarlyAccessConfirmationEmail({ firstName, email, os }),
      },
      // Notification email → admin
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
    ]);

    if (error) {
      console.error("Resend batch error:", error);
      return {
        success: false,
        message: "Something went wrong. Please try again.",
        error: error.message,
      };
    }

    return { success: true, message: "Request submitted" };
  } catch (err) {
    console.error("Early access request error:", err);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
      error: "Submission failed",
    };
  }
}
