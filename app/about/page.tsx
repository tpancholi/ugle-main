import { ShieldCheck, EyeOff, FolderOpen, Users } from "lucide-react";
import GlobalCTA from "../components/GlobalCTA";
import PageHeader from "../components/sharedpages/PageHeader";
import Section from "../components/sharedpages/Section";
import BottomHighlightedSection from "../components/sharedpages/BottomHighlightedSection";

const philosophyCards = [
  {
    title: "100% Private",
    desc: "Indexing runs entirely on your device. No servers ever receive your transcripts.",
    icon: ShieldCheck,
  },
  {
    title: "Zero Telemetry",
    desc: "Your search history is entirely yours. We do not track what you look for or how you work.",
    icon: EyeOff,
  },
  {
    title: "No Vendor Lock-In",
    desc: "Your media files remain exactly where they are in their original folders or cloud drives. Ugle simply reads them to build a local index, meaning your archive is never trapped in a proprietary ecosystem.",
    icon: FolderOpen,
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Top Section (White background) */}
      <div className="max-w-5xl mx-auto px-6 pt-16 md:pt-24 pb-8">
        <PageHeader
          title="About Ugle"
          subtitle="At Ugle, we build high-performance, private utility software for media professionals, newsrooms, and podcasters."
        />

        <div className="space-y-4">
          <Section title="Our Mission" delay={0.1}>
            <p>
              We believe finding the right moment in your video archive
              shouldn&apos;t require compromising your timeline or your source’s
              trust. We built Ugle to eliminate the trade-off between search
              speed and data security.
            </p>
          </Section>
        </div>
      </div>

      {/* Middle Section (Philosophy & Cards on Light background) */}
      <section className="w-full bg-[#F8FAF9] border-y border-ugle-light/60 pt-4 pb-16 md:pb-20">
        <div className="max-w-5xl mx-auto px-6">
          <Section title="The Philosophy: Local-First" delay={0.2}>
            <div className="space-y-6">
              <p>
                Most modern tools ask you to upload your sensitive, unreleased
                footage to a cloud server to index it. We think that approach is
                fundamentally broken for professional workflows.
              </p>
              <p>
                By shifting heavy AI transcription and semantic indexing
                entirely to local hardware, Ugle gives you 30ms search speeds
                while keeping your files completely secure.
              </p>
            </div>
          </Section>

          {/* Philosophy Cards Grid - Full Width & Centered */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {philosophyCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="group flex flex-col bg-white border border-ugle-light/60 hover:border-ugle-green/50 rounded-2xl p-8 transition-all hover:shadow-[0_10px_40px_-10px_rgba(117,192,67,0.15)] relative overflow-hidden"
                >
                  <div className="bg-white size-12 rounded-xl flex items-center justify-center border border-ugle-light shadow-sm mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="size-6 text-ugle-slate" />
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-ugle-slate">
                    {card.title}
                  </h3>

                  <p className="text-ugle-gray text-sm leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Who We Are Section (White background) */}
      <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        <BottomHighlightedSection
          icon={<Users className="size-10 text-[#75C043]" />}
          title="Who We Are"
          desc="We are a distributed team of engineers and product designers obsessed with building local-first tools that respect your machine, your data, and your deadlines."
        />
      </div>

      {/* Bottom CTA */}
      <section className="w-full border-t border-ugle-light/60 bg-[#F8FAF9] py-16 md:py-20">
        <GlobalCTA />
      </section>
    </>
  );
}
