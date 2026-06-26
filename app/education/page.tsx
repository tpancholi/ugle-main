import { GraduationCap } from "lucide-react";
import EducationForm from "../components/EducationForm";
import GlobalCTA from "../components/GlobalCTA";

export default function page() {
  return (
    <>
      <div className="bg-[#F8FAF9] min-h-screen pt-24 pb-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-ugle-light/30 text-ugle-slate mb-6">
            <GraduationCap className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-ugle-slate mb-4">
            Educational Pack
          </h1>
          <p className="text-xl text-ugle-gray max-w-xl mx-auto mb-12">
            Apply for free access if you are a student or instructor.
          </p>

          <EducationForm />
        </div>
      </div>
      <section className="w-full border-t border-ugle-light/60 bg-[#F8FAF9] py-16 md:py-20">
        <GlobalCTA />
      </section>
    </>
  );
}
