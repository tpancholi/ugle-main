"use client";

import { motion } from "motion/react";

export default function BlogHero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-16 md:mb-24"
    >
      <div className="font-mono text-[13px] tracking-[0.14em] uppercase text-[#5DA233] font-medium mb-3">
        Blog
      </div>
      <h1 className="text-[40px] md:text-[62px] font-extrabold tracking-[-0.02em] leading-[1.04] text-ugle-slate mb-4">
        Thoughts & Workflow.
      </h1>
      <p className="text-[18px] md:text-[21px] text-ugle-gray max-w-2xl leading-[1.55]">
        Product thinking. Workflow observations. Opinions on how media
        professionals work.
      </p>
    </motion.div>
  );
}
