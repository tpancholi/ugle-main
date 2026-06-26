import { Building2 } from "lucide-react";
import ContactForm from "../components/ContactForm";
import GlobalCTA from "../components/GlobalCTA";

export default function ContactPage() {
  return (
    <>
      <div className="bg-[#F8FAF9] min-h-screen pt-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-ugle-light/30 text-ugle-slate mb-6">
            <Building2 className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-ugle-slate mb-4">
            Contact Sales
          </h1>
          <p className="text-xl text-ugle-gray max-w-xl mx-auto mb-12">
            Get a custom commercial subscription for your organization.
          </p>

          <ContactForm />
        </div>
      </div>

      <section className="w-full border-t border-ugle-light/60 bg-[#F8FAF9] py-16 md:py-20">
        <GlobalCTA />
      </section>
    </>
  );
}
