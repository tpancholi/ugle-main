"use client";
import Link from "next/link";
import { motion, type Variants } from "motion/react";

const heroStats = [
  {
    metric: "Private",
    value: "100%",
    context:
      "Every frame stays on your machine. Nothing ever reaches a server.",
  },
  {
    metric: "Metering",
    value: "0%",
    context: "No AI tokens. No per-search fees. No monthly bill. Pay once.",
  },
  {
    metric: "Uptime",
    value: "100%",
    context:
      "No rate limits, no outages, no server to crash. It runs when you do.",
  },
  {
    metric: "Setup",
    value: "0%",
    context:
      "Connects to your video platforms out of the box. Nothing to configure.",
  },
];

export default function Hero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
    },
  };
  return (
    <section className="max-w-5xl mx-auto px-6 pt-16 md:pt-24 pb-16 md:pb-24 relative z-10 text-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center gap-10"
      >
        <div className="space-y-6 flex flex-col items-center">
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight leading-[1.05] text-ugle-slate max-w-4xl"
          >
            Find Your Moment. From Your Videos. <br />
            <span className="text-ugle-green inline-block mt-2">
              On your machine.
            </span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-ugle-gray leading-relaxed max-w-2xl font-medium"
          >
            Ugle indexes every word spoken in your archive. Search by meaning in
            30ms. Nothing leaves your device.
          </motion.p>
        </div>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-5 items-center w-full justify-center"
        >
          <Link
            href="/get-early-access"
            className="bg-ugle-green hover:bg-[#86d950] transition-colors text-[#1C1C1C] font-bold py-4 px-10 rounded-xl shadow-lg hover:shadow-xl text-lg text-center flex items-center justify-center gap-3 w-full sm:w-auto"
          >
            Get Early Access
          </Link>
          <Link
            href="/how-it-works"
            className="bg-white hover:bg-gray-50 border-2 border-ugle-light/60 transition-colors text-ugle-slate font-bold py-4 px-10 rounded-xl text-lg text-center flex items-center justify-center gap-2 w-full sm:w-auto hover:border-black/10"
          >
            See how it works &rarr;
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-4 w-full">
          <div className="pt-8 md:pt-12 border-t border-ugle-light/60 grid grid-cols-2 gap-8 md:gap-12 w-full max-w-2xl mx-auto text-center">
            {heroStats.map((s, idx) => (
              <div key={idx} className="flex flex-col">
                <div className="font-mono text-sm text-ugle-gray/60 uppercase tracking-widest mb-1">
                  {s.metric}
                </div>
                <div className="font-mono text-3xl md:text-4xl font-bold text-ugle-slate mb-2">
                  {s.value}
                </div>
                <div className="text-sm text-ugle-gray leading-tight font-medium max-w-60 mx-auto">
                  {s.context}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
