import BlogHero from "../components/blog/BlogHero";
import BlogList from "../components/blog/BlogList";
import GlobalCTA from "../components/GlobalCTA";

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
          subtitle="Join the early access program and see for yourself."
        />
      </section>
    </>
  );
}
