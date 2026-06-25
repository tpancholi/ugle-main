import React from "react";
import PricingHeader from "../components/pricing/PricingHeader";
import PricingMain from "../components/pricing/PricingMain";
import PricingFaq from "../components/pricing/PricingFaq";

export default function Pricing() {
  return (
    <div className="bg-[#F8FAF9] min-h-screen pt-24 pb-32">
      <div className="max-w-6xl mx-auto px-6">
        {/* ── Header ── */}
        <PricingHeader />

        <PricingMain />

        {/* ── FAQ — always visible ── */}
        <PricingFaq />

        {/* Asterisk footnote */}
        <p className="text-center text-[13px] text-ugle-gray/60 font-mono pt-12 pb-4 max-w-xl mx-auto border-t border-ugle-light/40 mt-12">
          *Only valid for Lifetime License Access (10 Years)
        </p>
      </div>
    </div>
  );
}
