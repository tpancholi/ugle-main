"use client";
import { motion } from "motion/react";

interface Props {
  leftTitle: string;
  leftItems: React.ReactNode[];
  rightTitle: string;
  rightItems: React.ReactNode[];
}

export default function AnimatedPairedWorkflow({
  leftTitle,
  leftItems,
  rightTitle,
  rightItems,
}: Props) {
  const liProps = (rowIdx: number) => ({
    initial: { opacity: 0, x: 40 },
    whileInView: { opacity: 1, x: 0 } as const,
    viewport: { once: false, margin: "0px 0px -60px 0px" },
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as const,
      delay: rowIdx * 0.15,
    },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16 not-prose">
      {/* Left column */}
      <div className="bg-[#F8FAF9] p-8 md:p-10 rounded-2xl border border-ugle-light/60">
        <h2 className="text-xl font-bold mb-6 text-ugle-slate">{leftTitle}</h2>
        <ol className="space-y-4 list-decimal pl-5 text-ugle-slate font-medium marker:text-[#75C043] marker:font-bold">
          {leftItems.map((item, idx) => (
            <motion.li key={idx} {...liProps(idx)} className="pl-2">
              {item}
            </motion.li>
          ))}
        </ol>
      </div>

      {/* Right column */}
      <div className="bg-[#F8FAF9] p-8 md:p-10 rounded-2xl border border-ugle-light/60">
        <h2 className="text-xl font-bold mb-6 text-ugle-slate">{rightTitle}</h2>
        <ol className="space-y-4 list-decimal pl-5 text-ugle-slate font-medium marker:text-[#75C043] marker:font-bold">
          {rightItems.map((item, idx) => (
            <motion.li key={idx} {...liProps(idx)} className="pl-2">
              {item}
            </motion.li>
          ))}
        </ol>
      </div>
    </div>
  );
}
