"use client";
import { motion } from "motion/react";

export default function PricingHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-10 md:mb-12"
    >
      <div className="font-mono text-xs md:text-[13px] tracking-[0.14em] uppercase text-[#5DA233] font-medium mb-3">
        Pricing
      </div>
      <h1 className="text-[40px] md:text-[62px] font-extrabold tracking-[-0.02em] leading-[1.04] text-ugle-slate mb-4">
        Simple. Honest. One-time*.
      </h1>
      <p className="text-[18px] md:text-[21px] text-ugle-gray max-w-2xl mx-auto leading-[1.55]">
        Pay once*, use forever. No subscriptions. No surprise charges.
      </p>
    </motion.div>
  );
}
