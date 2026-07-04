"use server";
import * as z from "zod";
import { Resend } from "resend";
import env from "@/app/lib/env";
import {
  DemoConfirmationEmail,
  DemoAdminNotificationEmail,
} from "../components/email-templates/DemoTemplates";

const resend = new Resend(env.RESEND_API_KEY);

const demoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email address"),
  company: z.string().min(1, "Company name is required"),
  teamSize: z.string().min(1, "Please select a team size"),
  currentSearch: z.string().min(1, "Please describe your current workflow"),
});

export type ActionState = {
  success: boolean;
  message: string;
  error?: string;
};

export async function requestDemo(
  initialState: ActionState,
  formData: FormData,
): Promise<ActionState> {

  const raw = Object.fromEntries(formData);

  const result = demoSchema.safeParse(raw);

  if (!result.success) {
    const errorMsg = result.error.issues[0]?.message || "Invalid input";
    return { success: false, message: errorMsg, error: errorMsg };
  }

  const { firstName, lastName, email, company, teamSize, currentSearch } =
    result.data;
  const submittedAt = new Date().toUTCString();

  try {
    const { error } = await resend.batch.send([
      // Confirmation email → requester
      {
        from: `Ugle <${env.RESEND_FROM_EMAIL}>`,
        to: [email],
        subject: `${firstName}, your Ugle demo request is confirmed 🎬`,
        react: DemoConfirmationEmail({ firstName, email }),
      },
      // Notification email → admin
      {
        from: `Ugle <${env.RESEND_FROM_EMAIL}>`,
        to: [env.ADMIN_EMAIL],
        subject: `New demo request: ${firstName} ${lastName} — ${company}`,
        react: DemoAdminNotificationEmail({
          firstName,
          lastName,
          email,
          company,
          teamSize,
          currentSearch,
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
    console.error("Demo request error:", err);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
      error: "Submission failed",
    };
  }
}
