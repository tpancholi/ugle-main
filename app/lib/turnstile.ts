// app/lib/turnstile.ts
import "server-only"; // guarantees this never gets bundled client-side
import env from "@/app/lib/env";

export async function verifyTurnstile(token: string | null): Promise<boolean> {
  if (!token) return false;

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: env.TURNSTILE_SECRET_KEY,
        response: token,
      }),
    },
  );

  const data = await res.json();
  return data.success === true;
}
