import Link from "next/link";

export default function HowItWorks() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-20">
          <div className="font-mono text-xs md:text-[13px] tracking-[0.14em] uppercase text-[#5DA233] font-medium mb-4">
            How it works
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-snug text-ugle-slate mb-6">
            <span className="text-ugle-green">One Click to Connect</span> your
            archive. Build a local index. Search anything inside. Nothing leaves
            your device.
          </h2>
        </div>

        <div className="space-y-16">
          {[
            {
              step: "01",
              action: "Connect Your Archive",
              desc: "Connect to any local folder or online drives like -GDrive, OneDrive, any other online cloud storage platform. Ugle accepts MP4, MOV, MKV, MP3, WAV, M4A, AAC, FLAC, OGG. No file size limit.\n\nUgle reads from the original location and stores only the index. Source files stay exactly where they are. Multiple files queue and process in order.",
            },
            {
              step: "02",
              action: "Ugle indexes it",
              desc: "Speech is transcribed on-device. The index builds locally.",
            },
            {
              step: "03",
              action: "Search anything",
              desc: "Type a word, phrase, or concept. Every matching moment is returned with a timestamp.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row md:items-start gap-4 md:gap-12 group"
            >
              <div className="font-mono text-5xl font-bold text-ugle-light group-hover:text-[#75C043] transition-colors">
                {item.step}
              </div>
              <div className="flex-1 md:pt-2">
                <h3 className="text-3xl font-bold text-ugle-slate mb-4">
                  {item.action}
                </h3>
                <p className="text-xl md:text-2xl text-ugle-gray leading-relaxed max-w-3xl whitespace-pre-line">
                  {item.desc}
                </p>
                {i === 1 && (
                  <div className="mt-4 font-mono text-xs md:text-[12.5px] text-ugle-gray bg-[#F8FAF9] border border-ugle-light/60 rounded-lg py-2 px-3 inline-block">
                    ~4 min per hour of audio on Apple M-series
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 pt-10 border-t border-ugle-light/40">
          <Link
            href="/how-it-works"
            className="inline-flex items-center text-[#75C043] font-bold text-xl hover:text-[#86d950] transition-colors gap-3"
          >
            Full workflow, including clip extraction{" "}
            <span className="text-2xl leading-none">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
