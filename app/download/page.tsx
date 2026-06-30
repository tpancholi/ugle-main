"use client";

import { motion } from "motion/react";
import DownloadButton from "@/app/components/DownloadButton";

export default function DownloadPage() {
  return (
    <div className="bg-[#1C1C1C] min-h-screen text-white pt-24 pb-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white leading-tight">
            Download Ugle.
          </h1>
          <p className="text-2xl text-white/70 mb-16 font-light">
            Free. No account. No upload.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-18">
            <DownloadButton
              platform="macos"
              variant="filled"
              size="sm"
              href="/get-early-access"
            />
            <DownloadButton
              platform="windows"
              variant="outline"
              size="sm"
              href="/get-early-access"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="space-y-16 mt-16 border-t border-white/10 pt-16 flex flex-col md:flex-row gap-12"
        >
          <div className="md:w-1/2">
            <h2 className="text-2xl font-bold mb-4 text-white">
              System requirements
            </h2>
            <p className="text-sm font-mono text-white/50 mb-8">
              macOS 12+ · Windows 10 64-bit · v1.0.4 · June 2026
            </p>

            <div className="border border-white/10 rounded-xl overflow-hidden bg-white/5 backdrop-blur">
              <table className="w-full text-left">
                <tbody className="divide-y divide-white/5">
                  <tr className="bg-black/20">
                    <td className="py-4 px-6 font-semibold text-sm w-1/3 text-white/90">
                      Requirement
                    </td>
                    <td className="py-4 px-6 font-semibold text-sm text-white/90">
                      Specification
                    </td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 font-semibold text-sm text-white/90">
                      OS
                    </td>
                    <td className="py-4 px-6 text-white/70">
                      macOS 12 Monterey+ / Windows 10 64-bit+
                    </td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 font-semibold text-sm text-white/90">
                      RAM
                    </td>
                    <td className="py-4 px-6 text-white/70">
                      8GB minimum. 16GB recommended for large archives.
                    </td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 font-semibold text-sm text-white/90">
                      Storage
                    </td>
                    <td className="py-4 px-6 text-white/70">
                      4GB minimum for application and index.
                    </td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 font-semibold text-sm text-white/90">
                      Processor
                    </td>
                    <td className="py-4 px-6 text-white/70">
                      Any modern CPU. Apple M-series provides fastest indexing.
                    </td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 font-semibold text-sm text-white/90">
                      Internet
                    </td>
                    <td className="py-4 px-6 text-white/70">
                      Initial download and updates only.
                    </td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 font-semibold text-sm text-white/90">
                      Account
                    </td>
                    <td className="py-4 px-6 text-white/70">None required.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="md:w-1/2 md:pl-12">
            <h2 className="text-2xl font-bold mb-8 text-white">
              After download
            </h2>
            <ol className="space-y-6 list-decimal pl-5 text-white/90 font-medium marker:text-[#75C043] marker:font-bold">
              <li className="pl-4 pb-4 border-b border-white/10">
                Download the installer (~280MB).
              </li>
              <li className="pl-4 pb-4 border-b border-white/10">
                Run the installer. No admin privileges required on macOS.
                Standard UAC on Windows.
              </li>
              <li className="pl-4 pb-4 border-b border-white/10">
                Launch Ugle. No sign-up screen. Interface opens immediately.
              </li>
              <li className="pl-4 pb-4 border-b border-white/10">
                Import your first file. Drag and drop, or File &gt; Import.
              </li>
              <li className="pl-4 pb-4 border-b border-white/10">
                Indexing begins in the background. Notification on completion.
              </li>
              <li className="pl-4">Search. Type anything. Find the moment.</li>
            </ol>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
