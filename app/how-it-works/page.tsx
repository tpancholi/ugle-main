import PageHeader from "../components/sharedpages/PageHeader";
import Section from "../components/sharedpages/Section";
import {
  DownloadIcon,
  FolderOpen,
  Laptop,
  PlayCircle,
  Search,
} from "lucide-react";

export default function page() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-24 pb-32">
      <PageHeader
        title="How Ugle works."
        subtitle="One Click to Connect your archive. Build a local index. Search anything inside. Nothing leaves your device."
      />

      <div className="space-y-4">
        <Section title="01. Connect Your Archive" icon={<PlayCircle className="w-6 h-6 text-[#75C043]" />} delay={0.1}>
          <p>
            Connect to any local folder or online drives like -GDrive, OneDrive,
            any other online cloud storage platform. Ugle accepts MP4, MOV, MKV,
            MP3, WAV, M4A, AAC, FLAC, OGG. No file size limit.
          </p>
          <p>
            Ugle reads from the original location and stores only the index.
            Source files stay exactly where they are. Multiple files queue and
            process in order.
          </p>
        </Section>

        <Section title="02. Ugle indexes it" icon={<Laptop className="w-6 h-6 text-[#75C043]" />} delay={0.1}>
          <p>
            The transcription engine runs entirely on-device. No network
            connection required after installation.
          </p>
          <div className="border border-ugle-light/60 rounded-xl overflow-hidden my-8 shadow-sm">
            <table className="w-full text-left text-sm md:text-base">
              <thead className="bg-[#F8FAF9] border-b border-ugle-light/60">
                <tr>
                  <th className="py-4 px-6 font-semibold text-ugle-slate w-1/3">
                    Hardware
                  </th>
                  <th className="py-4 px-6 font-semibold text-ugle-slate">
                    Indexing speed
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ugle-light/40">
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-medium text-ugle-slate border-l-2 border-transparent">
                    Apple M-series
                  </td>
                  <td className="py-4 px-6 text-ugle-gray">
                    ~4 min per hour of audio
                  </td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-medium text-ugle-slate border-l-2 border-transparent">
                    Intel processor
                  </td>
                  <td className="py-4 px-6 text-ugle-gray">
                    ~10 min per hour of audio
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Indexing runs in the background. Ugle notifies you on completion.
            The index stores the full transcript, speaker timestamps, and a
            semantic embedding per passage. Index size: 2–5% of source file
            size.
          </p>
        </Section>

        <Section title="03. Search anything" icon={<Search className="w-6 h-6 text-[#75C043]" />} delay={0.1}>
          <p>
            Open search with{" "}
            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-ugle-slate">
              Cmd+K
            </span>{" "}
            or{" "}
            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-ugle-slate">
              Ctrl+K
            </span>
            . Type a word, phrase, or concept. Ugle returns every matching
            moment across all indexed files, ranked by relevance, with timestamp
            and a three-line excerpt.
          </p>
          <p>
            Results appear in under 30ms. Semantic search is on by default —
            searching <em>&lsquo;housing policy&rsquo;</em> finds passages about{" "}
            <em>rent control</em> or <em>zoning</em>, even if those exact words
            were never spoken.
          </p>
          <p>
            Click any result to jump to that moment in the transcript view. Play
            the clip, copy the transcript, or export the segment.
          </p>
        </Section>

        <Section title="Clip extraction" icon={<DownloadIcon className="w-6 h-6 text-[#75C043]" />} delay={0.1}>
          <ul className="space-y-4 list-none p-0 text-ugle-gray">
            {[
              "Highlight any transcript passage.",
              "Preview the corresponding video or audio segment.",
              "Set in/out points via timeline or transcript selection.",
              "Export as MP4, MP3, or WAV to a folder of your choice.",
            ].map((item, i) => (
              <li key={i} className="flex flex-row items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#75C043] shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 p-4 bg-[#F8FAF9] border-l-4 border-[#75C043] rounded-r-lg text-sm text-ugle-gray font-medium italic">
            Audio-only exports do not re-encode — Ugle extracts directly, making
            export near-instant.
          </div>
        </Section>

        <Section title="The Library" icon={<FolderOpen className="w-6 h-6 text-[#75C043]" />} delay={0.1}>
          <ul className="space-y-4 list-none p-0 text-ugle-gray">
            {[
              "Search across your entire Library from a single query.",
              "Filter by date range, file type, or language.",
              "Add tags and notes for editorial organisation.",
              "Portable — move the folder to an external drive. Ugle reconnects automatically.",
            ].map((item, i) => (
              <li key={i} className="flex flex-row items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#75C043] shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Technical specifications" delay={0.1}>
          <div className="border border-ugle-light/60 rounded-xl overflow-hidden shadow-sm not-prose">
            <table className="w-full text-left bg-[#F8FAF9]">
              <tbody className="divide-y divide-ugle-light/40">
                <tr className="bg-white/50">
                  <td className="py-4 px-6 font-bold text-sm w-1/3 text-ugle-slate uppercase tracking-wider">
                    Spec
                  </td>
                  <td className="py-4 px-6 font-bold text-sm text-ugle-slate uppercase tracking-wider">
                    Detail
                  </td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-medium text-ugle-slate">
                    Input formats
                  </td>
                  <td className="py-4 px-6 text-ugle-gray">
                    MP4, MOV, MKV, MP3, WAV, M4A, AAC, FLAC, OGG
                  </td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-medium text-ugle-slate">
                    Transcription
                  </td>
                  <td className="py-4 px-6 text-ugle-gray">
                    On-device Whisper-based model. No network required after
                    install.
                  </td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-medium text-ugle-slate">
                    Accuracy
                  </td>
                  <td className="py-4 px-6 text-ugle-gray">
                    95% average. Higher on clean single-speaker recordings.
                  </td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-medium text-ugle-slate">
                    Languages
                  </td>
                  <td className="py-4 px-6 text-ugle-gray">
                    90+ including English, Spanish, French, German, Arabic,
                    Hindi, Mandarin, Japanese, Portuguese.
                  </td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-medium text-ugle-slate">
                    Search
                  </td>
                  <td className="py-4 px-6 text-ugle-gray">
                    Keyword + semantic. Both run simultaneously.
                  </td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-medium text-ugle-slate">
                    Search latency
                  </td>
                  <td className="py-4 px-6 text-ugle-gray">
                    &lt; 30ms from keystroke to results.
                  </td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-medium text-ugle-slate">
                    Index storage
                  </td>
                  <td className="py-4 px-6 text-ugle-gray">
                    2–5% of source file size. Local only.
                  </td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors border-l-4 border-[#75C043]">
                  <td className="py-4 px-6 font-medium text-ugle-slate">OS</td>
                  <td className="py-4 px-6 text-ugle-gray">
                    macOS 12+. Windows 10 64-bit+.
                  </td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-medium text-ugle-slate">
                    Minimum hardware
                  </td>
                  <td className="py-4 px-6 text-ugle-gray">
                    8GB RAM. 4GB available storage.
                  </td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-medium text-ugle-slate">
                    Internet
                  </td>
                  <td className="py-4 px-6 text-ugle-gray">
                    Initial download and software updates only.
                  </td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-medium text-ugle-slate">
                    Data sent to Ugle
                  </td>
                  <td className="py-4 px-6 text-ugle-gray">None.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>
      </div>
    </div>
  );
}
