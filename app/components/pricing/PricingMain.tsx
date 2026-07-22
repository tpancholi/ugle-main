"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Check, Mail } from "lucide-react";
import Link from "next/link";
import { CheckoutPanel, TrialPanel } from "./CheckoutForms";
import { formatInr, planPricing } from "@/app/lib/pricing";

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
  const plan = isAnnual ? "annual" : "monthly";
  const pricing = planPricing(plan);
  const period = isAnnual ? "per user, per year" : "per user, per month";
  const updatesNote = isAnnual
    ? "Updates included for 12 months"
    : "Updates included while subscribed";

  return (
    <div className="max-w-2xl mx-auto mb-32 space-y-6">
      {/* Card — light style matching other panels */}
      <div className="bg-white border border-ugle-light/60 rounded-2xl shadow-sm overflow-hidden">
        {/* Header band */}
        <div className="bg-ugle-slate px-8 py-7">
          <div className="font-mono text-xs tracking-[0.14em] uppercase text-[#75C043] mb-2">
            Personal subscription · India
          </div>
          <h2 className="text-[26px] font-extrabold text-white tracking-tight leading-tight">
            Private individuals buying with their own funds
          </h2>
        </div>

        {/* Body */}
        <div className="px-8 py-7 space-y-5">
          <div className="space-y-3">
            <Feature text="1 personal licence · 2 node-locked machines" />
            <Feature text="Unlimited library size" />
            <Link
              href="/blog/languages-supported"
              className="flex items-start gap-2.5 text-[13.5px] font-medium text-ugle-green"
            >
              <Check
                className={`size-3.5 shrink-0 mt-0.5 text-[#5DA233]`}
                strokeWidth={2.5}
              />
              <span>90+ languages</span>
            </Link>
            <Feature text="Clip export included" />
            <Feature text={updatesNote} />
          </div>

          <div className="border-t border-ugle-light/60 pt-5 space-y-5">
            <div>
              <div className="text-[13px] text-ugle-gray mb-0.5">{period}</div>
              <div className="flex items-baseline gap-2 flex-wrap">
                <div className="text-[32px] font-extrabold text-ugle-slate tracking-tight leading-none">
                  {formatInr(pricing.base)}
                </div>
                <span className="text-[13px] text-ugle-gray">+ 18% GST</span>
              </div>
              <div className="text-[12px] text-ugle-gray/70 mt-1">
                Total today:{" "}
                <span className="font-semibold text-ugle-slate">
                  {formatInr(pricing.total)}
                </span>
              </div>
            </div>
            <CheckoutPanel plan={plan} />
          </div>
        </div>
      </div>

      {/* Trial card */}
      <div className="bg-white border border-ugle-light/60 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-8 py-6 space-y-4">
          <div>
            <div className="font-mono text-xs tracking-[0.14em] uppercase text-[#5DA233] mb-1">
              Free trial
            </div>
            <h3 className="text-lg font-bold text-ugle-slate">
              Try Ugle for 15 days
            </h3>
            <p className="text-[13.5px] text-ugle-gray mt-1">
              Full features · 1 machine · key emailed by our team after review.
            </p>
          </div>
          <TrialPanel />
        </div>
      </div>

      <div className="text-center text-[13px] text-ugle-gray/70">
        Already have a licence? Check your email for the manage link, or write{" "}
        <a
          href="mailto:support@ugle.ai"
          className="text-[#5DA233] font-semibold hover:underline"
        >
          support@ugle.ai
        </a>
        .
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
// function NonCommercialPanel() {
//   return (
//     <div className="max-w-2xl mx-auto mb-32">
//       <div className="bg-white border border-ugle-light/60 rounded-2xl shadow-sm overflow-hidden">
//         <div className="bg-ugle-slate px-8 py-7">
//           <div className="font-mono text-xs tracking-[0.14em] uppercase text-[#75C043] mb-2">
//             Non-commercial licence
//           </div>
//           <h2 className="text-[26px] font-extrabold text-white tracking-tight leading-tight">
//             Using Ugle for personal, non-earning work?
//           </h2>
//         </div>

//         <div className="px-8 py-7 space-y-5">
//           <p className="text-[15px] text-ugle-gray leading-relaxed">
//             Individuals using eligible Ugle products without earning commercial
//             benefits can use Ugle for free. No approval required.
//           </p>

//           <div className="space-y-3">
//             {[
//               "Personal documentary or archival projects",
//               "Academic research (non-institutional)",
//               "Community journalism \u2014 no paid distribution",
//               "Creative hobbyists with no commercial output",
//             ].map((item, i) => (
//               <div
//                 key={i}
//                 className="flex items-start gap-3 text-[14px] font-medium text-ugle-slate"
//               >
//                 <Check
//                   className="size-3.5 shrink-0 mt-0.5 text-[#5DA233]"
//                   strokeWidth={2.5}
//                 />
//                 <span>{item}</span>
//               </div>
//             ))}
//           </div>

//           <div className="border-t border-ugle-light/60 pt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div>
//               <div className="text-[13px] text-ugle-gray mb-0.5">Price</div>
//               <div className="text-[32px] font-extrabold text-ugle-slate tracking-tight leading-none">
//                 Free
//               </div>
//               <div className="text-[12px] text-ugle-gray/55 mt-0.5">
//                 no approval required
//               </div>
//             </div>
//             <Link
//               href="/non-commercial"
//               className="inline-flex items-center justify-center px-7 py-3 bg-ugle-slate text-white font-bold text-[14px] rounded-[10px] hover:bg-[#222] transition-colors"
//             >
//               Get free access
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

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
    // { id: "non-commercial", label: "Non-commercial" },
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
              {/* {(cat.id === "non-commercial" || cat.id === "education") && (
                <span className="ml-1.5 text-[11px] font-bold text-[#5DA233]">
                  Free
                </span>
              )} */}
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
              {/* {(cat.id === "non-commercial" || cat.id === "education") && (
                <span className="ml-1.5 text-[11px] font-bold text-[#5DA233]">
                  Free
                </span>
              )} */}
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
                best value
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
        {category === "education" ? (
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
