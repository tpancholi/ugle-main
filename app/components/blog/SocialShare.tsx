"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";
import Image from "next/image";

interface Props {
  title: string;
  url: string;
}

export default function SocialShare({ title, url }: Props) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const twitterHref = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: ignore
    }
  };

  return (
    <div className="mt-16 pt-10 border-t border-ugle-light/60">
      <p className="text-[13px] font-mono uppercase tracking-widest text-ugle-gray/60 mb-4">
        Share this post
      </p>
      <div className="flex items-center gap-3">
        {/* Twitter / X */}
        <a
          href={twitterHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on X (Twitter)"
          className="group flex items-center gap-2 px-4 py-2.5 rounded-xl border border-ugle-light/60 bg-white hover:bg-[#1C1C1C] hover:border-[#1C1C1C] text-ugle-slate hover:text-white transition-all duration-200 text-[14px] font-semibold shadow-sm"
        >
          {/* <Check className="w-4 h-4" strokeWidth={2} /> */}
          <Image
            src="/x-logo.svg"
            alt="X Logo"
            width={20}
            height={20}
            className="invert group-hover:invert-0 transition-all duration-200"
          />
          {/* <span>X / Twitter</span> */}
        </a>

        {/* LinkedIn */}
        <a
          href={linkedinHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
          className="group flex items-center gap-2 px-4 py-2.5 rounded-xl border border-ugle-light/60 bg-white hover:bg-[#0A66C2] hover:border-[#0A66C2] text-ugle-slate hover:text-white transition-all duration-200 text-[14px] font-semibold shadow-sm"
        >
          <Image
            src="/linkedin-logo.svg"
            alt="LinkedIn Logo"
            width={20}
            height={20}
            className="group-hover:invert transition-all duration-200"
          />
          {/* <span>LinkedIn</span> */}
        </a>

        {/* Copy link */}
        <button
          onClick={handleCopy}
          aria-label="Copy link to clipboard"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-ugle-light/60 bg-white hover:bg-[#F8FAF9] text-ugle-slate transition-all duration-200 text-[14px] font-semibold shadow-sm cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-[#75C043]" strokeWidth={2.5} />
              <span className="text-[#75C043]">Copied!</span>
            </>
          ) : (
            <>
              <Link2 className="w-4 h-4" strokeWidth={2} />
              <span>Copy link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
