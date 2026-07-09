"use client";
import { ReactNode } from "react";
import { motion } from "motion/react";
import Image from "next/image";

export default function BottomHighlightedSection({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="p-8 md:p-14 bg-[#1C1C1C] rounded-3xl text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-10 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 size-125 bg-[#75C043] rounded-full blur-[150px] opacity-20 transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="relative z-10 max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          {icon}
          <h3 className="text-2xl md:text-3xl font-bold">{title}</h3>
        </div>
        <p className="text-white/80 text-xl md:text-2xl leading-relaxed font-medium">
          {desc}
        </p>
      </div>
      <div className="relative z-10 shrink-0 self-center group cursor-default select-none">
        <Image
          src="/Ugle Mark White.png"
          alt="Ugle Mark"
          width={140}
          height={140}
          priority
          className="rotate-12 opacity-80 group-hover:rotate-[-4deg] group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 ease-out drop-shadow-[0_0_30px_rgba(117,192,67,0.35)] group-hover:drop-shadow-[0_0_48px_rgba(117,192,67,0.65)]"
        />
      </div>
    </motion.div>
  );
}
