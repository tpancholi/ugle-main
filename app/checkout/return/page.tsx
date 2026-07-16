import { eq } from "drizzle-orm";
import { getCashfreeOrder } from "@/app/lib/cashfree";
import { getDb } from "@/app/lib/db";
import { orders } from "@/app/lib/db/schema";
import { databaseConfig } from "@/app/lib/env";
import { fulfillPaidOrder } from "@/app/lib/licensing/fulfill";
import Link from "next/link";

export default async function CheckoutReturnPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string }>;
}) {
  const { order_id: orderId } = await searchParams;

  let status: "paid" | "pending" | "failed" | "unknown" = "unknown";
  let message =
    "We’re confirming your payment. Your licence email will arrive shortly.";

  if (orderId && databaseConfig.success) {
    try {
      const cf = await getCashfreeOrder(orderId);
      if (cf.orderStatus === "PAID") {
        await fulfillPaidOrder({ cashfreeOrderId: orderId });
        status = "paid";
        message =
          "Payment received. Check your email for your licence key and manage link.";
      } else if (cf.orderStatus === "ACTIVE" || cf.orderStatus === "PENDING") {
        status = "pending";
        message =
          "Payment is still processing. We’ll email your licence as soon as Cashfree confirms it.";
      } else {
        status = "failed";
        message =
          "We couldn’t confirm a successful payment for this order. You have not been charged for a licence yet — try again from Pricing, or contact support.";
        const db = getDb();
        await db
          .update(orders)
          .set({ status: "failed", updatedAt: new Date() })
          .where(eq(orders.cashfreeOrderId, orderId));
      }
    } catch {
      status = "pending";
      message =
        "We’re still confirming with Cashfree. If you were charged, your licence email will arrive within a few minutes.";
    }
  }

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6 py-24">
      <div className="max-w-lg w-full bg-white border border-ugle-light/60 rounded-2xl shadow-sm p-8 space-y-4">
        <div className="font-mono text-xs tracking-[0.14em] uppercase text-[#5DA233]">
          Checkout
        </div>
        <h1 className="text-2xl font-extrabold text-ugle-slate tracking-tight">
          {status === "paid"
            ? "You’re all set"
            : status === "failed"
              ? "Payment not completed"
              : "Confirming payment"}
        </h1>
        <p className="text-[15px] text-ugle-gray leading-relaxed">{message}</p>
        {orderId && (
          <p className="text-[12px] text-ugle-gray/70 font-mono break-all">
            Order: {orderId}
          </p>
        )}
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/download"
            className="inline-flex px-5 py-2.5 bg-ugle-slate text-white text-sm font-bold rounded-[10px]"
          >
            Download
          </Link>
          <Link
            href="/pricing"
            className="inline-flex px-5 py-2.5 border border-ugle-light text-ugle-slate text-sm font-bold rounded-[10px]"
          >
            Back to pricing
          </Link>
          <a
            href="mailto:support@ugle.ai"
            className="inline-flex px-5 py-2.5 text-sm font-semibold text-[#5DA233]"
          >
            support@ugle.ai
          </a>
        </div>
      </div>
    </main>
  );
}
