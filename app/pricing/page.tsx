import React from "react";
import PricingHeader from "../components/pricing/PricingHeader";
import PricingMain from "../components/pricing/PricingMain";
import PricingFaq from "../components/pricing/PricingFaq";

export default function Pricing() {
  return (
    <div className="bg-[#F8FAF9] min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-6">
        {/* ── Header ── */}
        <PricingHeader />

        <PricingMain />

        {/* ── FAQ — always visible ── */}
        <PricingFaq />
      </div>
    </div>
  );
}
