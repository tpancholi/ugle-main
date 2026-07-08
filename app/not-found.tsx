import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found | Ugle",
  description: "The page you are looking for could not be found.",
};

export default function NotFound() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 md:py-32 text-center w-full">
      <div className="font-mono text-sm md:text-[15px] tracking-[0.14em] uppercase text-ugle-green font-medium mb-4">
        Error 404
      </div>
      <h1 className="text-[2.3rem] sm:text-[2.6rem] md:text-6xl font-bold tracking-tight leading-[1.2] text-ugle-slate mb-6">
        Page Not Found.
      </h1>
      <p className="text-base sm:text-lg md:text-xl text-ugle-gray leading-relaxed max-w-xl font-medium mb-10">
        We couldn&apos;t find the page you were looking for. It might have been
        moved or doesn&apos;t exist.
      </p>

      <Link
        href="/"
        className="bg-ugle-green hover:bg-[#86d950] transition-colors text-white font-bold py-4 px-10 rounded-xl shadow-lg hover:shadow-xl text-base md:text-lg text-center flex items-center justify-center gap-3 w-full sm:w-auto"
      >
        Return to Homepage
      </Link>
    </main>
  );
}
