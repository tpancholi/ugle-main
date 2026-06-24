export default function Problem() {
  return (
    <section className="bg-[#1C1C1C] py-24 md:py-32 text-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-16">
          <div className="font-mono text-xs md:text-[13px] tracking-[0.14em] uppercase text-[#75C043] font-medium mb-4">
            The problem
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            You have the footage. You can&apos;t find the moment.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-12 text-left">
          <div>
            <div className="w-12 h-1 bg-[#75C043] mb-6"></div>
            <h3 className="font-bold text-2xl md:text-3xl mb-4">
              Scrubbing tape is a deadline tax.
            </h3>
            <p className="text-white/70 text-lg leading-relaxed">
              Scrubbing three hours of tape to find a 40-second soundbite is not
              a workflow. It&apos;s time you don&apos;t have before the segment
              closes.
            </p>
          </div>
          <div>
            <div className="w-12 h-1 bg-[#75C043] mb-6"></div>
            <h3 className="font-bold text-2xl md:text-3xl mb-4">
              Cloud tools want your files.
            </h3>
            <p className="text-white/70 text-lg leading-relaxed">
              Source recordings are sensitive. The right search tool should not
              require handing them to a server you don&apos;t control.
            </p>
          </div>
          <div>
            <div className="w-12 h-1 bg-[#75C043] mb-6"></div>
            <h3 className="font-bold text-2xl md:text-3xl mb-4">
              Your archive grows. Search doesn&apos;t.
            </h3>
            <p className="text-white/70 text-lg leading-relaxed">
              Five years of recordings. Hundreds of files. No way to search
              across them by what was actually said. Until now.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
