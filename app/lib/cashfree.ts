import { createHmac, timingSafeEqual } from "crypto";
import { cashfreeConfig, getAppUrl } from "@/app/lib/env";
import type { PaidPlan } from "@/app/lib/pricing";
import { planPricing } from "@/app/lib/pricing";

function requireCashfree() {
  if (!cashfreeConfig.success) {
    throw new Error("Cashfree is not configured");
  }
  return cashfreeConfig.data;
}

export function cashfreeBaseUrl(): string {
  const cfg = requireCashfree();
  return cfg.CASHFREE_ENV === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";
}

export function cashfreeMode(): "sandbox" | "production" {
  return requireCashfree().CASHFREE_ENV;
}

async function cashfreeFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const cfg = requireCashfree();
  const res = await fetch(`${cashfreeBaseUrl()}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-api-version": "2025-01-01",
      "x-client-id": cfg.CASHFREE_APP_ID,
      "x-client-secret": cfg.CASHFREE_SECRET_KEY,
      ...(init.headers ?? {}),
    },
  });

  const body = (await res.json()) as T & {
    message?: string;
    code?: string;
  };

  if (!res.ok) {
    throw new Error(
      (body as { message?: string }).message ||
        `Cashfree request failed (${res.status})`,
    );
  }
  return body;
}

export type CreateCashfreeOrderResult = {
  orderId: string;
  paymentSessionId: string;
  orderAmount: number;
};

export async function createCashfreeOrder(opts: {
  orderId: string;
  plan: PaidPlan;
  customerId: string;
  email: string;
  phone: string;
  name?: string;
}): Promise<CreateCashfreeOrderResult> {
  const { total } = planPricing(opts.plan);
  const appUrl = getAppUrl();

  const data = await cashfreeFetch<{
    order_id: string;
    payment_session_id: string;
    order_amount: number;
  }>("/orders", {
    method: "POST",
    body: JSON.stringify({
      order_id: opts.orderId,
      order_amount: total,
      order_currency: "INR",
      order_note: `Ugle ${opts.plan} licence`,
      customer_details: {
        customer_id: opts.customerId.replace(/-/g, "").slice(0, 50),
        customer_email: opts.email,
        customer_phone: opts.phone,
        customer_name: opts.name || opts.email,
      },
      order_meta: {
        return_url: `${appUrl}/checkout/return?order_id={order_id}`,
        notify_url: `${appUrl}/api/webhooks/cashfree`,
      },
      order_tags: {
        plan: opts.plan,
      },
    }),
  });

  return {
    orderId: data.order_id,
    paymentSessionId: data.payment_session_id,
    orderAmount: data.order_amount,
  };
}

export async function getCashfreeOrder(orderId: string): Promise<{
  orderStatus: string;
  orderAmount: number;
}> {
  const data = await cashfreeFetch<{
    order_status: string;
    order_amount: number;
  }>(`/orders/${encodeURIComponent(orderId)}`);

  return {
    orderStatus: data.order_status,
    orderAmount: data.order_amount,
  };
}

/** Verify Cashfree PG webhook signature using the API secret key. */
export function verifyCashfreeWebhookSignature(opts: {
  rawBody: string;
  timestamp: string;
  signature: string;
}): boolean {
  const cfg = requireCashfree();
  const signedPayload = `${opts.timestamp}${opts.rawBody}`;
  const expected = createHmac("sha256", cfg.CASHFREE_SECRET_KEY)
    .update(signedPayload)
    .digest("base64");

  try {
    const a = Buffer.from(expected);
    const b = Buffer.from(opts.signature);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
