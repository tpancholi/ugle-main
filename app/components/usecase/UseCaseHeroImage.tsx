"use client";

import { motion } from "motion/react";
import Image from "next/image";

interface Props {
  src: string;
  alt: string;
}

export default function UseCaseHeroImage({ src, alt }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      className="relative w-full mb-10 md:mb-14 not-prose"
    >
      {/* Decorative glow backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 rounded-3xl blur-3xl opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%, #75C043 0%, transparent 70%)",
        }}
      />

      {/* Image card */}
      <div className="relative rounded-2xl overflow-hidden border border-ugle-light/60 shadow-[0_8px_40px_rgba(0,0,0,0.10)] bg-[#F8FAF9]">
        {/* Top chrome bar */}
        {/* <div className="flex items-center gap-2 px-5 py-3 bg-[#F0F2F0] border-b border-ugle-light/50">
          <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <span className="w-3 h-3 rounded-full bg-[#28C840]" />
        </div> */}

        {/* Image */}
        <div className="relative w-full aspect-video">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover object-top"
            priority
            sizes="(max-width: 896px) 100vw, 896px"
          />
        </div>
      </div>

      {/* Bottom reflection line */}
      <div
        aria-hidden="true"
        className="absolute -bottom-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#75C043]/40 to-transparent"
      />
    </motion.div>
  );
}
