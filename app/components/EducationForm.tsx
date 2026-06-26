"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { FormInput, FormSelect } from "./ContactForm";

export default function EducationForm() {
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
            Application Received
          </h2>
          <p className="text-ugle-gray mb-8">
            We will review your educational application and send your activation
            details to your academic email address within 2 business days.
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput id="firstName" label="First Name" />
            <FormInput id="lastName" label="Last Name" />
          </div>
          <FormInput
            id="email"
            type="email"
            label="Academic Email (.edu or equivalent)"
            placeholder="student@university.edu"
          />
          <FormInput id="institution" label="Institution Name" />
          <FormSelect
            id="role"
            label="Your Role"
            options={["Student", "Instructor / Faculty", "Researcher"]}
          />
          <FormInput
            id="proofUrl"
            label="Link to public profile or proof of enrollment"
            type="url"
            placeholder="https://..."
            required={false}
          />

          <button
            type="submit"
            className="w-full mt-4 border border-ugle-slate text-ugle-slate font-bold py-4 px-6 rounded-xl hover:bg-ugle-light/20 transition-colors text-lg flex justify-center items-center gap-2"
          >
            Submit Application <ArrowRight className="w-5 h-5" />
          </button>
        </motion.form>
      )}
    </div>
  );
}
