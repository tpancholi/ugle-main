import * as z from "zod";

// Define the schema as an object with all of the env
// variables and their types
const envSchema = z.object({
  RESEND_API_KEY: z.string().min(3),
  // Verified sender address configured in your Resend domain settings
  RESEND_FROM_EMAIL: z.email(),
  // Admin inboxes that receive new-subscriber notifications
  ADMIN_EMAIL: z
    .string()
    .min(3)
    .transform((val) => {
      const emails = val.split(",").map((email) => email.trim());
      // Validate each email in the list
      emails.forEach((email) => z.string().email().parse(email));
      return emails;
    }),

  // Google Variables
  GOOGLE_CLIENT_EMAIL: z.email(),
  GOOGLE_PRIVATE_KEY: z
    .string()
    .min(10, "Private key is too short")
    .transform((val) => {
      return val.replace(/\\n/g, "\n");
    }),
  GOOGLE_SPREADSHEET_ID: z.string().min(5),

  //Turnstile
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string(),
  TURNSTILE_SECRET_KEY: z.string(),
});

// Validate `process.env` against our schema
// and return the result
const env = envSchema.parse({
  ...process.env,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
});

// Export the result so we can use it in the project
export default env;
