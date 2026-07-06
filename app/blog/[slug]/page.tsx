import React from "react";
import BlogPost from "@/app/components/blog/BlogPost";
import SocialShare from "@/app/components/blog/SocialShare";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import GlobalCTA from "@/app/components/GlobalCTA";

const BLOG_POST_DATA: Record<
  string,
  {
    title: string;
    meta: string;
    tag: string;
    image: string;
    content: React.ReactNode;
  }
> = {
  "why-local-first": {
    title: "Why we built Ugle local-first",
    meta: "4 min read",
    tag: "Product philosophy",
    image: "/images/blogs/Why we built Ugle local-first.svg",
    content: (
      <>
        <p className="text-[20px] text-ugle-gray leading-[1.55] mb-8">
          The first version of what became Ugle uploaded files to a server. We
          built it that way because it was easier — existing transcription APIs,
          no on-device model to maintain, faster to ship.
        </p>
        <p>
          We showed it to an investigative journalist we respect. She looked at
          the interface and said, without hesitating:
        </p>
        <blockquote>&ldquo;Where does the audio go?&rdquo;</blockquote>
        <p>We told her. She closed the laptop.</p>
        <p>
          That was the answer. Not the architecture decision — the moment before
          it. The fact that the first question a professional journalist asked
          about a tool for her source recordings was about data location told us
          everything about what kind of tool this needed to be.
        </p>
        <p>
          The cloud version worked. Fast, accurate, reasonably priced. It also
          required trust we had no right to ask for — trust that the server was
          secure, that data was not being used to train models, that a legal
          demand would not reveal a source. Not unreasonable conditions for a
          transcription tool. Unreasonable conditions for a journalism tool.
        </p>
        <p>
          On-device transcription was technically harder. Larger models. Tighter
          engineering constraints. We wrote a custom inference pipeline, managed
          model distribution, and solved for hardware variation across consumer
          machines.
        </p>
        <p>
          Worth it. Not because local-first is a feature. Because for the
          workflows Ugle is built for, it is the only architecture that respects
          the user&apos;s actual situation.
        </p>

        <div className="not-prose mt-14 p-10 bg-[#3A3A3A] text-white rounded-2xl text-center shadow-lg">
          <h3 className="text-[22px] font-bold mb-2 text-white mt-0 border-0">
            Index once. Search forever.
          </h3>
          <p className="text-[#c3c5cd] text-[17px] mb-0! max-w-md mx-auto">
            Your archive never leaves your machine.
          </p>
        </div>
      </>
    ),
  },
  "cost-of-scrubbing-timelines": {
    title: "The real cost of scrubbing timelines",
    meta: "3 min read",
    tag: "Workflow",
    image: "/images/blogs/The real cost of scrubbing timelines.svg",
    content: (
      <>
        <p className="text-[20px] text-ugle-gray leading-[1.55] mb-8">
          A documentary editor we spoke to last year spends six to ten hours a
          week scrubbing through footage to find moments she already knows
          exist.
        </p>
        <p>
          She has watched most of it once. She cannot remember timestamps. She
          scrubs to the rough third of a clip where a subject seemed agitated,
          plays from there, rewinds, tries again.
        </p>
        <p>
          This is not unusual. It is the default workflow for anyone who works
          with recorded media and has more footage than they can hold in active
          memory. Which is everyone.
        </p>
        <p>
          The problem is not a lack of tools. There are transcription tools.
          Annotation tools. Summary tools. None of them make the archive
          searchable the way a text document is searchable.
        </p>
        <p>
          When you open a 15,000-word transcript and press Cmd+F, you find every
          instance of a word in under a second. The entire document is equally
          accessible. No part is harder to retrieve than any other.
        </p>
        <p>
          That is what Ugle does for recorded media. Once indexed, a recording
          becomes as findable as a text file. Type what you are looking for. 30
          milliseconds.
        </p>
        <div className="mt-12 p-8 bg-[#F7F7F5] rounded-xl border border-ugle-light/60">
          <p className="text-[18px] font-bold text-ugle-slate m-0! line-height-[1.5]">
            The editor we mentioned still uses a timeline. She does not have to
            scrub it anymore.
          </p>
        </div>
      </>
    ),
  },
  "what-transcription-accuracy-means": {
    title: "What 95% transcription accuracy actually means",
    meta: "5 min read",
    tag: "Product",
    image: "/images/blogs/What transcription accuracy actually means.svg",
    content: (
      <>
        <p className="text-[20px] text-ugle-gray leading-[1.55] mb-8">
          We say 95% accuracy. That number is word error rate measured against
          manually transcribed ground truth across languages, accents, recording
          conditions, and speaker types.
        </p>
        <p>
          In practice: in a 1,000-word recording, approximately 50 words will be
          wrong. Errors cluster around proper nouns, field-specific terminology,
          heavy regional accents, and poor audio quality.
        </p>
        <p>
          For search, this matters less than it sounds. You are searching{" "}
          <em>&apos;rent control&rsquo;</em>, not{" "}
          <em>&lsquo;Councillor Singh&rsquo;</em>. The model is unlikely to miss{" "}
          <em>&lsquo;rent control&rsquo;</em> in a clean recording.
        </p>
        <p>
          For verbatim quotation, always verify against the source. Ugle makes
          this fast — click any result and the audio plays from that timestamp.
        </p>

        <div className="my-14 border border-ugle-light/60 rounded-[14px] overflow-hidden not-prose shadow-sm">
          <table className="w-full text-left text-[15px] border-collapse bg-white">
            <thead>
              <tr className="bg-[#3A3A3A] text-white">
                <th className="py-3 px-5 font-semibold font-sans w-2/3">
                  Condition
                </th>
                <th className="py-3 px-5 font-semibold font-sans">Accuracy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ugle-light/40">
              <tr className="hover:bg-[#F7F7F5] transition-colors border-l-4 border-l-[#75C043]">
                <td className="py-3.5 px-5 font-medium text-ugle-slate">
                  Studio-quality, single speaker
                </td>
                <td className="py-3.5 px-5 text-ugle-slate font-mono text-[13.5px]">
                  97–99%
                </td>
              </tr>
              <tr className="bg-[#F7F7F5] border-l-4 border-l-emerald-500">
                <td className="py-3.5 px-5 font-medium text-ugle-slate">
                  Standard broadcast audio
                </td>
                <td className="py-3.5 px-5 text-ugle-slate font-mono text-[13.5px]">
                  95–97%
                </td>
              </tr>
              <tr className="hover:bg-[#F7F7F5] transition-colors border-l-4 border-l-yellow-400">
                <td className="py-3.5 px-5 font-medium text-ugle-slate">
                  Video conference, single speaker
                </td>
                <td className="py-3.5 px-5 text-ugle-slate font-mono text-[13.5px]">
                  94–96%
                </td>
              </tr>
              <tr className="bg-[#F7F7F5] border-l-4 border-l-orange-400">
                <td className="py-3.5 px-5 font-medium text-ugle-slate">
                  Phone recording
                </td>
                <td className="py-3.5 px-5 text-ugle-slate font-mono text-[13.5px]">
                  85–88%
                </td>
              </tr>
              <tr className="hover:bg-[#F7F7F5] transition-colors border-l-4 border-l-orange-500">
                <td className="py-3.5 px-5 font-medium text-ugle-slate">
                  Multiple overlapping speakers
                </td>
                <td className="py-3.5 px-5 text-ugle-slate font-mono text-[13.5px]">
                  80–88%
                </td>
              </tr>
              <tr className="bg-[#F7F7F5] border-l-4 border-l-red-500">
                <td className="py-3.5 px-5 font-medium text-ugle-slate">
                  Consistent background noise (&gt;60dB)
                </td>
                <td className="py-3.5 px-5 text-ugle-slate font-mono text-[13.5px]">
                  75–85%
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-5.5 bg-[#F7F7F5] rounded-xl border border-ugle-light/60">
          <p className="text-[14.5px] font-mono text-ugle-gray m-0 leading-relaxed font-medium">
            We benchmark every model update against the same test set. If
            accuracy drops, we do not ship. The 95% figure is a floor, not an
            aspiration.
          </p>
        </div>
      </>
    ),
  },
  "languages-supported": {
    title: "The 90+ Languages Supported by Ugle",
    meta: "4 min read",
    tag: "Product",
    image: "/images/blogs/The 90+ Languages Supported by Ugle.png",
    content: (
      <>
        <p className="text-[20px] text-ugle-gray leading-[1.55] mb-8">
          A search tool is only as useful as the language it can index. From the
          start, we designed Ugle&apos;s local-first engine to recognize more
          than just English. By utilizing highly optimized transcription models,
          Ugle can handle over 90 languages right on your machine.
        </p>
        <p>
          Whether you are transcribing an interview in Spanish, analyzing a
          podcast in Japanese, or archiving historical footage in Welsh, Ugle
          extracts the text securely without ever sending a byte to the cloud.
        </p>

        <div className="not-prose my-10 p-8 md:p-10 rounded-2xl bg-[#1C1C1C] text-white flex flex-col sm:flex-row items-center gap-6 shadow-lg">
          <div className="text-center sm:text-left shrink-0">
            <p className="text-[52px] font-extrabold text-[#75C043] leading-none tracking-tight">
              90+
            </p>
            <p className="text-[14px] font-mono text-white/60 uppercase tracking-widest mt-1">
              Languages
            </p>
          </div>
          <div className="w-px self-stretch bg-white/10 hidden sm:block" />
          <p className="text-[17px] text-white/80 leading-relaxed font-light">
            Every language is processed on-device at the same speed and quality.
            No internet required. No per-language pricing.
          </p>
        </div>

        <h2>Fully Supported Languages</h2>
        <p>
          Below is the complete list of languages our transcription model
          supports. This coverage allows international newsrooms and global
          research teams to rely on one tool for their entire archive.
        </p>

        <div className="not-prose my-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {[
            "English",
            "Chinese",
            "German",
            "Spanish",
            "Russian",
            "Korean",
            "French",
            "Japanese",
            "Portuguese",
            "Turkish",
            "Polish",
            "Catalan",
            "Dutch",
            "Arabic",
            "Swedish",
            "Italian",
            "Indonesian",
            "Hindi",
            "Finnish",
            "Vietnamese",
            "Hebrew",
            "Ukrainian",
            "Greek",
            "Malay",
            "Czech",
            "Romanian",
            "Danish",
            "Hungarian",
            "Tamil",
            "Norwegian",
            "Thai",
            "Urdu",
            "Croatian",
            "Bulgarian",
            "Lithuanian",
            "Latin",
            "Māori",
            "Malayalam",
            "Welsh",
            "Slovak",
            "Telugu",
            "Persian",
            "Latvian",
            "Bengali",
            "Serbian",
            "Azerbaijani",
            "Slovenian",
            "Kannada",
            "Estonian",
            "Macedonian",
            "Breton",
            "Basque",
            "Icelandic",
            "Armenian",
            "Nepali",
            "Mongolian",
            "Bosnian",
            "Kazakh",
            "Albanian",
            "Swahili",
            "Galician",
            "Marathi",
            "Panjabi",
            "Sinhala",
            "Khmer",
            "Shona",
            "Yoruba",
            "Somali",
            "Afrikaans",
            "Occitan",
            "Georgian",
            "Belarusian",
            "Tajik",
            "Sindhi",
            "Gujarati",
            "Amharic",
            "Yiddish",
            "Lao",
            "Uzbek",
            "Faroese",
            "Haitian",
            "Pashto",
            "Turkmen",
            "Norwegian Nynorsk",
            "Maltese",
            "Sanskrit",
            "Luxembourgish",
            "Burmese",
            "Tibetan",
            "Tagalog",
            "Malagasy",
            "Assamese",
            "Tatar",
            "Hawaiian",
            "Lingala",
            "Hausa",
            "Bashkir",
            "jw",
            "Sundanese",
          ].map((lang) => (
            <span
              key={lang}
              className="inline-flex items-center px-3 py-2 rounded-lg bg-[#F0F4EE] border border-[#75C043]/20 text-[13.5px] font-medium text-ugle-slate hover:bg-[#75C043]/10 transition-colors"
            >
              {lang}
            </span>
          ))}
        </div>

        <p>
          As our models improve, this list will grow. And because the models run
          locally, you will never be charged a premium for transcribing less
          common languages.
        </p>

        <div className="not-prose mt-14 p-10 bg-[#3A3A3A] text-white rounded-2xl text-center shadow-lg">
          <h3 className="text-[22px] font-bold mb-2 text-white">
            A truly global archive.
          </h3>
          <p className="text-[#c3c5cd] text-[17px] mb-0 max-w-md mx-auto">
            No language packs to download. No internet required.
          </p>
        </div>
      </>
    ),
  },
};

export function generateStaticParams() {
  return Object.keys(BLOG_POST_DATA).map((slug) => ({
    slug,
  }));
}

export default async function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blogPost = BLOG_POST_DATA[slug];

  if (!blogPost) {
    notFound();
  }

  return (
    <>
      <div className="max-w-3xl mx-auto px-6 py-20 pb-32">
        <Link
          href="/blog"
          className="inline-flex items-center text-[15px] font-semibold text-ugle-gray hover:text-[#5DA233] transition-colors mb-12"
        >
          <ArrowRight className="w-4 h-4 mr-2 rotate-180" strokeWidth={2.5} />{" "}
          Back to Blog
        </Link>
        <div className="text-[13px] font-mono text-ugle-gray mb-3 flex items-center gap-2">
          <span className="inline-block bg-[#75C043]/10 text-[#5DA233] text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
            {blogPost.tag}
          </span>
          <span>{blogPost.meta}</span>
        </div>
        <h1 className="text-[36px] md:text-[46px] font-extrabold tracking-[-0.02em] mb-10 text-ugle-slate leading-[1.1]">
          {blogPost.title}
        </h1>

        {/* Hero image */}
        <div className="relative w-full rounded-2xl overflow-hidden border border-ugle-light/60 shadow-sm mb-14 aspect-video bg-[#F0F2F0]">
          <Image
            src={blogPost.image}
            alt={blogPost.title}
            fill
            className="object-cover object-top"
            priority
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>

        <BlogPost>{blogPost.content}</BlogPost>

        <SocialShare
          title={blogPost.title}
          url={`https://ugle.app/blog/${slug}`}
        />
      </div>
      <section className="w-full border-t border-ugle-light/60 bg-[#F8FAF9] py-16 md:py-20">
        <GlobalCTA
          title="Take control of your media."
          subtitle="Join the early access program and see for yourself."
        />
      </section>
    </>
  );
}
