import * as z from "zod";

// Every external integration is now optional. Nothing throws at
// import time — each feature checks its own `.success` and degrades
// gracefully if not configured.

const turnstileSchema = z.object({
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1),
  TURNSTILE_SECRET_KEY: z.string().min(1),
});

const resendSchema = z.object({
  RESEND_API_KEY: z.string().min(3),
  RESEND_FROM_EMAIL: z.email(),
  ADMIN_EMAIL: z
    .string()
    .min(3)
    .transform((val) => {
      const emails = val.split(",").map((email) => email.trim());
      emails.forEach((email) => z.email().parse(email));
      return emails;
    }),
});

const sheetsSchema = z.object({
  GOOGLE_CLIENT_EMAIL: z.email(),
  GOOGLE_PRIVATE_KEY: z
    .string()
    .min(10, "Private key is too short")
    .transform((val) => val.replace(/\\n/g, "\n")),
  GOOGLE_SPREADSHEET_ID: z.string().min(5),
});

export const turnstileConfig = turnstileSchema.safeParse(process.env);
export const resendConfig = resendSchema.safeParse(process.env);
export const sheetsConfig = sheetsSchema.safeParse(process.env);

// Startup warnings — visible in logs immediately, never crash anything.
if (!turnstileConfig.success) {
  console.warn(
    "[env] Turnstile is not configured — form submissions will skip bot verification.",
    turnstileConfig.error.issues,
  );
}
if (!resendConfig.success) {
  console.error(
    "[env] Resend is not configured correctly — email sending disabled.",
    resendConfig.error.issues,
  );
}
if (!sheetsConfig.success) {
  console.error(
    "[env] Google Sheets is not configured correctly — sheet logging disabled.",
    sheetsConfig.error.issues,
  );
}
