import Link from "next/link";
import React from "react";

export default function CTAButton({
  type = "primary",
  link = "/download",
}: {
  type?: string;
  link?: string;
}) {
  return (
    <Link
      href={link}
      className="bg-ugle-green hover:bg-[#86d950] transition-colors text-[#1C1C1C] font-bold py-4 px-10 rounded-xl shadow-lg hover:shadow-xl text-lg text-center flex items-center justify-center gap-3 w-full sm:w-auto"
    >
      Get Early Access
    </Link>
  );
}
