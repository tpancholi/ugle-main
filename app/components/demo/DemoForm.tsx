"use client";

import { useActionState } from "react";
import { Check } from "lucide-react";
import { motion } from "motion/react";
import { requestDemo, type ActionState } from "@/app/actions/demo";

const initialState: ActionState = { success: false, message: "" };

export default function DemoForm() {
  const [state, formAction, isPending] = useActionState(
    requestDemo,
    initialState,
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-[#2A2A2A] rounded-2xl p-8 md:p-10 border border-white/10 shadow-2xl relative"
    >
      {!state.success ? (
        <form action={formAction} className="space-y-5 text-white">
          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-[14px] font-semibold text-white/80">
                First name
              </label>
              <input
                type="text"
                name="firstName"
                required
                className="w-full bg-[#1C1C1C] border border-white/10 rounded-lg px-4 py-3 text-[15px] focus:outline-none focus:border-[#75C043] transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[14px] font-semibold text-white/80">
                Last name
              </label>
              <input
                type="text"
                name="lastName"
                required
                className="w-full bg-[#1C1C1C] border border-white/10 rounded-lg px-4 py-3 text-[15px] focus:outline-none focus:border-[#75C043] transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[14px] font-semibold text-white/80">
              Work email
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full bg-[#1C1C1C] border border-white/10 rounded-lg px-4 py-3 text-[15px] focus:outline-none focus:border-[#75C043] transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[14px] font-semibold text-white/80">
              Company name
            </label>
            <input
              type="text"
              name="company"
              required
              className="w-full bg-[#1C1C1C] border border-white/10 rounded-lg px-4 py-3 text-[15px] focus:outline-none focus:border-[#75C043] transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[14px] font-semibold text-white/80">
              Team size
            </label>
            <select
              name="teamSize"
              required
              className="w-full bg-[#1C1C1C] border border-white/10 rounded-lg px-4 py-3 text-[15px] focus:outline-none focus:border-[#75C043] transition-all appearance-none text-white"
            >
              <option value="">Select team size...</option>
              <option>1-5 editors</option>
              <option>6-20 editors</option>
              <option>21-50 editors</option>
              <option>50+ editors</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-[14px] font-semibold text-white/80">
              How are you currently handling archive search?
            </label>
            <textarea
              name="currentSearch"
              rows={3}
              required
              className="w-full bg-[#1C1C1C] border border-white/10 rounded-lg px-4 py-3 text-[15px] focus:outline-none focus:border-[#75C043] transition-all resize-none"
            ></textarea>
          </div>

          {/* Validation error */}
          {state.error && (
            <p className="text-red-400 text-sm font-medium">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#75C043] text-[#102206] font-bold py-4 px-6 rounded-lg transition-colors hover:bg-[#5DA233] hover:text-white text-[15px] mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? "Sending…" : "Request Demo"}
          </button>
        </form>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="py-12 text-center text-white flex flex-col items-center justify-center h-full min-h-100"
        >
          <div className="w-16 h-16 bg-[#75C043]/20 text-[#75C043] rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8" strokeWidth={3} />
          </div>
          <h2 className="text-2xl font-bold mb-3">Request Received</h2>
          <p className="text-white/60 text-lg max-w-sm mx-auto">
            Thank you for your interest. Our enterprise team will be in touch
            shortly to schedule your demo.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
