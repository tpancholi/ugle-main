"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

const blogItems = [
  {
    path: "/blog/why-local-first",
    title: "Why we built Ugle local-first",
    desc: "The first version of what became Ugle uploaded files to a server. We built it that way because it was easier — existing transcription APIs, no on-device model to maintain, faster to ship...",
    meta: "4 min read · Product philosophy",
  },
  {
    path: "/blog/cost-of-scrubbing-timelines",
    title: "The real cost of scrubbing timelines",
    desc: "A documentary editor we spoke to last year spends six to ten hours a week scrubbing through footage to find moments she already knows exist. She has watched most of it once...",
    meta: "3 min read · Workflow",
  },
  {
    path: "/blog/what-transcription-accuracy-means",
    title: "What 95% transcription accuracy actually means",
    desc: "We say 95% accuracy. That number is word error rate measured against manually transcribed ground truth across languages, accents, recording conditions, and speaker types...",
    meta: "5 min read · Product",
  },
];

export default function BlogList() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
    >
      {blogItems.map((post, i) => (
        <Link
          key={i}
          href={post.path}
          className="group block border-t border-ugle-light/60 py-12 transition-colors hover:bg-[#F7F7F5] -mx-6 px-6"
        >
          <div className="text-[13px] font-mono text-ugle-gray mb-3">
            {post.meta}
          </div>
          <h2 className="text-[28px] md:text-[32px] font-bold mb-3 text-ugle-slate group-hover:text-[#5DA233] transition-colors leading-[1.2]">
            {post.title}
          </h2>
          <p className="text-[17px] text-ugle-gray mb-6 leading-[1.6] max-w-3xl">
            {post.desc}
          </p>
          <div className="flex items-center text-[#5DA233] font-bold text-[15px] group-hover:translate-x-1 transition-transform">
            Read post{" "}
            <ArrowRight className="w-4 h-4 ml-1.5" strokeWidth={2.5} />
          </div>
        </Link>
      ))}
    </motion.div>
  );
}
