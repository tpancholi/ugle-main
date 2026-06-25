"use client";

import { motion } from "motion/react";
import React from "react";

export default function UseCaseMain({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
      className="prose prose-lg prose-p:text-ugle-gray prose-headings:text-ugle-slate text-ugle-gray max-w-none"
    >
      {children}
    </motion.div>
  );
}
