import type { Metadata } from "next";
import GetAccessHero from "../components/getaccess/GetAccessHero";
import GetAccessForm from "../components/getaccess/GetAccessForm";

export const metadata: Metadata = {
  title: "Request Trial",
  description:
    "Apply for early access to Ugle. Experience local-first, lightning-fast audio and video search on your own machine.",
  openGraph: {
    title: "Request Trial",
    description:
      "Apply for early access to Ugle. Experience local-first, lightning-fast audio and video search on your own machine.",
    url: "/request-trial",
  },
};

export default function GetEarlyAccess() {
  return (
    <div className="bg-[#F8FAF9] min-h-[80vh] pt-8 md:pt-12 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <GetAccessHero />

        <GetAccessForm />
      </div>
    </div>
  );
}
