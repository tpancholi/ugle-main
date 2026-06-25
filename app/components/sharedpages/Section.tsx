"use client";
import React from "react";
import { motion } from "motion/react";


export default function Section({
  title,
  children,
  delay = 0,
  icon,
}: {
  title: string;
  children: React.ReactNode;
  delay?: number;
  icon?: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="py-12 border-t border-ugle-light/30 relative"
    >
      <div className="flex flex-col md:flex-row gap-8 md:gap-16">
        <div className="md:w-1/3 shrink-0">
          <h2 className="text-2xl font-bold text-ugle-slate flex items-center gap-3">
            {icon}
            {title}
          </h2>
        </div>
        <div className="md:w-2/3 space-y-6 text-lg text-ugle-gray leading-relaxed">
          {children}
        </div>
      </div>
    </motion.section>
  );
}
