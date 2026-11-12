import { getDictionary } from "@/lib/dictionary";
import { getPopularTools, getTrendingTools, allTools } from "@/tools/registry";
import { ToolCard } from "@/components/tool-card";
import type { Locale } from "@/lib/i18n";
import Link from "next/link";
import { Star, ChevronRight, ArrowRight, Search } from "lucide-react";
import type { Metadata } from "next";
import { pageAlternates, pageOpenGraph, pick } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  const title = pick(l, "Popular Tools", "জনপ্রিয় টুল");
  const description = pick(
    l,
    "Discover the most-used free online tools on Nasir Tools — image compression, PDF management, text conversion and everyday developer utilities.",
    "নাসির টুলসের সবচেয়ে বেশি ব্যবহৃত ফ্রি অনলাইন টুল — ছবি কম্প্রেশন, PDF ম্যানেজমেন্ট, টেক্সট কনভার্শন ও ডেভেলপার ইউটিলিটি।"
  );

  return {
    title,
    description,
    alternates: pageAlternates(l, "/popular"),
    openGraph: pageOpenGraph({ locale: l, path: "/popular", title, description }),
  };
}

function dedupe<T extends { slug: string }>(lists: T[][]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const list of lists) {
    for (const item of list) {
      if (!seen.has(item.slug)) {
        seen.add(item.slug);
        out.push(item);
      }
    }
  }
  return out;
}

export default async function PopularPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale;
  const dict = await getDictionary(l);

  const tools = dedupe([
    getPopularTools(),
    getTrendingTools(12),
    allTools.filter((t) => t.popular),
  ]).slice(0, 24);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      {/* Breadcrumbs */}
      <nav
        className="mb-6 flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]"
        aria-label={pick(l, "Breadcrumb", "ব্রেডক্রাম্ব")}
      >
        <Link href={`/${l}`} className="transition-colors hover:text-[var(--primary)]">
          {dict.ui.home}
        </Link>
        <ChevronRight size={12} aria-hidden="true" />
        <span className="text-[var(--foreground)]">{dict.nav.popular}</span>
      </nav>

      {/* Header */}
      <div className="mx-auto mb-10 max-w-3xl text-center">
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--warning)]">
          <Star size={13} fill="currentColor" aria-hidden="true" />
          <span>{pick(l, "Most-used essentials", "সবচেয়ে বেশি ব্যবহৃত")}</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] md:text-5xl">
          {dict.nav.popular}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)] md:text-base">
          {pick(
            l,
            "The tools people reach for most — chosen for speed, reliability and daily utility.",
            "সবচেয়ে বেশি ব্যবহৃত টুল — দ্রুততা, নির্ভরযোগ্যতা ও দৈনন্দিন কাজের সুবিধার জন্য বাছাই করা।"
          )}
        </p>
      </div>

      {/* Grid */}
      {tools.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tools.map((t) => (
            <ToolCard key={t.id} tool={t} locale={l} />
          ))}
        </div>
      ) : (
        <p className="py-16 text-center text-sm text-[var(--muted-foreground)]">
          {dict.common.noResults}
        </p>
      )}

      {/* Bottom CTA */}
      <div className="mt-14 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center md:p-12">
        <h2 className="text-xl font-bold text-[var(--foreground)] md:text-2xl">
          {pick(l, "Looking for something specific?", "কিছু নির্দিষ্ট খুঁজছেন?")}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[var(--muted-foreground)]">
          {pick(
            l,
            `${allTools.length} tools are ready to use instantly in your browser.`,
            `${allTools.length}টি টুল আপনার ব্রাউজারেই তাৎক্ষণিক ব্যবহারের জন্য প্রস্তুত।`
          )}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link
            href={`/${l}/tools`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-xs font-semibold text-[var(--primary-foreground)] transition-colors hover:bg-[var(--primary-hover)]"
          >
            {dict.ui.browseAllTools}
            <ArrowRight size={13} aria-hidden="true" />
          </Link>
          <Link
            href={`/${l}/search`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] px-5 py-2.5 text-xs font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--surface-2)]"
          >
            <Search size={13} aria-hidden="true" />
            {dict.ui.searchTools}
          </Link>
        </div>
      </div>
    </div>
  );
}
