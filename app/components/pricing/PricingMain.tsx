"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";

// ── Pricing card components ───────────────────────────────────────────────────

function PriceCard({
  title,
  badge,
  dark = false,
  description,
  features,
  priceLabel,
  priceMain,
  vatNote,
  primaryBtn,
}: {
  title: string;
  badge?: string;
  dark?: boolean;
  description: string;
  features: string[];
  priceLabel: string;
  priceMain: string;
  vatNote?: string;
  primaryBtn: string;
}) {
  const bg = dark
    ? "bg-ugle-slate border-ugle-slate"
    : "bg-white border-ugle-light/60";
  const titleCol = dark ? "text-white" : "text-ugle-slate";
  const descCol = dark ? "text-white/55" : "text-ugle-gray";
  const dividerCol = dark ? "border-white/10" : "border-ugle-light/60";
  const priceLabelCol = dark ? "text-white/50" : "text-ugle-gray";
  const priceMainCol = dark ? "text-white" : "text-ugle-slate";
  const vatCol = dark ? "text-white/35" : "text-ugle-gray/55";
  const checkCol = dark ? "text-[#75C043]" : "text-[#5DA233]";
  const featureTextCol = dark ? "text-white/70" : "text-ugle-slate";

  return (
    <div
      className={`rounded-2xl border shadow-sm relative flex flex-col ${bg}`}
    >
      {badge && (
        <div className="absolute -top-3.5 left-6">
          <span className="bg-ugle-green text-[#102206] font-bold text-xs px-4 py-1.5 rounded-full tracking-wide whitespace-nowrap shadow">
            {badge}
          </span>
        </div>
      )}

      {/* ── Title + Description ── */}
      <div className={`p-6 pb-5 ${badge ? "pt-8" : ""}`}>
        <h3
          className={`text-[20px] font-extrabold tracking-tight leading-tight mb-2 ${titleCol}`}
        >
          {title}
        </h3>
        <p className={`text-[14px] leading-snug ${descCol}`}>{description}</p>
      </div>

      {/* ── Features ── */}
      <div
        className={`px-6 pb-5 flex-1 space-y-2.5 border-t ${dividerCol} pt-5`}
      >
        {features.map((f, i) => (
          <div
            key={i}
            className={`flex items-start gap-2.5 text-[13.5px] font-medium ${featureTextCol}`}
          >
            <Check
              className={`size-3.5 shrink-0 mt-0.75 ${checkCol}`}
              strokeWidth={2.5}
            />
            <span>{f}</span>
          </div>
        ))}
      </div>

      {/* ── Price row (space-between) ── */}
      <div
        className={`px-6 py-4 border-t ${dividerCol} flex items-center justify-between gap-4`}
      >
        <div
          className={`text-[13px] font-medium leading-snug ${priceLabelCol}`}
        >
          {priceLabel}
        </div>
        <div className="text-right">
          <span className="line-through text-ugle-gray/35">$199</span>
          <div
            className={`text-[32px] font-extrabold tracking-tight leading-none ${priceMainCol}`}
          >
            {priceMain}
          </div>
          {vatNote && (
            <div className={`text-[12px] mt-0.5 ${vatCol}`}>{vatNote}</div>
          )}
        </div>
      </div>

      {/* ── CTA Button ── */}
      <div className={`px-6 pb-6 pt-3`}>
        <button
          className={`w-full py-3 rounded-[10px] font-bold text-[14px] transition-all ${
            dark
              ? "bg-ugle-green text-[#102206] hover:bg-[#5DA233] hover:text-white"
              : "bg-ugle-slate text-white hover:bg-[#222]"
          }`}
        >
          {primaryBtn}
        </button>
      </div>
    </div>
  );
}

function SoloCard({
  isAnnual,
  soloPrice,
}: {
  isAnnual: boolean;
  soloPrice: { main: string; orig: string; per: string };
}) {
  return (
    <PriceCard
      title="Solo"
      description="Freelance journalists, independent producers, solo editors."
      features={[
        "Up to 2 machines (same user)",
        isAnnual
          ? "12 months of updates. Renew at $99/year."
          : "Updates included while subscribed",
        "Unlimited Library size",
        "90+ languages",
        "Clip export included",
      ]}
      priceLabel={isAnnual ? "per user, per year" : "per user, per month"}
      priceMain={soloPrice.main}
      vatNote="incl. VAT US $15.22"
      primaryBtn="Buy Solo Licence"
    />
  );
}

function LifetimeCard() {
  return (
    <PriceCard
      title="Solo Lifetime Access*"
      badge="We Recommend"
      dark
      description="Believers. Pay once, use forever — no renewal, ever."
      features={[
        "Up to 2 machines (same user)",
        "120 months of updates included",
        "Unlimited Library size",
        "90+ languages",
        "Clip export included",
      ]}
      priceLabel="one-time payment"
      priceMain="$999"
      vatNote="incl. VAT US $15.22"
      primaryBtn="Buy Freedom Licence"
    />
  );
}

function TeamCard({
  isAnnual,
  teamPrice,
}: {
  isAnnual: boolean;
  teamPrice: { main: string; orig: string; per: string };
}) {
  return (
    <PriceCard
      title="Team"
      description="Editorial teams, production companies, newsrooms."
      features={[
        "Per-seat, company licence",
        isAnnual
          ? "Updates included for licence duration"
          : "Updates included while subscribed",
        "Unlimited Library size · 90+ languages",
        "Priority support — 4-hour response SLA",
        "Admin console included",
      ]}
      priceLabel={isAnnual ? "per seat, per year" : "per seat, per month"}
      priceMain={teamPrice.main}
      vatNote="incl. VAT US $15.22"
      primaryBtn="Contact for Team Pricing"
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function NonCommercialPanel() {
  return (
    <div className="max-w-2xl mx-auto mb-32">
      <div className="bg-white border border-ugle-light/60 rounded-2xl shadow-sm overflow-hidden">
        {/* Header band */}
        <div className="bg-ugle-slate px-8 py-7">
          <div className="font-mono text-xs tracking-[0.14em] uppercase text-[#75C043] mb-2">
            Non-commercial licence
          </div>
          <h2 className="text-[26px] font-extrabold text-white tracking-tight leading-tight">
            Using Ugle for personal, non-earning work?
          </h2>
        </div>

        {/* Body */}
        <div className="px-8 py-7 space-y-5">
          <p className="text-[15px] text-ugle-gray leading-relaxed">
            Individuals using eligible Ugle products without earning commercial
            benefits can use Ugle for free.
          </p>

          <div className="space-y-3">
            {[
              "Personal documentary or archival projects",
              "Academic research (non-institutional)",
              "Community journalism — no paid distribution",
              "Creative hobbyists with no commercial output",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 text-[14px] font-medium text-ugle-slate"
              >
                <Check
                  className="size-3.5 shrink-0 mt-0.75 text-[#5DA233]"
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
                subject to eligibility review
              </div>
            </div>
            <a
              href="mailto:pricing@ugle.ai"
              className="inline-flex items-center justify-center px-7 py-3 bg-ugle-slate text-white font-bold text-[14px] rounded-[10px] hover:bg-[#222] transition-colors"
            >
              Apply for free access
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function EducationPanel() {
  return (
    <div className="max-w-2xl mx-auto mb-32">
      <div className="bg-white border border-ugle-light/60 rounded-2xl shadow-sm overflow-hidden">
        {/* Header band */}
        <div className="bg-ugle-slate px-8 py-7">
          <div className="font-mono text-xs tracking-[0.14em] uppercase text-[#75C043] mb-2">
            Education licence
          </div>
          <h2 className="text-[26px] font-extrabold text-white tracking-tight leading-tight">
            Students &amp; instructors at accredited institutions
          </h2>
        </div>

        {/* Body */}
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
                  className="size-3.5 shrink-0 mt-0.75 text-[#5DA233]"
                  strokeWidth={2.5}
                />
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Verification note */}
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
                pending verification & approval
              </div>
            </div>
            <a
              href="mailto:education@ugle.ai"
              className="inline-flex items-center justify-center px-7 py-3 bg-ugle-slate text-white font-bold text-[14px] rounded-[10px] hover:bg-[#222] transition-colors"
            >
              Apply for free access
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PricingMain() {
  const [billing, setBilling] = useState<"monthly" | "annual">("annual");
  const [category, setCategory] = useState<
    "individuals" | "organisation" | "non-commercial" | "education"
  >("individuals");
  const showBilling = category === "individuals" || category === "organisation";
  const isAnnual = billing === "annual";

  const soloPrice = isAnnual
    ? { main: "$169", orig: "$199", per: "/year" }
    : { main: "$17", orig: "", per: "/month" };
  const teamPrice = isAnnual
    ? { main: "$149", orig: "$169", per: "/seat/year" }
    : { main: "$15", orig: "", per: "/seat/mo" };

  const categories = [
    { id: "organisation", label: "Organisation" },
    { id: "individuals", label: "Individuals" },
    { id: "non-commercial", label: "Non-commercial" },
    { id: "education", label: "Education" },
  ] as const;
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-6 flex flex-col items-center"
      >
        {/* Desktop: single outer border wraps all tabs */}
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

        {/* Mobile: each tab has its own border */}
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

      {/* ── Billing toggle ── */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`mb-12 flex justify-center transition-opacity duration-200 ${
          showBilling ? "block opacity-100" : "hidden"
        }`}
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
              save ~17%
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
        ) : (
          <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto mb-32 items-start">
            {/* ── Solo card ── */}
            <SoloCard isAnnual={isAnnual} soloPrice={soloPrice} />

            {/* ── Solo Lifetime card ── */}
            <LifetimeCard />

            {/* ── Team card ── */}
            <TeamCard isAnnual={isAnnual} teamPrice={teamPrice} />
          </div>
        )}
      </motion.div>
    </>
  );
}
