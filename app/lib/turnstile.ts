import "server-only";
import { turnstileConfig } from "@/app/lib/env";

/**
 * Verifies a Turnstile token. Fails OPEN by design: if Turnstile isn't
 * configured, or Cloudflare's endpoint errors/times out, this returns
 * `true` so the form still works. Bot-filtering is a nice-to-have here,
 * not a hard gate — trade-off is some spam risk during misconfiguration
 * or Cloudflare outages, which is preferable to blocking real users.
 */
export async function verifyTurnstile(token: string | null): Promise<boolean> {
  if (!turnstileConfig.success) {
    // Not configured at all — skip verification entirely.
    return true;
  }

  if (!token) {
    // Turnstile IS configured but the client didn't send a token
    // (widget failed to load, blocked by an ad blocker, etc).
    // Still fail open rather than blocking the submission.
    console.warn("[Turnstile] No token provided — allowing submission.");
    return true;
  }

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: turnstileConfig.data.TURNSTILE_SECRET_KEY,
          response: token,
        }),
      },
    );

    if (!res.ok) {
      console.error("[Turnstile] Verification request failed:", res.status);
      return true; // fail open
    }

    const data = await res.json();
    return data.success === true;
  } catch (err) {
    console.error("[Turnstile] Verification errored:", err);
    return true; // fail open — Cloudflare being down shouldn't break signups
  }
}
