"use server";
import * as z from "zod";
import { Resend } from "resend";
import env from "@/app/lib/env";
import {
  EducationConfirmationEmail,
  EducationAdminNotificationEmail,
} from "../components/email-templates/EducationTemplates";

const resend = new Resend(env.RESEND_API_KEY);

const educationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email address"),
  institution: z.string().min(1, "Institution name is required"),
  role: z.string().min(1, "Please select your role"),
  // Optional — empty string is fine
  proofUrl: z.string().optional(),
});

export type ActionState = {
  success: boolean;
  message: string;
  error?: string;
};

export async function applyForEducationAccess(
  initialState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const raw = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    institution: formData.get("institution"),
    role: formData.get("role"),
    proofUrl: formData.get("proofUrl") || undefined,
  };

  const result = educationSchema.safeParse(raw);

  if (!result.success) {
    const errorMsg = result.error.issues[0]?.message || "Invalid input";
    return { success: false, message: errorMsg, error: errorMsg };
  }

  const { firstName, lastName, email, institution, role, proofUrl } =
    result.data;
  const submittedAt = new Date().toUTCString();

  try {
    const { error } = await resend.batch.send([
      // Confirmation email → applicant
      {
        from: `Ugle <${env.RESEND_FROM_EMAIL}>`,
        to: [email],
        subject: `${firstName}, we've received your Ugle education application 🎓`,
        react: EducationConfirmationEmail({ firstName, email }),
      },
      // Notification email → admin
      {
        from: `Ugle <${env.RESEND_FROM_EMAIL}>`,
        to: [env.ADMIN_EMAIL],
        subject: `New education application: ${firstName} ${lastName} — ${institution}`,
        react: EducationAdminNotificationEmail({
          firstName,
          lastName,
          email,
          institution,
          role,
          proofUrl,
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

    return { success: true, message: "Application submitted" };
  } catch (err) {
    console.error("Education application error:", err);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
      error: "Submission failed",
    };
  }
}
