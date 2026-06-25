"use client";

import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Mic2,
  Newspaper,
  ShieldCheck,
} from "lucide-react";
import { motion } from "motion/react";

const useCaseList = [
  {
    title: "Newsroom editors",
    desc: "Find the soundbite before the segment closes. Search 200 hours of archive in seconds.",
    slug: "newsrooms",
    icon: Newspaper,
  },
  {
    title: "Podcast producers",
    desc: "Pull clips from 300 episodes without listening to any of them.",
    slug: "podcasts",
    icon: Mic2,
  },
  {
    title: "Journalists",
    desc: "A private, searchable archive of every source conversation, forever.",
    slug: "journalists",
    icon: FileText,
  },
];

export default function Workflow() {
  return (
    <section className="py-8 md:py-16 bg-[#F8FAF9]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-16">
          <div className="font-mono text-xs md:text-[13px] tracking-[0.14em] uppercase text-[#5DA233] font-medium mb-4">
            Built for the way you work
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-ugle-slate mb-6">
            Three real editorial workflows.
          </h2>
        </div>

        {/* <div className="flex flex-col gap-6 mb-32">
          {[
            {
              title: "Newsroom editors",
              desc: "Find the soundbite before the segment closes. Search 200 hours of archive in seconds.",
              link: "/use-cases/newsrooms",
              icon: Newspaper,
            },
            {
              title: "Podcast producers",
              desc: "Pull clips from 300 episodes without listening to any of them.",
              link: "/use-cases/podcasts",
              icon: Mic2,
            },
            {
              title: "Journalists",
              desc: "A private, searchable archive of every source conversation, forever.",
              link: "/use-cases/journalists",
              icon: FileText,
            },
          ].map((item, i) => (
            <Link
              key={i}
              href={item.link}
              className="flex flex-col md:flex-row md:items-center justify-between p-8 md:p-12 bg-white border border-ugle-light/60 hover:border-[#75C043] rounded-3xl transition-all group shadow-sm hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-8 mb-6 md:mb-0">
                <div className="w-16 h-16 bg-[#F8FAF9] text-ugle-slate rounded-2xl flex items-center justify-center group-hover:text-[#75C043] group-hover:bg-[#75C043]/10 transition-colors">
                  <item.icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-ugle-slate mb-2">
                    {item.title}
                  </h3>
                  <p className="text-ugle-gray text-lg md:text-xl leading-relaxed max-w-xl">
                    {item.desc}
                  </p>
                </div>
              </div>
              <div className="text-[#75C043] font-bold text-lg md:text-xl opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all flex items-center gap-2">
                Read workflow{" "}
                <span className="text-2xl leading-none">&rarr;</span>
              </div>
            </Link>
          ))}
        </div> */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
        >
          {useCaseList.map((c, idx) => (
            <Link
              key={idx}
              href={`/use-cases/${c.slug}`}
              className="group block bg-white border border-ugle-light/60 hover:border-ugle-green/50 rounded-2xl p-8 transition-all hover:shadow-[0_10px_40px_-10px_rgba(117,192,67,0.15)] relative overflow-hidden"
            >
              <div className="bg-white size-12 rounded-xl flex items-center justify-center border border-ugle-light shadow-sm mb-6 group-hover:scale-110 transition-transform">
                <c.icon className="size-6 text-ugle-slate" />
              </div>

              <h2 className="text-2xl font-bold mb-3 text-ugle-slate">
                {c.title}
              </h2>

              <p className="text-ugle-gray mb-8 leading-relaxed">{c.desc}</p>

              <div className="flex items-center text-ugle-green font-semibold text-sm uppercase tracking-widest mt-auto group-hover:translate-x-2 transition-transform">
                Read workflow <ArrowRight className="size-4 ml-2" />
              </div>
            </Link>
          ))}
        </motion.div>

        {/* Privacy statement */}
        <div className="mb-16 p-10 md:p-16 bg-[#1C1C1C] rounded-3xl text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 size-125 bg-[#75C043] rounded-full blur-[150px] opacity-20 transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-4 mb-8">
              <ShieldCheck className="w-10 h-10 text-[#75C043]" />
              <h3 className="text-2xl md:text-3xl font-bold">
                Architecturally private.
              </h3>
            </div>
            <p className="text-white/80 text-xl md:text-2xl leading-relaxed font-medium">
              Ugle does not have access to your files. Ever. Indexing runs
              entirely on your device. No servers receive your transcripts. No
              telemetry collects your searches. Your archive is yours.
            </p>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-ugle-slate mb-8">
            Index once.
            <br />
            Search forever.
          </h2>
          <p className="text-xl md:text-2xl text-ugle-gray mb-12 font-medium">
            macOS and Windows. No account required.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              href="/download"
              className="inline-flex items-center justify-center bg-[#75C043] hover:bg-[#86d950] text-[#1C1C1C] font-bold py-5 px-12 rounded-2xl shadow-lg transition-transform hover:scale-105 text-xl"
            >
              Get Early Access
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
