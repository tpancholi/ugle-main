import React from "react";

export default function NoticeLayout({
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
          prose-ul:marker:text-[#75C043]
          prose-table:w-full prose-table:my-8 prose-table:text-sm prose-table:border-collapse
          prose-th:bg-neutral-100 prose-th:p-3 prose-th:text-left prose-th:font-semibold prose-th:text-ugle-slate prose-th:border prose-th:border-neutral-200
          prose-td:p-3 prose-td:border prose-td:border-neutral-200 prose-td:align-top
          prose-code:text-xs prose-code:font-mono prose-code:bg-neutral-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-ugle-slate prose-code:before:content-none prose-code:after:content-none"
      >
        <div className="overflow-x-auto">{children}</div>
      </div>
    </main>
  );
}
