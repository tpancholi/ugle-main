import React from "react";

export default function MarkdownLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-16 sm:px-8 lg:px-12">
      <div
        className="prose prose-lg max-w-none text-ugle-gray
          prose-headings:text-ugle-slate prose-headings:font-bold prose-headings:tracking-tight
          prose-h1:text-4xl prose-h1:md:text-5xl prose-h1:font-bold prose-h1:mb-10
          prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:font-bold prose-h2:mt-16 prose-h2:mb-6
          prose-h3:text-xl prose-h3:font-bold prose-h3:mt-10 prose-h3:mb-4
          prose-p:text-ugle-gray prose-p:leading-[1.65] prose-p:mb-6
          prose-li:text-ugle-gray prose-li:mb-2.5 prose-li:leading-relaxed
          prose-strong:text-ugle-slate
          prose-a:text-[#75C043] prose-a:font-semibold hover:prose-a:underline
          prose-ol:marker:text-[#75C043] prose-ol:marker:font-mono prose-ol:marker:font-bold
          prose-ul:marker:text-[#75C043]"
      >
        {children}
      </div>
    </main>
  );
}
