import BlogHero from "../components/blog/BlogHero";
import BlogList from "../components/blog/BlogList";

export default function page() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <BlogHero />

      <BlogList />
    </div>
  );
}
