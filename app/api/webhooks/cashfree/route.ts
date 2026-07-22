import { and, eq } from "drizzle-orm";
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
      order_id?: string;
    };
  };
};

function normalizeEventType(type: string | undefined): string {
  return (type || "").toUpperCase().replace(/\s+/g, "_");
}

/** Exact Cashfree PG event types we handle (no substring matching). */
const PAYMENT_SUCCESS = new Set(["PAYMENT_SUCCESS_WEBHOOK"]);
const PAYMENT_FAILED = new Set(["PAYMENT_FAILED_WEBHOOK"]);
const PAYMENT_DROPPED = new Set(["PAYMENT_USER_DROPPED_WEBHOOK"]);
const REFUND_EVENTS = new Set([
  "REFUND_STATUS_WEBHOOK",
  "AUTO_REFUND_STATUS_WEBHOOK",
]);

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
  const orderId =
    payload.data?.order?.order_id || payload.data?.refund?.order_id;
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
    if (PAYMENT_SUCCESS.has(eventType)) {
      if (!orderId) throw new Error("Missing order_id on success webhook");
      await fulfillPaidOrder({
        cashfreeOrderId: orderId,
        cfPaymentId: String(payload.data?.payment?.cf_payment_id ?? ""),
      });
    } else if (PAYMENT_FAILED.has(eventType)) {
      if (orderId) {
        await db
          .update(orders)
          .set({ status: "failed", updatedAt: new Date() })
          .where(
            and(eq(orders.cashfreeOrderId, orderId), eq(orders.status, "pending")),
          );
      }
      await sendSupportAlert({
        subject: `Payment failed: ${orderId ?? "unknown"}`,
        kind: "failed",
        email: "unknown",
        plan: payload.data?.order?.order_tags?.plan ?? "unknown",
        details: rawBody.slice(0, 1500),
      });
    } else if (PAYMENT_DROPPED.has(eventType)) {
      if (orderId) {
        await db
          .update(orders)
          .set({ status: "dropped", updatedAt: new Date() })
          .where(
            and(eq(orders.cashfreeOrderId, orderId), eq(orders.status, "pending")),
          );
      }
      await sendSupportAlert({
        subject: `Payment dropped: ${orderId ?? "unknown"}`,
        kind: "dropped",
        email: "unknown",
        plan: payload.data?.order?.order_tags?.plan ?? "unknown",
        details: rawBody.slice(0, 1500),
      });
    } else if (REFUND_EVENTS.has(eventType)) {
      const refundStatus = String(
        payload.data?.refund?.refund_status || "",
      ).toUpperCase();
      // Only revoke on successful refunds — cancelled/pending must not revoke.
      if (refundStatus === "SUCCESS" || refundStatus === "COMPLETED") {
        if (!orderId) throw new Error("Missing order_id on refund webhook");
        await handleRefundedOrder(orderId);
      }
    }

    await db
      .update(webhookEvents)
      .set({ processedAt: new Date() })
      .where(eq(webhookEvents.eventId, eventId));

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook processing failed";
    const isTerminal =
      err instanceof Error &&
      (err as Error & { code?: string }).code === "ORDER_TERMINAL";

    await db
      .update(webhookEvents)
      .set({
        error: message,
        // Terminal conflicts are fully handled — mark processed so retries
        // don't keep re-alerting.
        ...(isTerminal ? { processedAt: new Date() } : {}),
      })
      .where(eq(webhookEvents.eventId, eventId));

    if (isTerminal) {
      // Expected race (e.g. success after refund) — ack without retry noise.
      return NextResponse.json({ ok: true, skipped: true });
    }

    await sendSupportAlert({
      subject: `Stuck webhook: ${eventType}`,
      kind: "stuck",
      email: "unknown",
      plan: payload.data?.order?.order_tags?.plan ?? "unknown",
      details: `${message}\n\n${rawBody.slice(0, 1200)}`,
    });

    // 5xx so Cashfree retries. Do not echo internal error details.
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
