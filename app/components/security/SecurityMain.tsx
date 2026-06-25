"use client";

import { CheckCircle2, FileCheck, Lock, Server } from "lucide-react";
import { motion } from "motion/react";

export default function SecurityMain() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
      className="space-y-16"
    >
      <section className="bg-[#F8FAF9] border border-ugle-light/60 rounded-2xl p-8 md:p-12 mb-16 relative overflow-hidden">
        <Server className="absolute -right-8 -bottom-8 w-64 h-64 text-ugle-light/30" />
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-bold mb-4 text-ugle-slate flex items-center gap-3">
            <Lock className="w-8 h-8 text-[#75C043]" />
            Local-First Engine
          </h2>
          <p className="text-lg text-ugle-gray mb-6 leading-relaxed">
            Most transcription tools send files to a server, process them
            remotely, and return results. This creates data exposure — however
            briefly. Ugle is architecturally different. The transcription model
            runs on your device. The index writes to a local folder. Search
            executes locally. At no point does content leave your machine.
          </p>
          <div className="inline-flex items-center gap-2 bg-[#75C043]/10 text-[#75C043] font-medium px-4 py-2 rounded text-sm mt-2">
            <CheckCircle2 className="w-4 h-4" /> This is not a feature toggle or
            private mode. It is how Ugle works, every time.
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 text-ugle-slate">
          Data locations
        </h2>
        <div className="border border-ugle-light/60 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm md:text-base">
            <thead className="bg-[#F8FAF9] border-b border-ugle-light/60">
              <tr>
                <th className="py-4 px-6 font-semibold text-ugle-slate w-1/4">
                  Data type
                </th>
                <th className="py-4 px-6 font-semibold text-ugle-slate">
                  Where it lives
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ugle-light/40">
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6 font-medium text-ugle-slate border-l-2 border-transparent">
                  Audio/video files
                </td>
                <td className="py-4 px-6 text-ugle-gray">
                  Original location on your device. Ugle reads from the path.
                  Nothing is copied.
                </td>
              </tr>
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6 font-medium text-ugle-slate border-l-2 border-transparent">
                  Transcripts
                </td>
                <td className="py-4 px-6 text-ugle-gray">
                  Generated locally. Stored in your Ugle Library folder. Never
                  transmitted.
                </td>
              </tr>
              <tr className="hover:bg-gray-50/50 transition-colors border-l-2 border-[#75C043]">
                <td className="py-4 px-6 font-medium text-ugle-slate">
                  Search index
                </td>
                <td className="py-4 px-6 text-ugle-gray">
                  Encrypted local database in your Library folder. Never
                  transmitted.
                </td>
              </tr>
              <tr className="hover:bg-gray-50/50 transition-colors border-l-2 border-[#75C043]">
                <td className="py-4 px-6 font-medium text-ugle-slate">
                  Search queries
                </td>
                <td className="py-4 px-6 text-ugle-gray">
                  Executed locally. Not logged. Not transmitted.
                </td>
              </tr>
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6 font-medium text-ugle-slate border-l-2 border-transparent">
                  Licence activation
                </td>
                <td className="py-4 px-6 text-ugle-gray">
                  Email address + device ID sent once at activation. No content
                  data.
                </td>
              </tr>
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6 font-medium text-ugle-slate border-l-2 border-transparent">
                  Update checks
                </td>
                <td className="py-4 px-6 text-ugle-gray">
                  Version numbers only. Optional — can be disabled. No
                  content/usage data.
                </td>
              </tr>
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6 font-medium text-ugle-slate border-l-2 border-transparent">
                  Crash reports
                </td>
                <td className="py-4 px-6 text-ugle-gray">
                  Opt-in only at time of crash. Technical diagnostics only. No
                  file content.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="pt-8">
        <h2 className="text-2xl font-bold mb-6 text-ugle-slate flex items-center gap-3">
          <FileCheck className="w-6 h-6 text-[#75C043]" />
          IT & compliance Q&A
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {[
            {
              q: "Firewall exceptions needed?",
              a: "No. Outbound: licence validation, update checks (optional), opt-in crash reports. No content traffic.",
            },
            {
              q: "Air-gapped deployment?",
              a: "Yes. Activate on a networked machine, then move to air-gapped environment. Manual update packages available on request.",
            },
            {
              q: "Where does the index live?",
              a: "macOS: ~/Library/Application Support/Ugle/\nWindows: %APPDATA%/Ugle/\nLocation is configurable.",
            },
            {
              q: "Index on encrypted drive?",
              a: "Yes. Ugle reconnects wherever the Library folder is located.",
            },
            {
              q: "Is the index encrypted?",
              a: "AES-256 at rest. Encryption key derived from machine hardware ID.",
            },
            {
              q: "MDM deployment?",
              a: "MSI for Windows MDM. macOS PKG for Jamf. Contact enterprise@ugle.ai.",
            },
            {
              q: "Usage analytics collected?",
              a: "No. No data about which files you index, what you search, or usage frequency.",
            },
          ].map((item, i) => (
            <div key={i} className="border-b border-ugle-light/40 pb-6">
              <div className="font-semibold text-ugle-slate mb-2">{item.q}</div>
              <div className="text-ugle-gray leading-relaxed whitespace-pre-wrap">
                {item.a}
              </div>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
