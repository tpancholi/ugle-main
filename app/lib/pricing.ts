export type PaidPlan = "monthly" | "annual";
export type Plan = PaidPlan | "trial";

export const GST_RATE = 0.18;

/** Base prices in INR (exclusive of GST). */
export const PLAN_BASE_INR: Record<PaidPlan, number> = {
  monthly: 1000,
  annual: 10_000,
};

export const PLAN_LABEL: Record<Plan, string> = {
  trial: "15-day trial",
  monthly: "Individual monthly",
  annual: "Individual annual",
};

export function gstAmountInr(baseInr: number): number {
  return Math.round(baseInr * GST_RATE);
}

export function totalWithGstInr(baseInr: number): number {
  return baseInr + gstAmountInr(baseInr);
}

export function formatInr(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function planPricing(plan: PaidPlan) {
  const base = PLAN_BASE_INR[plan];
  const gst = gstAmountInr(base);
  const total = base + gst;
  return { base, gst, total };
}
