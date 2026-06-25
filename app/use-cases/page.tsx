import React from "react";
import PageHeader from "../components/sharedpages/PageHeader";
import { FileText, Mic2, Newspaper } from "lucide-react";
import Link from "next/link";

const useCaseList = [
  {
    title: "Newsroom editors",
    desc: "Find the soundbite. Cut the segment. Hit the deadline.",
    link: "/use-cases/newsrooms",
    icon: Newspaper,
  },
  {
    title: "Podcast producers",
    desc: "Pull clips from 300 episodes without listening to any of them.",
    link: "/use-cases/podcasts",
    icon: Mic2,
  },
  {
    title: "Journalists",
    desc: "A private, searchable archive of every source conversation.",
    link: "/use-cases/journalists",
    icon: FileText,
  },
];

export default function UseCases() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <PageHeader
        title="Built for the way you work."
        subtitle="Ugle in three real editorial workflows."
      />

      <div className="flex flex-col gap-6 mb-12">
        {useCaseList.map((item, i) => (
          <Link
            key={i}
            href={item.link}
            className="flex flex-col md:flex-row md:items-center justify-between p-8 md:p-12 bg-white border border-ugle-light/60 hover:border-[#75C043] rounded-3xl transition-all group shadow-sm hover:shadow-xl hover:-translate-y-1"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-8 mb-6 md:mb-0">
              <div className="w-16 h-16 bg-[#F8FAF9] text-ugle-slate rounded-2xl flex items-center justify-center group-hover:text-[#75C043] group-hover:bg-[#75C043]/10 transition-colors">
                <item.icon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-ugle-slate mb-2">
                  {item.title}
                </h3>
                <p className="text-ugle-gray text-lg md:text-xl leading-relaxed max-w-xl">
                  {item.desc}
                </p>
              </div>
            </div>
            <div className="text-[#75C043] font-bold text-lg md:text-xl opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all flex items-center gap-2">
              Read workflow{" "}
              <span className="text-2xl leading-none">&rarr;</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
