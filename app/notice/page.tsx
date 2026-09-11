import Notice from "@/app/markdown/NOTICE.md";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Third-Party & Open Source Notices",
  description:
    "Read the third-party software, open-source components, and machine-learning model notices for Ugle.",
};

export default function NoticePage() {
  return <Notice />;
}
