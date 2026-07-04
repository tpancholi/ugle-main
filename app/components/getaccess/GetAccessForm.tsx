"use client";

import { useActionState } from "react";
import { Check } from "lucide-react";
import { motion } from "motion/react";
import { requestEarlyAccess, type ActionState } from "@/app/actions/early-access";

const initialState: ActionState = { success: false, message: "" };

const inputClass =
  "w-full bg-[#F8FAF9] border border-ugle-light/60 rounded-[10px] px-4 py-3 text-[15px] text-ugle-slate focus:outline-none focus:border-[#75C043] focus:ring-1 focus:ring-[#75C043] transition-all";

export default function GetAccessForm() {
  const [state, formAction, isPending] = useActionState(
    requestEarlyAccess,
    initialState,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
      className="bg-white rounded-2xl p-8 md:p-12 border border-ugle-light/60 shadow-sm"
    >
      {!state.success ? (
        <form action={formAction} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-[15px] font-bold text-ugle-slate">
                First name
              </label>
              <input
                type="text"
                name="firstName"
                required
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[15px] font-bold text-ugle-slate">
                Last name
              </label>
              <input
                type="text"
                name="lastName"
                required
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[15px] font-bold text-ugle-slate">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[15px] font-bold text-ugle-slate">
              Contact number
            </label>
            <input
              type="tel"
              name="phone"
              required
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[15px] font-bold text-ugle-slate">
              Primary OS
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-4 border border-ugle-light/60 rounded-[10px] cursor-pointer hover:border-[#75C043] transition-colors">
                <input
                  type="radio"
                  name="os"
                  value="macOS"
                  required
                  className="text-[#75C043] focus:ring-[#75C043]"
                />
                <span className="text-[15px] font-medium text-ugle-slate">
                  macOS
                </span>
              </label>
              <label className="flex items-center gap-3 p-4 border border-ugle-light/60 rounded-[10px] cursor-pointer hover:border-[#75C043] transition-colors">
                <input
                  type="radio"
                  name="os"
                  value="Windows"
                  className="text-[#75C043] focus:ring-[#75C043]"
                />
                <span className="text-[15px] font-medium text-ugle-slate">
                  Windows
                </span>
              </label>
            </div>
          </div>

          {/* Validation error */}
          {state.error && (
            <p className="text-red-500 text-sm font-medium">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-ugle-slate text-white font-bold py-4 px-6 rounded-[10px] transition-colors hover:bg-[#222] text-[15px] mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? "Submitting…" : "Request Access"}
          </button>
        </form>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="py-12 text-center"
        >
          <div className="w-16 h-16 bg-[#75C043]/10 text-[#75C043] rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8" strokeWidth={3} />
          </div>
          <h2 className="text-2xl font-bold text-ugle-slate mb-3">
            Request Received
          </h2>
          <p className="text-ugle-gray text-lg max-w-md mx-auto">
            Thank you for your interest. We&apos;ll be in touch soon with your
            early access invitation.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
