import type { Metadata } from "next";
import BlogHero from "../components/blog/BlogHero";
import BlogList from "../components/blog/BlogList";
import GlobalCTA from "../components/GlobalCTA";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Insights, philosophy, and technical deep-dives into local-first audio search, on-device AI transcription, and privacy-first media workflows.",
  openGraph: {
    title: "Blog",
    description:
      "Insights, philosophy, and technical deep-dives into local-first audio search, on-device AI transcription, and privacy-first media workflows.",
    url: "/blog",
  },
};

export default function page() {
  return (
    <>
      <div className="max-w-4xl mx-auto px-6 py-24">
        <BlogHero />

        <BlogList />
      </div>
      <section className="w-full border-t border-ugle-light/60 bg-[#F8FAF9] py-16 md:py-20">
        <GlobalCTA
          title="Take control of your media."
          subtitle="Get 15 days trial and see for yourself."
        />
      </section>
    </>
  );
}
