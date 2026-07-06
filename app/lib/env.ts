import * as z from "zod";

// Define the schema as an object with all of the env
// variables and their types
const envSchema = z.object({
  RESEND_API_KEY: z.string().min(3),
  // Verified sender address configured in your Resend domain settings
  RESEND_FROM_EMAIL: z.email(),
  // Admin inbox that receives new-subscriber notifications
  ADMIN_EMAIL: z.email(),

  // Google Variables
  GOOGLE_CLIENT_EMAIL: z.email(),
  GOOGLE_PRIVATE_KEY: z
    .string()
    .min(10, "Private key is too short")
    .transform((val) => {
      return val.replace(/\\n/g, "\n");
    }),
  GOOGLE_SPREADSHEET_ID: z.string().min(5),
});

// Validate `process.env` against our schema
// and return the result
const env = envSchema.parse(process.env);

// Export the result so we can use it in the project
export default env;
