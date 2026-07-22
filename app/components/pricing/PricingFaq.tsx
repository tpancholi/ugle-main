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
            a: "Yes. Request a 15-day trial (no credit card). Our team reviews the request and emails your licence key. One trial per email. Activate on one machine. When the trial ends, purchase a monthly or annual licence to keep creating — your local index stays on your machine.",
          },
          {
            q: "What do I pay?",
            a: "Individual monthly is ₹1,000 + 18% GST (₹1,180 total). Individual annual is ₹10,000 + 18% GST (₹11,800 total). Payments are in INR via Cashfree (UPI, cards, netbanking).",
          },
          {
            q: "What counts as a seat?",
            a: "One personal licence activates on up to two node-locked machines owned by the same person. To move a machine, email support@ugle.ai.",
          },
          {
            q: "How do renewals and cancellations work?",
            a: "Licences are timed. Before expiry we email a renew link — you pay once to extend the same key. Cancel anytime from your manage link; access continues until the paid period ends.",
          },
          {
            q: "Does Ugle work offline?",
            a: "Yes. After activation, Ugle runs entirely without internet. Transcription, indexing, and search are all local. Internet is required for initial activation and updates only.",
          },
          {
            q: "Educational pricing?",
            a: "Education licences are free with verification of enrollment or employment at an accredited institution (typically within 2 business days).",
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
