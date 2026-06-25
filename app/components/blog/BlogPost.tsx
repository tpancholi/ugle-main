"use client";

import { motion } from "motion/react";

export default function BlogPost({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
      className="prose prose-lg max-w-none text-[#3A3A3A] prose-p:leading-[1.65] prose-headings:text-[#3A3A3A] prose-headings:font-bold prose-headings:tracking-tight prose-a:text-[#5DA233] prose-a:font-semibold prose-a:no-underline hover:prose-a:underline prose-strong:text-[#3A3A3A] prose-blockquote:border-l-[3px] prose-blockquote:border-[#75C043] prose-blockquote:bg-[#F7F7F5] prose-blockquote:py-3 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:rounded-r-lg prose-blockquote:text-[#3A3A3A] prose-blockquote:font-medium prose-blockquote:text-[20px]"
    >
      {children}
    </motion.div>
  );
}
