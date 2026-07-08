// scripts/check-env.ts
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function run() {
  const { turnstileConfig, resendConfig, sheetsConfig } = await import(
    "../app/lib/env"
  );

  if (!turnstileConfig.success) {
    console.warn("⚠️  Turnstile is not configured — bot verification disabled.");
  }
  if (!resendConfig.success) {
    console.warn("⚠️  Resend is not configured — newsletter emails disabled.");
  }
  if (!sheetsConfig.success) {
    console.warn("⚠️  Google Sheets is not configured — sheet logging disabled.");
  }

  console.log("✅ Environment check complete — build will proceed regardless.");
}

run();
