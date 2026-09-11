import Eula from "@/app/markdown/EULA.md";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "End User Licence Agreement",
  description:
    "Read the Ugle End User Licence Agreement. Understand your rights and responsibilities when using our software.",
};

export default function TOSPage() {
  return <Eula />;
}
