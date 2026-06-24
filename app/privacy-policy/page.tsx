import PrivacyPolicy from "@/app/markdown/Privacy Policy.md";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Ugle",
  description:
    "Read the Ugle Privacy Policy. We are committed to protecting your personal information.",
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicy />;
}
