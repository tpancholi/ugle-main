"use client";

import { motion } from "motion/react";

export default function PricingFaq() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="max-w-4xl mx-auto"
    >
      <div className="mb-8">
        <h2 className="text-3xl md:text-[38px] font-bold text-ugle-slate tracking-tight">
          Questions
        </h2>
      </div>
      <div className="flex flex-col border-t border-ugle-light/60">
        {[
          {
            q: "Is there a free trial?",
            a: "Yes. 14 days, no file limit, no credit card. At day 14, choose a licence or the app continues in read-only mode — your existing index stays searchable, with no new imports.",
          },
          {
            q: "What counts as a seat?",
            a: "One seat = one machine. Solo licences activate on up to two machines owned by the same person. Team licences are per-machine.",
          },
          {
            q: "What if I reinstall my OS?",
            a: "Deactivate from Settings > Licence, then reactivate after reinstalling. Deactivate and reactivate as many times as needed.",
          },
          {
            q: "Does Ugle work offline?",
            a: "Yes. After activation, Ugle runs entirely without internet. Transcription, indexing, and search are all local. Internet is required for initial activation and updates only.",
          },
          {
            q: "Is there a loyalty discount?",
            a: "Yes. Individual subscribers receive a 15% loyalty discount on every subsequent renewal — annual drops from $199 to $169/year, monthly from $25 to $20/month.",
          },
          {
            q: "Educational or non-commercial pricing?",
            a: "Both are completely free. Education licences require verification of enrollment or employment at an accredited institution (processed within 2 business days). Non-commercial use requires no approval — just confirm you're not earning commercial benefits.",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="py-5 border-b border-ugle-light/60 flex flex-col md:flex-row md:gap-8 md:items-start"
          >
            <h3 className="font-bold text-[17px] text-ugle-slate md:w-1/3 mb-2 md:mb-0">
              {item.q}
            </h3>
            <p className="text-[15.5px] text-ugle-gray leading-relaxed md:w-2/3">
              {item.a}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-ugle-light/60 rounded-[14px] p-8.5 mt-10 shadow-sm">
        <h3 className="text-[22px] font-bold text-ugle-slate mb-2">
          Enterprise
        </h3>
        <p className="text-ugle-gray text-[15.5px]">
          Large team or air-gapped deployment? For newsroom-wide or on-premise
          installations, contact us directly. We work with engineering and IT
          teams.{" "}
          <span className="font-mono text-[#5DA233]">enterprise@ugle.ai</span>
        </p>
      </div>
    </motion.div>
  );
}
