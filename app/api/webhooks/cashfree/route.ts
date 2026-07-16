import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { verifyCashfreeWebhookSignature } from "@/app/lib/cashfree";
import { getDb } from "@/app/lib/db";
import { orders, webhookEvents } from "@/app/lib/db/schema";
import { cashfreeConfig, databaseConfig } from "@/app/lib/env";
import {
  fulfillPaidOrder,
  handleRefundedOrder,
  sendSupportAlert,
} from "@/app/lib/licensing/fulfill";

export const runtime = "nodejs";

type CashfreeWebhookBody = {
  type?: string;
  event_time?: string;
  data?: {
    order?: {
      order_id?: string;
      order_amount?: number;
      order_tags?: { plan?: string };
    };
    payment?: {
      cf_payment_id?: string | number;
      payment_status?: string;
    };
    refund?: {
      cf_refund_id?: string | number;
      refund_status?: string;
    };
  };
};

function normalizeEventType(type: string | undefined): string {
  return (type || "").toUpperCase().replace(/\s+/g, "_");
}

export async function POST(req: NextRequest) {
  if (!cashfreeConfig.success || !databaseConfig.success) {
    return NextResponse.json(
      { error: "Payments stack not configured" },
      { status: 503 },
    );
  }

  const rawBody = await req.text();
  const timestamp = req.headers.get("x-webhook-timestamp") || "";
  const signature = req.headers.get("x-webhook-signature") || "";

  if (
    !timestamp ||
    !signature ||
    !verifyCashfreeWebhookSignature({ rawBody, timestamp, signature })
  ) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: CashfreeWebhookBody;
  try {
    payload = JSON.parse(rawBody) as CashfreeWebhookBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = normalizeEventType(payload.type);
  const orderId = payload.data?.order?.order_id;
  const eventId =
    req.headers.get("x-idempotency-key") ||
    `${eventType}:${orderId || "unknown"}:${payload.event_time || timestamp}`;

  const db = getDb();

  try {
    await db.insert(webhookEvents).values({
      provider: "cashfree",
      eventType,
      eventId,
      payload,
    });
  } catch {
    // Unique event id → already received
    return NextResponse.json({ ok: true, duplicate: true });
  }

  try {
    if (
      eventType.includes("SUCCESS") &&
      eventType.includes("PAYMENT") &&
      !eventType.includes("TDR")
    ) {
      if (!orderId) throw new Error("Missing order_id on success webhook");
      await fulfillPaidOrder({
        cashfreeOrderId: orderId,
        cfPaymentId: String(payload.data?.payment?.cf_payment_id ?? ""),
      });
    } else if (eventType.includes("FAILED") && eventType.includes("PAYMENT")) {
      if (orderId) {
        await db
          .update(orders)
          .set({ status: "failed", updatedAt: new Date() })
          .where(eq(orders.cashfreeOrderId, orderId));
      }
      await sendSupportAlert({
        subject: `Payment failed: ${orderId ?? "unknown"}`,
        kind: "failed",
        email: "unknown",
        plan: payload.data?.order?.order_tags?.plan ?? "unknown",
        details: rawBody.slice(0, 1500),
      });
    } else if (eventType.includes("USER_DROPPED") || eventType.includes("DROPPED")) {
      if (orderId) {
        await db
          .update(orders)
          .set({ status: "dropped", updatedAt: new Date() })
          .where(eq(orders.cashfreeOrderId, orderId));
      }
      await sendSupportAlert({
        subject: `Payment dropped: ${orderId ?? "unknown"}`,
        kind: "dropped",
        email: "unknown",
        plan: payload.data?.order?.order_tags?.plan ?? "unknown",
        details: rawBody.slice(0, 1500),
      });
    } else if (eventType.includes("REFUND")) {
      if (!orderId) throw new Error("Missing order_id on refund webhook");
      await handleRefundedOrder(orderId);
    }

    await db
      .update(webhookEvents)
      .set({ processedAt: new Date() })
      .where(eq(webhookEvents.eventId, eventId));

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook processing failed";
    await db
      .update(webhookEvents)
      .set({ error: message })
      .where(eq(webhookEvents.eventId, eventId));

    await sendSupportAlert({
      subject: `Stuck webhook: ${eventType}`,
      kind: "stuck",
      email: "unknown",
      plan: payload.data?.order?.order_tags?.plan ?? "unknown",
      details: `${message}\n\n${rawBody.slice(0, 1200)}`,
    });

    // Return 200 so Cashfree doesn't hammer retries forever after alert;
    // ops can replay from logs. Change to 500 if you prefer Cashfree retries.
    return NextResponse.json({ ok: false, error: message }, { status: 200 });
  }
}
