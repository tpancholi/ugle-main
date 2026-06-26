"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Check, Mail } from "lucide-react";
import Link from "next/link";

// ── Shared check-list row ─────────────────────────────────────────────────────

function Feature({ text, dark = false }: { text: string; dark?: boolean }) {
  return (
    <div
      className={`flex items-start gap-2.5 text-[13.5px] font-medium ${dark ? "text-white/70" : "text-ugle-slate"}`}
    >
      <Check
        className={`size-3.5 shrink-0 mt-0.5 ${dark ? "text-[#75C043]" : "text-[#5DA233]"}`}
        strokeWidth={2.5}
      />
      <span>{text}</span>
    </div>
  );
}

// ── Individual pricing panel ──────────────────────────────────────────────────
function IndividualsPanel({ isAnnual }: { isAnnual: boolean }) {
  const price = isAnnual ? "$169" : "$20";
  const origPrice = isAnnual ? "$199" : "$25";
  const period = isAnnual ? "per user, per year" : "per user, per month";
  const loyaltyNote = isAnnual
    ? "loyalty renewal rate · save ~15%"
    : "loyalty renewal rate · save ~20%";
  const updatesNote = isAnnual
    ? "Updates included for 12 months"
    : "Updates included while subscribed";

  return (
    <div className="max-w-2xl mx-auto mb-32">
      {/* Card — light style matching other panels */}
      <div className="bg-white border border-ugle-light/60 rounded-2xl shadow-sm overflow-hidden">
        {/* Header band */}
        <div className="bg-ugle-slate px-8 py-7">
          <div className="font-mono text-xs tracking-[0.14em] uppercase text-[#75C043] mb-2">
            Personal subscription
          </div>
          <h2 className="text-[26px] font-extrabold text-white tracking-tight leading-tight">
            Private individuals buying with their own funds
          </h2>
        </div>

        {/* Body */}
        <div className="px-8 py-7 space-y-5">
          <div className="space-y-3">
            <Feature text="1 personal licence" />
            <Feature text="Unlimited library size" />
            <Feature text="90+ languages" />
            <Feature text="Clip export included" />
            <Feature text={updatesNote} />
          </div>

          <div className="border-t border-ugle-light/60 pt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="text-[13px] text-ugle-gray mb-0.5">{period}</div>
              <div className="flex items-baseline gap-2">
                <span className="line-through text-ugle-gray/40 text-sm">
                  {origPrice}
                </span>
                <div className="text-[32px] font-extrabold text-ugle-slate tracking-tight leading-none">
                  {price}
                </div>
              </div>
              <div className="text-[12px] text-ugle-gray/55 mt-0.5">
                {loyaltyNote}
              </div>
            </div>
            <Link
              href="/get-early-access"
              className="inline-flex items-center justify-center px-7 py-3 bg-ugle-slate text-white font-bold text-[14px] rounded-[10px] hover:bg-[#222] transition-colors whitespace-nowrap"
            >
              {isAnnual ? "Buy Annual Licence" : "Buy Monthly Licence"}
            </Link>
          </div>
        </div>
      </div>

      {/* Loyalty note — below the card */}
      <div className="mt-4 flex items-start gap-3 bg-[#F0F9EA] border border-[#75C043]/30 rounded-xl px-5 py-4">
        <span className="text-[#5DA233] text-lg mt-0.5">&#10022;</span>
        <div>
          <p className="text-sm font-semibold text-ugle-slate">
            15% Loyalty Discount on every renewal
          </p>
          <p className="text-[13px] text-ugle-gray mt-0.5">
            Prices shown reflect the loyalty rate for returning subscribers.
            First-time price:{" "}
            <span className="font-semibold">
              {isAnnual ? "$199/year" : "$25/month"}
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Organisation panel ────────────────────────────────────────────────────────
function OrganisationPanel() {
  return (
    <div className="max-w-2xl mx-auto mb-32">
      <div className="bg-white border border-ugle-light/60 rounded-2xl shadow-sm overflow-hidden">
        {/* Header band */}
        <div className="bg-ugle-slate px-8 py-7">
          <div className="font-mono text-xs tracking-[0.14em] uppercase text-[#75C043] mb-2">
            Commercial subscription
          </div>
          <h2 className="text-[26px] font-extrabold text-white tracking-tight leading-tight">
            Companies &amp; organisations using Ugle commercially
          </h2>
        </div>

        {/* Body */}
        <div className="px-8 py-7 space-y-5">
          <p className="text-[15px] text-ugle-gray leading-relaxed">
            For teams of more than 3 seats. Concurrent users cannot exceed the
            number of purchased subscriptions. Billed yearly or monthly.
          </p>

          <div className="space-y-3">
            {[
              "More than 3 seats — scale to your team size",
              "Concurrent users \u2264 purchased subscriptions",
              "Yearly or monthly billing options",
              "Priority support & SLA available",
              "Admin console & centralised licence management",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 text-[14px] font-medium text-ugle-slate"
              >
                <Check
                  className="size-3.5 shrink-0 mt-0.5 text-[#5DA233]"
                  strokeWidth={2.5}
                />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-ugle-light/60 pt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="text-[13px] text-ugle-gray mb-0.5">Pricing</div>
              <div className="text-[32px] font-extrabold text-ugle-slate tracking-tight leading-none">
                On Request
              </div>
              <div className="text-[12px] text-ugle-gray/55 mt-0.5">
                tailored to your team size
              </div>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 justify-center px-7 py-3 bg-ugle-slate text-white font-bold text-[14px] rounded-[10px] hover:bg-[#222] transition-colors"
            >
              <Mail className="size-4" />
              Contact for pricing
            </Link>
          </div>
        </div>
      </div>

      {/* Enterprise nudge */}
      <div className="mt-4 text-center text-[13px] text-ugle-gray/70">
        Need an air-gapped or on-premise deployment?{" "}
        <a
          href="mailto:enterprise@ugle.ai"
          className="text-[#5DA233] font-semibold hover:underline"
        >
          enterprise@ugle.ai
        </a>
      </div>
    </div>
  );
}

// ── Non-commercial panel ──────────────────────────────────────────────────────
function NonCommercialPanel() {
  return (
    <div className="max-w-2xl mx-auto mb-32">
      <div className="bg-white border border-ugle-light/60 rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-ugle-slate px-8 py-7">
          <div className="font-mono text-xs tracking-[0.14em] uppercase text-[#75C043] mb-2">
            Non-commercial licence
          </div>
          <h2 className="text-[26px] font-extrabold text-white tracking-tight leading-tight">
            Using Ugle for personal, non-earning work?
          </h2>
        </div>

        <div className="px-8 py-7 space-y-5">
          <p className="text-[15px] text-ugle-gray leading-relaxed">
            Individuals using eligible Ugle products without earning commercial
            benefits can use Ugle for free. No approval required.
          </p>

          <div className="space-y-3">
            {[
              "Personal documentary or archival projects",
              "Academic research (non-institutional)",
              "Community journalism \u2014 no paid distribution",
              "Creative hobbyists with no commercial output",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 text-[14px] font-medium text-ugle-slate"
              >
                <Check
                  className="size-3.5 shrink-0 mt-0.5 text-[#5DA233]"
                  strokeWidth={2.5}
                />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-ugle-light/60 pt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="text-[13px] text-ugle-gray mb-0.5">Price</div>
              <div className="text-[32px] font-extrabold text-ugle-slate tracking-tight leading-none">
                Free
              </div>
              <div className="text-[12px] text-ugle-gray/55 mt-0.5">
                no approval required
              </div>
            </div>
            <Link
              href="/non-commercial"
              className="inline-flex items-center justify-center px-7 py-3 bg-ugle-slate text-white font-bold text-[14px] rounded-[10px] hover:bg-[#222] transition-colors"
            >
              Get free access
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Education panel ───────────────────────────────────────────────────────────
function EducationPanel() {
  return (
    <div className="max-w-2xl mx-auto mb-32">
      <div className="bg-white border border-ugle-light/60 rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-ugle-slate px-8 py-7">
          <div className="font-mono text-xs tracking-[0.14em] uppercase text-[#75C043] mb-2">
            Education licence
          </div>
          <h2 className="text-[26px] font-extrabold text-white tracking-tight leading-tight">
            Students &amp; instructors at accredited institutions
          </h2>
        </div>

        <div className="px-8 py-7 space-y-5">
          <p className="text-[15px] text-ugle-gray leading-relaxed">
            Education licences are free for currently enrolled students and
            teaching staff at accredited academic institutions. Verification and
            approval required.
          </p>

          <div className="space-y-3">
            {[
              "Currently enrolled students",
              "Full-time & part-time instructors / faculty",
              "Journalism schools & media programmes",
              "Accredited universities & colleges",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 text-[14px] font-medium text-ugle-slate"
              >
                <Check
                  className="size-3.5 shrink-0 mt-0.5 text-[#5DA233]"
                  strokeWidth={2.5}
                />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="bg-[#F8FAF9] border border-ugle-light/70 rounded-xl px-5 py-4 text-[13px] text-ugle-gray leading-relaxed">
            <span className="font-semibold text-ugle-slate">
              Verification required.
            </span>{" "}
            You&apos;ll need to submit proof of enrollment or employment at an
            accredited institution. Approvals are typically processed within 2
            business days.
          </div>

          <div className="border-t border-ugle-light/60 pt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="text-[13px] text-ugle-gray mb-0.5">Price</div>
              <div className="text-[32px] font-extrabold text-ugle-slate tracking-tight leading-none">
                Free
              </div>
              <div className="text-[12px] text-ugle-gray/55 mt-0.5">
                pending verification &amp; approval
              </div>
            </div>
            <Link
              href="/education"
              className="inline-flex items-center justify-center px-7 py-3 bg-ugle-slate text-white font-bold text-[14px] rounded-[10px] hover:bg-[#222] transition-colors"
            >
              Apply for free access
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function PricingMain() {
  const [category, setCategory] = useState<
    "individuals" | "organisation" | "non-commercial" | "education"
  >("individuals");
  const [billing, setBilling] = useState<"annual" | "monthly">("annual");
  const isAnnual = billing === "annual";

  const categories = [
    { id: "organisation", label: "Organisation" },
    { id: "individuals", label: "Individuals" },
    { id: "non-commercial", label: "Non-commercial" },
    { id: "education", label: "Education" },
  ] as const;

  return (
    <>
      {/* ── Category tabs ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-10 flex flex-col items-center"
      >
        {/* Desktop */}
        <div className="hidden sm:inline-flex border border-ugle-light rounded-lg p-1 gap-0.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`category-tab-${cat.id}`}
              onClick={() => setCategory(cat.id)}
              className={`px-4 py-1.5 rounded-lg text-base font-semibold whitespace-nowrap transition-colors duration-200 ${
                category === cat.id
                  ? "border border-ugle-green text-ugle-slate"
                  : "border border-transparent text-ugle-gray hover:text-ugle-slate"
              }`}
            >
              {cat.label}
              {(cat.id === "non-commercial" || cat.id === "education") && (
                <span className="ml-1.5 text-[11px] font-bold text-[#5DA233]">
                  Free
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Mobile */}
        <div className="flex sm:hidden flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={`m-${cat.id}`}
              id={`category-tab-mobile-${cat.id}`}
              onClick={() => setCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-[13.5px] font-semibold whitespace-nowrap transition-colors duration-200 border ${
                category === cat.id
                  ? "border-ugle-green text-ugle-slate"
                  : "border-ugle-light text-ugle-gray hover:text-ugle-slate"
              }`}
            >
              {cat.label}
              {(cat.id === "non-commercial" || cat.id === "education") && (
                <span className="ml-1.5 text-[11px] font-bold text-[#5DA233]">
                  Free
                </span>
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Billing toggle — only for individuals ── */}
      {category === "individuals" && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-12 flex justify-center"
        >
          <div className="inline-flex border border-ugle-light rounded-lg p-1 gap-0.5">
            <button
              id="billing-annual"
              onClick={() => setBilling("annual")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-base font-semibold whitespace-nowrap transition-colors duration-200 ${
                isAnnual
                  ? "border border-ugle-green text-ugle-slate"
                  : "border border-transparent text-ugle-gray hover:text-ugle-slate"
              }`}
            >
              Annual billing
              <span className="text-[11px] font-bold text-[#5DA233]">
                save ~15%
              </span>
            </button>
            <button
              id="billing-monthly"
              onClick={() => setBilling("monthly")}
              className={`px-4 py-1.5 rounded-lg text-[13.5px] font-semibold whitespace-nowrap transition-colors duration-200 ${
                !isAnnual
                  ? "border border-ugle-green text-ugle-slate"
                  : "border border-transparent text-ugle-gray hover:text-ugle-slate"
              }`}
            >
              Monthly billing
            </button>
          </div>
        </motion.div>
      )}

      {/* ── Content area — switches by category ── */}
      <motion.div
        key={category}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {category === "non-commercial" ? (
          <NonCommercialPanel />
        ) : category === "education" ? (
          <EducationPanel />
        ) : category === "organisation" ? (
          <OrganisationPanel />
        ) : (
          <IndividualsPanel isAnnual={isAnnual} />
        )}
      </motion.div>
    </>
  );
}
