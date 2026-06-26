"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { FormInput, FormTextarea } from "./ContactForm";

export default function NonCommercialForm() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div>
      {submitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-ugle-light/60 rounded-2xl p-10 max-w-xl mx-auto shadow-sm"
        >
          <CheckCircle2 className="w-16 h-16 text-[#75C043] mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-ugle-slate mb-3">
            Welcome to Ugle
          </h2>
          <p className="text-ugle-gray mb-8">
            Your account has been created. Please check your email for the
            download link and activation details.
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
          className="bg-white border border-ugle-light/60 rounded-2xl p-8 md:p-10 max-w-xl mx-auto shadow-sm"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
        >
          <FormInput id="fullName" label="Full Name" />
          <FormInput id="email" type="email" label="Email Address" />
          <FormTextarea
            id="projectDesc"
            label="What personal projects will you use Ugle for?"
            rows={3}
          />

          <div className="mb-6 mt-4 flex items-start gap-3 text-left">
            <input
              type="checkbox"
              id="agree"
              required
              className="mt-1 w-4 h-4 text-[#75C043] border-ugle-light/60 rounded focus:ring-[#75C043]"
            />
            <label htmlFor="agree" className="text-sm text-ugle-gray">
              I confirm that I will use Ugle exclusively for non-commercial
              purposes and will not use it to generate revenue.
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-ugle-slate text-white font-bold py-4 px-6 rounded-xl hover:bg-[#222] transition-colors text-lg flex justify-center items-center gap-2"
          >
            Get Started for Free <ArrowRight className="w-5 h-5" />
          </button>
        </motion.form>
      )}
    </div>
  );
}
