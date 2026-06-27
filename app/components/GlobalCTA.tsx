import React from "react";
// import Link from "next/link";
import CTAButton from "./CTAButton";

export default function GlobalCTA({
  title,
  subtitle,
  ctaText,
  ctaLink,
}: {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  ctaText?: string;
  ctaLink?: string;
}) {
  return (
    <div className="text-center max-w-4xl mx-auto px-6 relative z-10">
      <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-ugle-slate mb-8">
        {title || (
          <>
            <span className="text-[#75C043]">Index once.</span>
            <br />
            Search forever.
          </>
        )}
      </h2>
      <p className="text-xl md:text-2xl text-ugle-gray mb-12 font-medium">
        {subtitle || "macOS and Windows. No account required."}
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-6">
        {/* <Link
          href={ctaLink || "/get-early-access"}
          className="inline-flex items-center justify-center bg-[#75C043] hover:bg-[#86d950] text-[#1C1C1C] font-bold py-5 px-12 rounded-2xl shadow-lg transition-transform hover:scale-105 text-xl"
        >
          {ctaText || "Get Early Access"}
        </Link> */}
        <CTAButton title={ctaText} link={ctaLink} />
      </div>
    </div>
  );
}
