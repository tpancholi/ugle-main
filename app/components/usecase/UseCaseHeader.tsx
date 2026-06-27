"use client";
import { motion } from "motion/react";

export default function UseCaseHeader({
  title,
  subtitle,
  badge,
}: {
  title: string;
  subtitle: string;
  badge?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mb-16 md:mb-24"
    >
      {badge && (
        <div className="mb-6 text-[#75C043] font-mono text-sm font-bold uppercase tracking-wider">
          {badge}
        </div>
      )}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-ugle-slate leading-tight">
        {title}
      </h1>
      {/* <p className="text-xl md:text-2xl text-ugle-gray max-w-3xl leading-relaxed">
        {subtitle}
      </p> */}
    </motion.div>
  );
}
