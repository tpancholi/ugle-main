"use client";

import { useActionState, useEffect } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import {
  startCheckout,
  startTrial,
  type LicensingActionState,
} from "@/app/actions/licensing";
import { formatInr, planPricing, type PaidPlan } from "@/app/lib/pricing";

const initial: LicensingActionState = {
  success: false,
  message: "",
};

const inputClass =
  "w-full rounded-lg border border-ugle-light/70 px-3 py-2.5 text-sm text-ugle-slate outline-none focus:border-ugle-green";

export function CheckoutPanel({ plan }: { plan: PaidPlan }) {
  const pricing = planPricing(plan);
  const [state, action, pending] = useActionState(startCheckout, initial);

  useEffect(() => {
    if (!state.success || !state.paymentSessionId) return;
    let cancelled = false;
    (async () => {
      const cashfree = await load({
        mode: state.cashfreeMode === "production" ? "production" : "sandbox",
      });
      if (cancelled) return;
      await cashfree.checkout({
        paymentSessionId: state.paymentSessionId!,
        redirectTarget: "_self",
      });
    })().catch((err) => {
      console.error("Cashfree checkout failed", err);
    });
    return () => {
      cancelled = true;
    };
  }, [state]);

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="plan" value={plan} />
      <div className="grid sm:grid-cols-2 gap-3">
        <input name="name" placeholder="Name (optional)" className={inputClass} />
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className={inputClass}
        />
      </div>
      <input
        name="phone"
        type="tel"
        required
        placeholder="Mobile (for UPI / Cashfree)"
        className={inputClass}
      />
      <div className="text-[12.5px] text-ugle-gray leading-relaxed">
        {formatInr(pricing.base)} + GST {formatInr(pricing.gst)} ={" "}
        <span className="font-semibold text-ugle-slate">
          {formatInr(pricing.total)}
        </span>{" "}
        charged today. Licence emailed after payment confirmation.
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3 bg-ugle-slate text-white font-bold text-[14px] rounded-[10px] hover:bg-[#222] transition-colors disabled:opacity-60"
      >
        {pending
          ? "Starting checkout…"
          : plan === "annual"
            ? "Buy Annual Licence"
            : "Buy Monthly Licence"}
      </button>
      {state.message && (
        <p
          className={`text-sm ${state.success ? "text-[#5DA233]" : "text-red-600"}`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}

export function TrialPanel() {
  const [state, action, pending] = useActionState(startTrial, initial);

  return (
    <form action={action} className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <input name="name" placeholder="Name (optional)" className={inputClass} />
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className={inputClass}
        />
      </div>
      <p className="text-[12.5px] text-ugle-gray leading-relaxed">
        15 days · 2 machines · no payment required. One trial per email.
      </p>
      <button
        type="submit"
        disabled={pending}
        className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3 border border-ugle-slate text-ugle-slate font-bold text-[14px] rounded-[10px] hover:bg-ugle-slate hover:text-white transition-colors disabled:opacity-60"
      >
        {pending ? "Issuing trial…" : "Start 15-day trial"}
      </button>
      {state.message && (
        <p
          className={`text-sm ${state.success ? "text-[#5DA233]" : "text-red-600"}`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
