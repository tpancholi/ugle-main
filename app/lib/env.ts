import * as z from "zod";

// Every external integration is optional at import time — each feature
// checks its own `.success` and degrades gracefully if not configured.

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

const keygenSchema = z.object({
  KEYGEN_ACCOUNT_ID: z.uuid(),
  KEYGEN_PRODUCT_ID: z.uuid(),
  KEYGEN_PRODUCT_TOKEN: z.string().min(10),
  KEYGEN_POLICY_TRIAL: z.uuid(),
  KEYGEN_POLICY_MONTHLY: z.uuid(),
  KEYGEN_POLICY_ANNUAL: z.uuid(),
});

const cashfreeSchema = z.object({
  CASHFREE_APP_ID: z.string().min(3),
  CASHFREE_SECRET_KEY: z.string().min(3),
  CASHFREE_ENV: z.enum(["sandbox", "production"]).default("sandbox"),
});

const databaseSchema = z.object({
  DATABASE_URL: z.string().min(10),
});

const appSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.url().optional(),
  SUPPORT_EMAIL: z.email().default("support@ugle.ai"),
  MANAGE_LICENSE_SECRET: z.string().min(16).optional(),
});

export const turnstileConfig = turnstileSchema.safeParse(process.env);
export const resendConfig = resendSchema.safeParse(process.env);
export const sheetsConfig = sheetsSchema.safeParse(process.env);
export const keygenConfig = keygenSchema.safeParse(process.env);
export const cashfreeConfig = cashfreeSchema.safeParse(process.env);
export const databaseConfig = databaseSchema.safeParse(process.env);
export const appConfig = appSchema.safeParse(process.env);

export function getAppUrl(): string {
  if (appConfig.success && appConfig.data.NEXT_PUBLIC_APP_URL) {
    return appConfig.data.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export function getSupportEmail(): string {
  if (appConfig.success) return appConfig.data.SUPPORT_EMAIL;
  return "support@ugle.ai";
}

export function getManageSecret(): string {
  if (appConfig.success && appConfig.data.MANAGE_LICENSE_SECRET) {
    return appConfig.data.MANAGE_LICENSE_SECRET;
  }
  throw new Error("MANAGE_LICENSE_SECRET is not configured");
}

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
if (!keygenConfig.success) {
  console.warn(
    "[env] Keygen is not configured — trial/license issuance disabled.",
    keygenConfig.error.issues,
  );
}
if (!cashfreeConfig.success) {
  console.warn(
    "[env] Cashfree is not configured — checkout disabled.",
    cashfreeConfig.error.issues,
  );
}
if (!databaseConfig.success) {
  console.warn(
    "[env] DATABASE_URL is not configured — licensing persistence disabled.",
    databaseConfig.error.issues,
  );
}
