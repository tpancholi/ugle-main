import UseCaseHeader from "@/app/components/usecase/UseCaseHeader";
import UseCaseMain from "@/app/components/usecase/UseCaseMain";
import UseCaseHeroImage from "@/app/components/usecase/UseCaseHeroImage";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { notFound } from "next/navigation";
import GlobalCTA from "@/app/components/GlobalCTA";
import { FAQSection } from "@/app/components/sharedpages/FAQSection";
import AnimatedWorkflowList from "@/app/components/usecase/AnimatedWorkflowList";
import AnimatedPairedWorkflow from "@/app/components/usecase/AnimatedPairedWorkflow";

export function generateStaticParams() {
  return [{ slug: "newsrooms" }, { slug: "podcasts" }, { slug: "journalists" }];
}

const USE_CASE_DATA: Record<
  string,
  {
    title: string;
    badge: string;
    subtitle: string;
    image: { src: string; alt: string };
    content: React.ReactNode;
    ctatitle: string;
    ctasubtitle: string;
    ctaText: string;
  }
> = {
  newsrooms: {
    title: "Find the soundbite. Cut the segment. Hit the deadline.",
    badge: "Newsroom editors",
    subtitle: "Find the soundbite. Cut the segment. Hit the deadline.",
    image: {
      src: "/images/usecases/NewsroomEditor2.png",
      alt: "Ugle in a newsroom — search, clip, export workflow",
    },
    content: (
      <>
        <p className="text-xl md:text-2xl text-ugle-slate font-medium leading-relaxed mb-12">
          The deadline is two hours away. The clip is somewhere in a 90-minute
          interview recorded three weeks ago. You remember the subject discussed
          the contract dispute — but not the timestamp.
        </p>

        <div className="not-prose bg-[#1C1C1C] text-white p-8 md:p-12 rounded-2xl mb-16 shadow-lg">
          <p className="text-xl md:text-2xl font-light leading-relaxed text-white">
            Type{" "}
            <span className="text-[#75C043] font-mono font-bold bg-[#75C043]/10 px-2 py-1 rounded">
              contract dispute
            </span>{" "}
            in Ugle. Every matching moment across every indexed file, returned
            in 30ms. Click to play. Export. Done.
          </p>
        </div>

        <h2 className="text-2xl font-bold mt-16 mb-6 text-ugle-slate">
          Workflow Example
        </h2>
        <div className="not-prose bg-[#F8FAF9] p-8 md:p-10 rounded-2xl border border-ugle-light/60 my-8">
          <AnimatedWorkflowList
            items={[
              "14 clips arrive — total 6 hours of footage.",
              "Drop the folder into Ugle. Indexing starts in the background.",
              "Continue other work. Notification: indexing complete.",
              "Search \u2018planning permission objection\u2019. 4 results across 3 files.",
              "Preview both usable takes in Ugle. Select the cleaner one.",
              "Export as MP3. Send to producer. Deadline met.",
            ]}
          />
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

        <FAQSection
          items={[
            {
              question: "Is it secure for unreleased news footage?",
              answer:
                "Yes. All processing is strictly local. Ugle never uploads audio or video to the cloud, ensuring your unreleased stories and sources remain confidential.",
            },
            {
              question: "How fast can I search an hour of interview?",
              answer:
                "Once indexed, searching takes less than 30 milliseconds regardless of how many hours of footage you have in your library.",
            },
            {
              question: "Does it support broadcast standard formats?",
              answer:
                "Yes. Ugle supports WAV, AIFF, Broadcast WAV, as well as common camera formats like MP4, MOV, and MKV.",
            },
            {
              question: "Can I use it offline?",
              answer:
                "Absolutely. Ugle's transcription models and search engine run entirely on your local machine and require no internet connection after installation.",
            },
          ]}
        />
      </>
    ),
    ctatitle: "Ready to speed up your newsroom?",
    ctasubtitle: "Never lose a quote again. Start searching your archive.",
    ctaText: "Request a demo",
  },
  podcasts: {
    title: "Pull clips from 300 episodes without listening to any of them.",
    badge: "Podcast Producers",
    subtitle: "Pull clips from 300 episodes without listening to any of them.",
    image: {
      src: "/images/usecases/Podcasters.svg",
      alt: "Ugle for podcast producers — search across hundreds of episodes",
    },
    content: (
      <>
        <p className="text-xl md:text-2xl text-ugle-slate font-medium leading-relaxed mb-12">
          Four years of recordings. Three hundred episodes averaging 90 minutes
          each. That&apos;s 450 hours of spoken content. Ugle indexes all of it
          — not the show notes, the spoken words.
        </p>

        <div className="not-prose bg-[#1C1C1C] text-white p-8 md:p-12 rounded-2xl mb-16 shadow-lg">
          <p className="text-xl md:text-2xl font-light leading-relaxed text-white">
            Building a compilation episode on housing policy? Search{" "}
            <span className="text-[#75C043] font-mono font-bold bg-[#75C043]/10 px-2 py-1 rounded">
              rent control
            </span>{" "}
            . 23 results across 18 episodes. Preview, select, export. 22
            minutes. Previously: half a day.
          </p>
        </div>

        <AnimatedPairedWorkflow
          leftTitle="Workflow: Compilation"
          leftItems={[
            "Search \u2018rent control\u2019. 23 results across 18 episodes.",
            "Filter to results over 45 seconds of continuous speech.",
            "Preview 8 candidates. Select 4.",
            "Export as MP3 with timestamps for the editor.",
          ]}
          rightTitle="Workflow: Guest Research"
          rightItems={[
            "Guest returning after 18 months. Search their name.",
            "Previous episode surfaces instantly.",
            "Scan transcript for threads to revisit and topics to avoid in the upcoming interview.",
          ]}
        />

        <FAQSection
          items={[
            {
              question: "Can Ugle handle hundreds of episodes?",
              answer:
                "Yes. Ugle is designed to index and search thousands of hours of audio. The search index is highly optimized, allowing you to search an entire podcast back catalog in milliseconds.",
            },
            {
              question: "Can I export clips with timestamps?",
              answer:
                "Yes. You can preview the search results in context, select the clips you need, and export them. The export will preserve the original quality and include precise timestamp data for your editor.",
            },
            {
              question: "Does it transcribe overlapping speakers well?",
              answer:
                "Ugle's local transcription engine is built on robust AI models that handle conversational audio, including overlapping speakers and varying audio quality, very well.",
            },
            {
              question: "How much storage does the index take?",
              answer:
                "The text index is incredibly small. It typically takes about 2-5% of the original audio file's size.",
            },
          ]}
        />
      </>
    ),
    ctatitle: "Publish episodes faster.",
    ctasubtitle: "Find the exact clip across hundreds of episodes instantly.",
    ctaText: "Get Ugle for Podcasts",
  },
  journalists: {
    title: "A private, searchable archive of every source conversation.",
    badge: "Journalists",
    subtitle: "A private, searchable archive of every source conversation.",
    image: {
      src: "/images/usecases/Journalist.svg",
      alt: "Ugle for journalists — private, local, searchable source archive",
    },
    content: (
      <>
        <p className="text-xl md:text-2xl text-ugle-slate font-medium leading-relaxed mb-12">
          Seven years of source recordings. Every word spoken is retrievable —
          not by filename or date, but by what was actually said. A source
          mentioned a name four months ago. Find it in 30ms.
        </p>

        <div className="not-prose bg-[#1C1C1C] text-white p-8 md:p-12 rounded-2xl mb-16 shadow-lg">
          <p className="text-xl md:text-2xl font-light leading-relaxed text-white">
            Because Ugle runs entirely on-device, source protection is
            architectural. No server to subpoena. No cloud storage to breach.
          </p>
        </div>

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

        <FAQSection
          items={[
            {
              question: "Are my recordings safe from subpoenas against Ugle?",
              answer:
                "Yes. Because Ugle operates entirely on your local device, we possess zero data to turn over. There are no cloud transcripts or remote servers to subpoena.",
            },
            {
              question: "Does Ugle collect any usage telemetry?",
              answer:
                "No. Ugle does not log your search queries, file names, or application activity. Your investigative work remains completely private.",
            },
            {
              question: "Can I use Ugle on an air-gapped machine?",
              answer:
                "Yes. Once the software is installed and the license is activated, you can move your machine entirely offline. The transcription and search functionality will continue to work perfectly.",
            },
            {
              question:
                "What happens if I encrypt the hard drive where my files are stored?",
              answer:
                "Ugle works seamlessly with encrypted drives. You simply unlock the drive through your OS as usual, and Ugle will read the files from their local directory.",
            },
          ]}
        />
      </>
    ),
    ctatitle: "Protect your sources.",
    ctasubtitle: "100% on-device indexing. Complete privacy.",
    ctaText: "Get Early Access",
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
    <>
      <div className="max-w-4xl mx-auto px-6 pt-12">
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

        <UseCaseHeroImage src={useCase.image.src} alt={useCase.image.alt} />

        <UseCaseMain>{useCase.content}</UseCaseMain>
      </div>
      <section className="w-full border-t border-ugle-light/60 bg-[#F8FAF9] py-16 md:py-20">
        <GlobalCTA
          title={useCase.ctatitle}
          subtitle={useCase.ctasubtitle}
          ctaText={useCase.ctaText}
        />
      </section>
    </>
  );
}
