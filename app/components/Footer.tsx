"use client";

import { useState } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { showToast } from "../lib/showToast";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const validate = (val: string) => {
    if (!val) return "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "INVALID EMAIL FORMAT";
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (error || val) setError(validate(val));
    if (submitted) setSubmitted(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate(email);
    if (err || !email) {
      setError(err || "EMAIL IS REQUIRED");
      return;
    }
    setSubmitted(true);
    showToast("Waitlist Joined Successfully");
  };
  return (
    <footer className="bg-[#1C1C1C] text-white pt-16 md:pt-24 pb-12 overflow-hidden border-t border-ugle-slate/20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16 md:mb-20">
          <div className="w-full md:max-w-sm">
            <Image
              src="/Ugle Logo White.png"
              alt="Ugle Logo"
              width={110}
              height={40}
            />
            {/* <Logo dark /> */}
            <p className="mt-6 text-gray-400 font-medium leading-relaxed">
              The local-first search application for media professionals. Find
              the soundbite. Pull the clip. Hit the deadline.
            </p>
            <div className="mt-8 flex gap-6 text-sm font-semibold text-gray-400">
              <Link
                href="/how-it-works"
                className="hover:text-white transition-colors"
              >
                How it works
              </Link>
              <Link
                href="/use-cases"
                className="hover:text-white transition-colors"
              >
                Use cases
              </Link>
              <Link
                href="/pricing"
                className="hover:text-white transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/download"
                className="hover:text-white transition-colors text-[#75C043]"
              >
                Download
              </Link>
            </div>
            <div className="mt-4 flex gap-6 text-sm font-semibold text-gray-400">
              <Link
                href="/security"
                className="hover:text-white transition-colors"
              >
                Security
              </Link>
              <Link
                href="/changelog"
                className="hover:text-white transition-colors"
              >
                Changelog
              </Link>
              <Link href="/blog" className="hover:text-white transition-colors">
                Blog
              </Link>
            </div>
          </div>

          <div className="w-full md:w-auto flex flex-col md:items-end relative min-h-24">
            <label className="block font-mono text-xs text-[#75C043] mb-3 tracking-widest uppercase font-semibold">
              Become an Ugler Now
            </label>
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#75C043]/10 border border-[#75C043]/40 rounded px-6 py-3.5 flex items-center justify-center gap-3 w-full md:w-87.5 shadow-[0_0_20px_rgba(117,192,67,0.2)]"
                >
                  <Check className="w-5 h-5 text-[#75C043]" />
                  <span className="font-mono text-xs uppercase tracking-widest text-[#75C043] font-bold">
                    Successfully Joined
                  </span>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col w-full relative"
                >
                  <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-0 relative">
                    <input
                      type="email"
                      value={email}
                      onChange={handleChange}
                      placeholder="YOUR@EMAIL.COM"
                      className={`bg-[#111] border-2 ${error ? "border-red-500 focus:border-red-400 focus:shadow-[0_0_15px_rgba(239,68,68,0.2)]" : "border-[#333] focus:border-[#75C043] focus:shadow-[0_0_15px_rgba(117,192,67,0.3)]"} text-white rounded sm:rounded-r-none px-4 py-3 focus:outline-none font-mono text-xs w-full sm:w-64 transition-all placeholder:text-gray-600 uppercase tracking-wider`}
                    />
                    <button
                      type="submit"
                      className="bg-[#75C043] hover:bg-[#86d950] text-ugle-slate font-mono text-xs font-bold px-8 py-3 rounded sm:rounded-l-none transition-all shadow-[0_0_15px_rgba(117,192,67,0.3)] w-full sm:w-auto whitespace-nowrap uppercase tracking-wider hover:shadow-[0_0_25px_rgba(117,192,67,0.6)] focus:outline-none focus:ring-2 focus:ring-[#75C043] focus:ring-offset-2 focus:ring-offset-[#1C1C1C]"
                    >
                      Join
                    </button>
                  </div>
                  <AnimatePresence>
                    {error && (
                      <motion.span
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute -bottom-7 left-0 md:left-auto md:right-0 font-mono text-[10px] text-red-500 uppercase tracking-widest font-semibold text-left md:text-right w-full"
                      >
                        {error}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex gap-4">
            <Link
              href="/privacy-policy"
              className="text-gray-400 hover:text-white transition-colors font-mono text-xs"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-gray-400 hover:text-white transition-colors font-mono text-xs"
            >
              Terms of Service
            </Link>
          </div>
          <div className="text-gray-400 font-mono text-xs text-center sm:text-left">
            © 2026 Ugle. All rights reserved.
          </div>

          <div className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors relative group justify-center sm:justify-end">
            <Globe className="w-4 h-4 text-[#75C043]" />
            <select className="bg-transparent border-none outline-none cursor-pointer appearance-none font-mono text-xs focus:outline-none uppercase tracking-wider pr-6 z-10 relative">
              <option value="en" className="text-ugle-slate">
                EN - English
              </option>
              <option value="es" className="text-ugle-slate">
                ES - Español
              </option>
              <option value="fr" className="text-ugle-slate">
                FR - Français
              </option>
              <option value="de" className="text-ugle-slate">
                DE - Deutsch
              </option>
              <option value="ja" className="text-ugle-slate">
                JA - 日本語
              </option>
            </select>
            <ChevronDown className="w-3 h-3 absolute right-0 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </footer>
  );
}
