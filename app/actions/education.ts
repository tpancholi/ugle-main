"use server";
import * as z from "zod";
import { Resend } from "resend";
import { resendConfig } from "@/app/lib/env";
import {
  EducationConfirmationEmail,
  EducationAdminNotificationEmail,
} from "../components/email-templates/EducationTemplates";
import { EducationSheetService } from "@/app/lib/sheets";

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
  try {
    const raw = Object.fromEntries(formData);

    const result = educationSchema.safeParse(raw);

    if (!result.success) {
      const errorMsg = result.error.issues[0]?.message || "Invalid input";
      return { success: false, message: errorMsg, error: errorMsg };
    }

    const { firstName, lastName, email, institution, role, proofUrl } =
      result.data;
    const submittedAt = new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date());

    // Run both operations concurrently and independently.
    // Promise.allSettled guarantees both are always attempted regardless of whether the other fails.
    const [emailResult, sheetsResult] = await Promise.allSettled([
      // Operation 1: Send confirmation + admin notification emails via Resend
      resendConfig.success
        ? new Resend(resendConfig.data.RESEND_API_KEY).batch.send([
            {
              from: `Ugle <${resendConfig.data.RESEND_FROM_EMAIL}>`,
              to: [email],
              subject: `${firstName}, we've received your Ugle education application 🎓`,
              react: EducationConfirmationEmail({ firstName, email }),
            },
            {
              from: `Ugle <${resendConfig.data.RESEND_FROM_EMAIL}>`,
              to: resendConfig.data.ADMIN_EMAIL,
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
          ])
        : Promise.reject(new Error("Resend is not configured")),

      // Operation 2: Append application details to Google Sheets
      new EducationSheetService().append({
        firstName,
        lastName,
        email,
        institution,
        role,
        proofUrl,
        submittedAt,
      }),
    ]);

    // Log individual failures server-side for visibility
    if (emailResult.status === "rejected") {
      console.error("[Education] Resend failed:", emailResult.reason);
    } else if (emailResult.value.error) {
      console.error("[Education] Resend batch error:", emailResult.value.error);
    }

    if (sheetsResult.status === "rejected") {
      console.error("[Education] Google Sheets failed:", sheetsResult.reason);
    }

    // Option A: succeed if at least one method captured the lead
    const emailOk =
      emailResult.status === "fulfilled" && !emailResult.value.error;
    const sheetsOk = sheetsResult.status === "fulfilled";

    if (!emailOk && !sheetsOk) {
      return {
        success: false,
        message: "Something went wrong. Please try again.",
        error: "Something went wrong. Please try again.",
      };
    }

    return { success: true, message: "Application submitted" };
  } catch (err) {
    console.error("[Education] Unexpected error:", err);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
      error: "Unexpected error",
    };
  }
}
