import Link from "next/link";
import React from "react";

export default function CTAButton({
  type = "primary",
  link = "/download",
  title,
}: {
  type?: string;
  link?: string;
  title?: string;
}) {
  return (
    <Link
      href={link}
      className="bg-ugle-green hover:bg-[#86d950] transition-colors text-white font-bold py-4 px-10 rounded-xl shadow-lg hover:shadow-xl text-lg text-center flex items-center justify-center gap-3 w-full sm:w-auto"
    >
      {title || "Get Early Access"}
    </Link>
  );
}
