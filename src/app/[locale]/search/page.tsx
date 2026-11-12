import { Suspense } from "react";
import { SearchClient } from "./search-client";
import type { Locale } from "@/lib/i18n";
import { allTools } from "@/tools/registry";
import { buildToolIndex } from "@/lib/tool-discovery";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isBn = locale === "bn";
  const base = "https://tools.nasirdigitalhub.com";
  return {
    title: isBn ? "টুল খুঁজুন — নাসির টুলস" : "Search Tools — Nasir Tools",
    description: isBn
      ? `ইমেজ, PDF, টেক্সট, কোড ও ক্যালকুলেটর — ${allTools.length}+ ফ্রি অনলাইন টুলের মধ্যে খুঁজুন।`
      : `Search ${allTools.length}+ free online tools for images, PDFs, text, code, SEO and calculations.`,
    alternates: {
      canonical: `${base}/${locale}/search`,
      languages: {
        en: `${base}/en/search`,
        bn: `${base}/bn/search`,
        "x-default": `${base}/en/search`,
      },
    },
    robots: { index: false, follow: true },
  };
}

export default function SearchPage({ params }: { params: Promise<{ locale: string }> }) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
          <div className="skeleton h-10 w-64" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-40 rounded-xl" />
            ))}
          </div>
        </div>
      }
    >
      <SearchClientWrapper params={params} />
    </Suspense>
  );
}

async function SearchClientWrapper({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tools = buildToolIndex(allTools);
  return <SearchClient locale={locale as Locale} tools={tools} />;
}
