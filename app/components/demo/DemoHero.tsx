"use client";

import { Check } from "lucide-react";
import { motion } from "motion/react";

export default function DemoHero() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="text-white"
    >
      <div className="font-mono text-[13px] tracking-[0.14em] uppercase text-[#75C043] font-medium mb-3">
        Enterprise
      </div>
      <h1 className="text-[40px] md:text-[56px] font-extrabold tracking-[-0.02em] leading-[1.04] mb-6">
        Let&apos;s talk workflow.
      </h1>
      <p className="text-[18px] md:text-[21px] text-white/70 leading-[1.55] mb-12">
        See how Ugle transforms archive search for editorial teams, newsrooms,
        and production companies.
      </p>

      <div className="space-y-8">
        {[
          {
            title: "Custom Deployment",
            desc: "MDM packaging, air-gapped support, and priority IT onboarding.",
          },
          {
            title: "Team Licencing",
            desc: "Centralized administration and consolidated billing.",
          },
          {
            title: "Workflow Integration",
            desc: "Best practices for deploying local-first search across an established editorial team.",
          },
        ].map((item, i) => (
          <div key={i} className="flex gap-4">
            <Check
              className="w-6 h-6 text-[#75C043] shrink-0 mt-1"
              strokeWidth={2.4}
            />
            <div>
              <h3 className="font-bold text-[17px] mb-1">{item.title}</h3>
              <p className="text-[15px] text-white/60 leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
