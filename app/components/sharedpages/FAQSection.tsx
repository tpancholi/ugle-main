"use client";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React from "react";

export const FAQSection = ({
  items,
}: {
  items: { question: string; answer: string }[];
}) => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  return (
    <div className="mt-12 md:mt-16 mb-16 max-w-4xl mx-auto md:px-6">
      <h2 className="text-3xl md:text-4xl font-bold mb-10 text-ugle-slate text-center">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4 text-left">
        {items.map((item, i) => (
          <div
            key={i}
            className="border border-ugle-light/60 rounded-xl bg-white overflow-hidden shadow-sm"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-[#F8FAF9] transition-colors"
            >
              <span className="font-bold text-lg text-ugle-slate pr-4">
                {item.question}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-ugle-gray transition-transform duration-300 shrink-0 ${openIndex === i ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="px-6 pb-6 text-ugle-gray leading-relaxed pt-2">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: items.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          }),
        }}
      />
    </div>
  );
};
