/** Shared fetch helpers for outbound licensing/payment APIs. */

const DEFAULT_TIMEOUT_MS = 12_000;
const MAX_ATTEMPTS = 3;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchWithTimeout(
  url: string,
  init: RequestInit = {},
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<Response> {
  const signal =
    init.signal ??
    (typeof AbortSignal !== "undefined" && "timeout" in AbortSignal
      ? AbortSignal.timeout(timeoutMs)
      : undefined);
  return fetch(url, { ...init, signal });
}

/** Bounded retries with exponential backoff for transient network/5xx failures.
 * Mutating methods (POST/PATCH/PUT/DELETE) default to a single attempt so a
 * timed-out create cannot orphan a second Keygen/Cashfree resource. */
export async function fetchWithBackoff(
  url: string,
  init: RequestInit = {},
  opts?: { timeoutMs?: number; attempts?: number },
): Promise<Response> {
  const method = (init.method ?? "GET").toUpperCase();
  const safeMethod =
    method === "GET" || method === "HEAD" || method === "OPTIONS";
  const attempts = opts?.attempts ?? (safeMethod ? MAX_ATTEMPTS : 1);
  const timeoutMs = opts?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  let lastErr: unknown;

  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetchWithTimeout(url, init, timeoutMs);
      if (res.status >= 500 && i < attempts - 1) {
        await sleep(200 * 2 ** i);
        continue;
      }
      return res;
    } catch (err) {
      lastErr = err;
      if (i >= attempts - 1) break;
      await sleep(200 * 2 ** i);
    }
  }
  throw lastErr instanceof Error
    ? lastErr
    : new Error("Outbound request failed after retries");
}
