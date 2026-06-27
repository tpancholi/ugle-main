import TermsofService from "@/app/markdown/Terms of Service.md";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Ugle",
  description:
    "Read the Ugle Terms of Service. Understand your rights and responsibilities when using our software.",
};

export default function TOSPage() {
  return <TermsofService />;
}
