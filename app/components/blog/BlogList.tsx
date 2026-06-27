"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

const blogItems = [
  {
    path: "/blog/languages-supported",
    slug: "languages-supported",
    title: "The 90+ Languages Supported by Ugle",
    desc: "A search tool is only as useful as the language it can index. From the start, we designed Ugle's local-first engine to recognize more than just English — over 90 languages, entirely on-device.",
    meta: "4 min read",
    tag: "Product",
    image: "/images/blogs/The 90+ Languages Supported by Ugle.png",
  },
  {
    path: "/blog/why-local-first",
    slug: "why-local-first",
    title: "Why we built Ugle local-first",
    desc: "The first version of what became Ugle uploaded files to a server. We built it that way because it was easier — existing transcription APIs, no on-device model to maintain, faster to ship...",
    meta: "4 min read",
    tag: "Product philosophy",
    image: "/images/blogs/Why we built Ugle local-first.svg",
  },
  {
    path: "/blog/cost-of-scrubbing-timelines",
    slug: "cost-of-scrubbing-timelines",
    title: "The real cost of scrubbing timelines",
    desc: "A documentary editor we spoke to last year spends six to ten hours a week scrubbing through footage to find moments she already knows exist. She has watched most of it once...",
    meta: "3 min read",
    tag: "Workflow",
    image: "/images/blogs/The real cost of scrubbing timelines.svg",
  },
  {
    path: "/blog/what-transcription-accuracy-means",
    slug: "what-transcription-accuracy-means",
    title: "What 95% transcription accuracy actually means",
    desc: "We say 95% accuracy. That number is word error rate measured against manually transcribed ground truth across languages, accents, recording conditions, and speaker types...",
    meta: "5 min read",
    tag: "Product",
    image: "/images/blogs/What transcription accuracy actually means.svg",
  },
];

export default function BlogList() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
      className="grid grid-cols-1 gap-8"
    >
      {blogItems.map((post, i) => (
        <motion.div
          key={post.slug}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.1 + i * 0.1,
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <Link
            href={post.path}
            className="group flex flex-col md:flex-row gap-0 rounded-2xl border border-ugle-light/60 overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300"
          >
            {/* Image panel */}
            <div className="relative w-full md:w-[42%] shrink-0 aspect-video md:aspect-auto overflow-hidden bg-[#F0F2F0]">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 400px"
              />
              {/* subtle gradient overlay at image bottom on mobile */}
              <div className="absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-white/20 to-transparent md:hidden" />
            </div>

            {/* Text panel */}
            <div className="flex flex-col justify-between p-7 md:p-9 flex-1">
              <div>
                {/* Tag + reading time */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-block bg-[#75C043]/10 text-[#5DA233] text-[11.5px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                    {post.tag}
                  </span>
                  <span className="text-[13px] font-mono text-ugle-gray/70">
                    {post.meta}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-[22px] md:text-[26px] font-bold mb-3 text-ugle-slate group-hover:text-[#5DA233] transition-colors leading-[1.25]">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-[15.5px] text-ugle-gray leading-[1.65] line-clamp-3">
                  {post.desc}
                </p>
              </div>

              {/* Read more */}
              <div className="flex items-center text-[#5DA233] font-bold text-[14px] mt-6 group-hover:translate-x-1 transition-transform">
                Read post{" "}
                <ArrowRight className="w-4 h-4 ml-1.5" strokeWidth={2.5} />
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
