"use client";
import { motion } from "motion/react";

interface Props {
  items: React.ReactNode[];
}

export default function AnimatedWorkflowList({ items }: Props) {
  return (
    <ol className="space-y-6 list-decimal pl-5 text-ugle-slate font-medium marker:text-[#75C043] marker:font-bold">
      {items.map((item, idx) => (
        <motion.li
          key={idx}
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          viewport={{ once: false, margin: "0px 0px -60px 0px" }}
          transition={{
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
            delay: idx * 0.07,
          }}
          className={
            idx < items.length - 1
              ? "pl-4 pb-4 border-b border-ugle-light/40"
              : "pl-4"
          }
        >
          {item}
        </motion.li>
      ))}
    </ol>
  );
}
