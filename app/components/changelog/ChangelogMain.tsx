"use client";

import { motion } from "motion/react";

export default function ChangelogMain() {
  return (
    <div className="space-y-0 pl-4 border-l border-ugle-light/60">
      {[
        {
          v: "v1.0.4",
          date: "June 2026",
          items: [
            {
              t: "[Performance]",
              text: "Indexing speed on Intel improved 23% via parallel audio chunk processing.",
              c: "text-ugle-gray",
            },
            {
              t: "[Feature]",
              text: "OGG and FLAC input format support added.",
              c: "text-blue-600",
            },
            {
              t: "[Fix]",
              text: "Rare crash on files > 4GB on Windows 10 resolved.",
              c: "text-red-500",
            },
            {
              t: "[Improvement]",
              text: "Library view shows total indexed duration.",
              c: "text-[#75C043]",
            },
            {
              t: "[Fix]",
              text: "Transcript view handles overlapping speaker segments correctly.",
              c: "text-red-500",
            },
          ],
        },
        {
          v: "v1.0.3",
          date: "May 2026",
          items: [
            {
              t: "[Feature]",
              text: "WAV clip export added alongside MP3.",
              c: "text-blue-600",
            },
            {
              t: "[Improvement]",
              text: "Search results now show three-line context excerpts.",
              c: "text-[#75C043]",
            },
            {
              t: "[Performance]",
              text: "Index storage size reduced ~18% via improved compression.",
              c: "text-ugle-gray",
            },
            {
              t: "[Fix]",
              text: "Library path can now be set to a network-attached storage volume on macOS.",
              c: "text-red-500",
            },
          ],
        },
        {
          v: "v1.0.2",
          date: "April 2026",
          items: [
            {
              t: "[Fix]",
              text: "Accuracy regression in French and Spanish transcription corrected.",
              c: "text-red-500",
            },
            {
              t: "[Feature]",
              text: "Cmd+K / Ctrl+K opens search from anywhere in the application.",
              c: "text-blue-600",
            },
            {
              t: "[Improvement]",
              text: "Import queue shows estimated indexing time per file.",
              c: "text-[#75C043]",
            },
          ],
        },
        {
          v: "v1.0.1",
          date: "March 2026",
          items: [
            {
              t: "[Feature]",
              text: "Semantic search enabled for all indexed libraries. Previously keyword-only.",
              c: "text-blue-600",
            },
            {
              t: "[Performance]",
              text: "Indexing speed improved 31% on Apple M2 and M3.",
              c: "text-ugle-gray",
            },
            {
              t: "[Feature]",
              text: "MKV video container format support.",
              c: "text-blue-600",
            },
            {
              t: "[Fix]",
              text: "Library folder migration correctly updates all file path references.",
              c: "text-red-500",
            },
          ],
        },
        {
          v: "v1.0.0",
          date: "February 2026 · Initial release",
          items: [
            {
              t: "[Feature]",
              text: "On-device transcription. 90+ languages.",
              c: "text-blue-600",
            },
            {
              t: "[Feature]",
              text: "Semantic + keyword search.",
              c: "text-blue-600",
            },
            {
              t: "[Feature]",
              text: "Audio/video import, clip export.",
              c: "text-blue-600",
            },
          ],
        },
      ].map((log, index) => (
        <motion.div
          key={log.v}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="relative pb-16 pl-8"
        >
          <div className="absolute w-3 h-3 bg-white rounded-full -left-1.5 top-2 border-2 border-ugle-slate"></div>
          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-2xl font-bold font-mono text-ugle-slate">
              {log.v}
            </h2>
            <span className="text-ugle-gray text-sm">{log.date}</span>
          </div>
          <ul className="space-y-4">
            {log.items.map((item, i) => (
              <li
                key={i}
                className="text-lg text-ugle-slate block sm:flex items-start gap-4"
              >
                <span
                  className={`font-mono text-xs w-28 uppercase tracking-wider font-bold shrink-0 pt-1.5 ${item.c}`}
                >
                  {item.t}
                </span>
                <span className="mt-1 sm:mt-0 leading-relaxed">
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}
