"use client";
import { motion } from "motion/react";

export default function GetAccessHero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mb-16"
    >
      <div className="font-mono text-[13px] tracking-[0.14em] uppercase text-[#5DA233] font-medium mb-3">
        Get Early Access
      </div>
      <h1 className="text-[40px] md:text-[62px] font-extrabold tracking-[-0.02em] leading-[1.04] text-ugle-slate mb-4">
        Start searching your archive.
      </h1>
      <p className="text-[18px] md:text-[21px] text-ugle-gray leading-[1.55]">
        Join the early access program. We are rolling out invites weekly to
        ensure stability and performance.
      </p>
    </motion.div>
  );
}
