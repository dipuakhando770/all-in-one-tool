import { getDictionary } from "@/lib/dictionary";
import { getPopularTools, allTools } from "@/tools/registry";
import { ToolCard } from "@/components/tool-card";
import type { Locale } from "@/lib/i18n";
import Link from "next/link";
import { Star, ChevronRight, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: `Popular Tools — Nasir Tools`,
    description: `Discover the most popular and frequently used online tools on Nasir Tools for image compression, PDF management, and text conversions.`,
    alternates: {
      canonical: `https://tools.nasirdigitalhub.com/${locale}/popular`,
    },
  };
}

export default async function PopularPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale;
  const dict = await getDictionary(l);
  const popular = getPopularTools();
  const fallback = popular.length >= 8 ? popular : allTools.slice(0, 16);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12 animate-fade-in">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
        <Link href={`/${l}`} className="hover:text-[var(--primary)] transition">Home</Link>
        <ChevronRight size={12} />
        <span className="text-[var(--foreground)]">Popular Tools</span>
      </nav>

      {/* Header */}
      <div className="mx-auto max-w-3xl text-center mb-10">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--warning)] mb-4">
          <Star size={13} fill="currentColor" />
          <span>Top Community Utilities</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl text-[var(--foreground)]">
          {dict.nav.popular}
        </h1>
        <p className="mt-3 text-sm text-[var(--muted-foreground)] md:text-base leading-relaxed">
          The most relied-upon digital tools across our entire platform — chosen for speed, reliability and daily utility.
        </p>
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {fallback.map((t) => (
          <ToolCard key={t.id} tool={t} locale={l} />
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center md:p-12">
        <h2 className="text-xl font-bold md:text-2xl text-[var(--foreground)]">
          Looking for something specific?
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted-foreground)]">
          We have {allTools.length}+ tools across 11 categories ready for instant in-browser use.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href={`/${l}/tools`}
            className="rounded-xl bg-[var(--primary)] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:opacity-90 transition"
          >
            Explore All Tools
          </Link>
          <Link
            href={`/${l}/search`}
            className="rounded-xl border border-[var(--border)] px-5 py-2.5 text-xs font-medium text-[var(--foreground)] hover:bg-[var(--surface-2)] transition"
          >
            Search Tool Index
          </Link>
        </div>
      </div>
    </div>
  );
}
