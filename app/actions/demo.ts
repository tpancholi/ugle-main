"use server";
import * as z from "zod";
import { Resend } from "resend";
import env from "@/app/lib/env";
import {
  DemoConfirmationEmail,
  DemoAdminNotificationEmail,
} from "../components/email-templates/DemoTemplates";
import { DemoSheetService } from "@/app/lib/sheets";

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
    // resend.batch.send([
    //   {
    //     from: `Ugle <${env.RESEND_FROM_EMAIL}>`,
    //     to: [email],
    //     subject: `${firstName}, your Ugle demo request is confirmed 🎬`,
    //     react: DemoConfirmationEmail({ firstName, email }),
    //   },
    //   {
    //     from: `Ugle <${env.RESEND_FROM_EMAIL}>`,
    //     to: [env.ADMIN_EMAIL],
    //     subject: `New demo request: ${firstName} ${lastName} — ${company}`,
    //     react: DemoAdminNotificationEmail({
    //       firstName,
    //       lastName,
    //       email,
    //       company,
    //       teamSize,
    //       currentSearch,
    //       submittedAt,
    //     }),
    //   },
    // ]),
    resend.emails.list(),

    // Operation 2: Append lead row to Google Sheets
    new DemoSheetService().append({
      firstName,
      lastName,
      email,
      company,
      teamSize,
      currentSearch,
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
