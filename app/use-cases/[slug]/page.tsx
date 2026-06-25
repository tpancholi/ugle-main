import UseCaseHeader from "@/app/components/usecase/UseCaseHeader";
import UseCaseMain from "@/app/components/usecase/UseCaseMain";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return [
    { slug: "newsrooms" },
    { slug: "podcasts" },
    { slug: "journalists" },
  ];
}

const USE_CASE_DATA: Record<
  string,
  { title: string; badge: string; subtitle: string; content: React.ReactNode }
> = {
  newsrooms: {
    title: "Newsroom editors",
    badge: "USE CASE",
    subtitle: "Find the soundbite. Cut the segment. Hit the deadline.",
    content: (
      <>
        <p className="text-xl md:text-2xl text-ugle-slate font-medium leading-relaxed mb-12 -mt-16">
          The deadline is two hours away. The clip is somewhere in a 90-minute
          interview recorded three weeks ago. You remember the subject discussed
          the contract dispute — but not the timestamp.
        </p>

        <p>
          Type <em>&apos;contract dispute&apos;</em> in Ugle. Every matching
          moment across every indexed file, returned in 30ms. Click to play.
          Export. Done.
        </p>

        <h2 className="text-2xl font-bold mt-16 mb-6 text-ugle-slate">
          Workflow Example
        </h2>
        <div className="bg-[#F8FAF9] p-8 md:p-10 rounded-2xl border border-ugle-light/60 my-8">
          <ol className="space-y-6 list-decimal pl-5 text-ugle-slate font-medium marker:text-[#75C043] marker:font-bold">
            <li className="pl-4 pb-4 border-b border-ugle-light/40">
              14 clips arrive — total 6 hours of footage.
            </li>
            <li className="pl-4 pb-4 border-b border-ugle-light/40">
              Drop the folder into Ugle. Indexing starts in the background.
            </li>
            <li className="pl-4 pb-4 border-b border-ugle-light/40">
              Continue other work. Notification: indexing complete.
            </li>
            <li className="pl-4 pb-4 border-b border-ugle-light/40">
              Search &apos;planning permission objection&apos;. 4 results across
              3 files.
            </li>
            <li className="pl-4 pb-4 border-b border-ugle-light/40">
              Preview both usable takes in Ugle. Select the cleaner one.
            </li>
            <li className="pl-4">
              Export as MP3. Send to producer. Deadline met.
            </li>
          </ol>
        </div>

        <h2 className="text-2xl font-bold mt-16 mb-6 text-ugle-slate">
          Every format your newsroom records
        </h2>
        <div className="border border-ugle-light/60 rounded-xl overflow-hidden shadow-sm not-prose">
          <table className="w-full text-left bg-[#F8FAF9]">
            <tbody className="divide-y divide-ugle-light/40">
              <tr className="bg-white/50">
                <td className="py-4 px-6 font-bold text-sm w-1/3 text-ugle-slate uppercase tracking-wider">
                  Format type
                </td>
                <td className="py-4 px-6 font-bold text-sm text-ugle-slate uppercase tracking-wider">
                  Supported
                </td>
              </tr>
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6 font-medium text-ugle-slate">
                  Camera footage
                </td>
                <td className="py-4 px-6 text-ugle-gray">MP4, MOV, MKV</td>
              </tr>
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6 font-medium text-ugle-slate">
                  Broadcast audio
                </td>
                <td className="py-4 px-6 text-ugle-gray">
                  WAV, AIFF, Broadcast WAV
                </td>
              </tr>
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6 font-medium text-ugle-slate">
                  Phone recordings
                </td>
                <td className="py-4 px-6 text-ugle-gray">M4A, AAC, MP3</td>
              </tr>
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6 font-medium text-ugle-slate">
                  Legacy archive
                </td>
                <td className="py-4 px-6 text-ugle-gray">
                  FLAC, OGG, and most common containers
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    ),
  },
  podcasts: {
    title: "Podcast producers",
    badge: "USE CASE",
    subtitle: "Pull clips from 300 episodes without listening to any of them.",
    content: (
      <>
        <p className="text-xl md:text-2xl text-ugle-slate font-medium leading-relaxed mb-12 -mt-16">
          Four years of recordings. Three hundred episodes averaging 90 minutes
          each. That&apos;s 450 hours of spoken content. Ugle indexes all of it
          — not the show notes, the spoken words.
        </p>

        <p>
          Building a compilation episode on housing policy? Search{" "}
          <em>&apos;rent control&apos;</em>. 23 results across 18 episodes.
          Preview, select, export. 22 minutes. Previously: half a day.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16 not-prose">
          <div className="bg-[#F8FAF9] p-8 md:p-10 rounded-2xl border border-ugle-light/60">
            <h2 className="text-xl font-bold mb-6 text-ugle-slate">
              Workflow: Compilation
            </h2>
            <ol className="space-y-4 list-decimal pl-5 text-ugle-slate font-medium marker:text-[#75C043] marker:font-bold">
              <li className="pl-2">
                Search &apos;rent control&apos;. 23 results across 18 episodes.
              </li>
              <li className="pl-2">
                Filter to results over 45 seconds of continuous speech.
              </li>
              <li className="pl-2">Preview 8 candidates. Select 4.</li>
              <li className="pl-2">
                Export as MP3 with timestamps for the editor.
              </li>
            </ol>
          </div>
          <div className="bg-[#F8FAF9] p-8 md:p-10 rounded-2xl border border-ugle-light/60">
            <h2 className="text-xl font-bold mb-6 text-ugle-slate">
              Workflow: Guest Research
            </h2>
            <ol className="space-y-4 list-decimal pl-5 text-ugle-slate font-medium marker:text-[#75C043] marker:font-bold">
              <li className="pl-2">
                Guest returning after 18 months. Search their name.
              </li>
              <li className="pl-2">Previous episode surfaces instantly.</li>
              <li className="pl-2">
                Scan transcript for threads to revisit and topics to avoid in
                the upcoming interview.
              </li>
            </ol>
          </div>
        </div>
      </>
    ),
  },
  journalists: {
    title: "Journalists",
    badge: "USE CASE",
    subtitle: "A private, searchable archive of every source conversation.",
    content: (
      <>
        <p className="text-xl md:text-2xl text-ugle-slate font-medium leading-relaxed mb-12 -mt-16">
          Seven years of source recordings. Every word spoken is retrievable —
          not by filename or date, but by what was actually said. A source
          mentioned a name four months ago. Find it in 30ms.
        </p>

        <p>
          Because Ugle runs entirely on-device, source protection is
          architectural. No server to subpoena. No cloud storage to breach.
        </p>

        <h2 className="text-2xl font-bold mt-16 mb-6 text-ugle-slate">
          Technical reality
        </h2>
        <div className="border border-ugle-light/60 rounded-xl overflow-hidden shadow-sm not-prose">
          <table className="w-full text-left bg-[#F8FAF9]">
            <tbody className="divide-y divide-ugle-light/40">
              <tr className="bg-white/50">
                <td className="py-4 px-6 font-bold text-sm w-1/3 text-ugle-slate uppercase tracking-wider">
                  Claim
                </td>
                <td className="py-4 px-6 font-bold text-sm text-ugle-slate uppercase tracking-wider">
                  Technical reality
                </td>
              </tr>
              <tr className="hover:bg-gray-50/50 transition-colors border-l-4 border-transparent">
                <td className="py-4 px-6 font-medium text-ugle-slate">
                  No uploads
                </td>
                <td className="py-4 px-6 text-ugle-gray">
                  Transcription runs on a local model. Audio never leaves your
                  machine.
                </td>
              </tr>
              <tr className="hover:bg-gray-50/50 transition-colors border-l-4 border-transparent">
                <td className="py-4 px-6 font-medium text-ugle-slate">
                  No cloud storage
                </td>
                <td className="py-4 px-6 text-ugle-gray">
                  The index is a local file on your drive. You control it.
                </td>
              </tr>
              <tr className="hover:bg-gray-50/50 transition-colors border-l-4 border-transparent">
                <td className="py-4 px-6 font-medium text-ugle-slate">
                  No accounts
                </td>
                <td className="py-4 px-6 text-ugle-gray">
                  No Ugle account linked to your files.
                </td>
              </tr>
              <tr className="hover:bg-gray-50/50 transition-colors border-l-4 border-transparent">
                <td className="py-4 px-6 font-medium text-ugle-slate">
                  No content telemetry
                </td>
                <td className="py-4 px-6 text-ugle-gray">
                  Ugle does not log search queries or file activity.
                </td>
              </tr>
              <tr className="hover:bg-gray-50/50 transition-colors border-l-4 border-[#75C043] bg-white">
                <td className="py-4 px-6 font-bold text-ugle-slate">
                  Portable
                </td>
                <td className="py-4 px-6 text-ugle-gray font-medium">
                  Library folder moves to an encrypted external drive. Ugle
                  reconnects.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    ),
  },
};

export default async function UseCasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const useCase = USE_CASE_DATA[slug];

  if (!useCase) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-24 pb-32">
      <Link
        href="/use-cases"
        className="inline-flex items-center text-sm font-semibold text-ugle-gray hover:text-[#75C043] transition-colors mb-12"
      >
        <ArrowRight className="w-4 h-4 mr-2 rotate-180" /> Back to Use Cases
      </Link>
      <UseCaseHeader
        badge={useCase.badge}
        title={useCase.title}
        subtitle={useCase.subtitle}
      />

      <UseCaseMain>{useCase.content}</UseCaseMain>
    </div>
  );
}
