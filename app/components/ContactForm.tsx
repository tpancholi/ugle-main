"use client";

import { useActionState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import {
  submitContactInquiry,
  type ActionState,
} from "@/app/actions/contact";

export const FormInput = ({
  label,
  type = "text",
  placeholder,
  required = true,
  id,
  name,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  id: string;
  name?: string;
}) => (
  <div className="mb-4 text-left">
    <label
      htmlFor={id}
      className="block text-sm font-bold text-ugle-slate mb-1.5"
    >
      {label} {required && <span className="text-[#75C043]">*</span>}
    </label>
    <input
      type={type}
      id={id}
      name={name ?? id}
      required={required}
      placeholder={placeholder}
      className="w-full px-4 py-3 bg-white border border-ugle-light/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#75C043]/50 focus:border-[#75C043] transition-all text-ugle-slate placeholder:text-ugle-gray/50"
    />
  </div>
);

export const FormTextarea = ({
  label,
  placeholder,
  required = true,
  id,
  name,
  rows = 4,
}: {
  label: string;
  placeholder?: string;
  required?: boolean;
  id: string;
  name?: string;
  rows?: number;
}) => (
  <div className="mb-4 text-left">
    <label
      htmlFor={id}
      className="block text-sm font-bold text-ugle-slate mb-1.5"
    >
      {label} {required && <span className="text-[#75C043]">*</span>}
    </label>
    <textarea
      id={id}
      name={name ?? id}
      required={required}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-4 py-3 bg-white border border-ugle-light/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#75C043]/50 focus:border-[#75C043] transition-all text-ugle-slate placeholder:text-ugle-gray/50 resize-y"
    />
  </div>
);

export const FormSelect = ({
  label,
  options,
  required = true,
  id,
  name,
}: {
  label: string;
  options: string[];
  required?: boolean;
  id: string;
  name?: string;
}) => (
  <div className="mb-4 text-left">
    <label
      htmlFor={id}
      className="block text-sm font-bold text-ugle-slate mb-1.5"
    >
      {label} {required && <span className="text-[#75C043]">*</span>}
    </label>
    <select
      id={id}
      name={name ?? id}
      required={required}
      className="w-full px-4 py-3 bg-white border border-ugle-light/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#75C043]/50 focus:border-[#75C043] transition-all text-ugle-slate"
    >
      <option value="">Select an option</option>
      {options.map((opt, i) => (
        <option key={i} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

const initialState: ActionState = { success: false, message: "" };

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContactInquiry,
    initialState,
  );

  return (
    <>
      {state.success ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-ugle-light/60 rounded-2xl p-10 max-w-xl mx-auto shadow-sm"
        >
          <CheckCircle2 className="w-16 h-16 text-[#75C043] mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-ugle-slate mb-3">
            Request Received
          </h2>
          <p className="text-ugle-gray mb-8">
            Our sales team will get back to you shortly to discuss your
            organizational needs.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-bold text-ugle-slate hover:text-[#75C043] transition-colors"
          >
            <ArrowRight className="w-5 h-5 rotate-180" /> Return to Home
          </Link>
        </motion.div>
      ) : (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          action={formAction}
          className="bg-white border border-ugle-light/60 rounded-2xl p-8 md:p-10 max-w-xl mx-auto shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput id="firstName" label="First Name" />
            <FormInput id="lastName" label="Last Name" />
          </div>
          <FormInput
            id="email"
            type="email"
            label="Work Email"
            placeholder="you@company.com"
          />
          <FormInput id="company" label="Company Name" />
          <FormSelect
            id="seats"
            label="Number of Seats"
            options={["3-10", "11-50", "51-200", "200+"]}
          />
          <FormTextarea
            id="usecase"
            label="How does your team plan to use Ugle?"
            rows={3}
          />

          {/* Validation error */}
          {state.error && (
            <p className="text-red-500 text-sm font-medium mt-1">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-4 bg-[#75C043] text-[#102206] font-bold py-4 px-6 rounded-xl hover:bg-[#5DA233] hover:text-white transition-colors text-lg flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? "Submitting\u2026" : "Submit Inquiry"}
            {!isPending && <ArrowRight className="w-5 h-5" />}
          </button>
        </motion.form>
      )}
    </>
  );
}
