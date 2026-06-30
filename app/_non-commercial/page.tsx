import { UserCircle2 } from "lucide-react";
import React from "react";
import NonCommercialForm from "../components/NonCommercialForm";
import GlobalCTA from "../components/GlobalCTA";

export default function page() {
  return (
    <>
      <div className="bg-[#F8FAF9] min-h-screen pt-24 pb-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-ugle-light/30 text-ugle-slate mb-6">
            <UserCircle2 className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-ugle-slate mb-4">
            Non-commercial Use
          </h1>
          <p className="text-xl text-ugle-gray max-w-xl mx-auto mb-12">
            Start using Ugle for free for personal, non-commercial projects.
          </p>

          <NonCommercialForm />
        </div>
      </div>
      <section className="w-full border-t border-ugle-light/60 bg-[#F8FAF9] py-16 md:py-20">
        <GlobalCTA />
      </section>
    </>
  );
}
