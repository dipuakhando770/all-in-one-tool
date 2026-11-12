import { getDictionary } from "@/lib/dictionary";
import { categories } from "@/lib/categories";
import { allTools } from "@/tools/registry";
import type { Locale } from "@/lib/i18n";
import Link from "next/link";
import {
  Sparkles,
  Layers,
  ArrowRight,
  ChevronRight,
  Image as ImageIcon,
  FileText,
  Code,
  Calculator,
  Type,
  Search,
  Share2,
  Database,
  Globe,
  Folder,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import { pageAlternates, pageOpenGraph, pick } from "@/lib/seo";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  const title = pick(l, "Browse Categories", "ক্যাটাগরি ব্রাউজ করুন");
  const description = pick(
    l,
    `Explore ${categories.length} curated categories of online tools for images, PDFs, developer utilities, calculators and more.`,
    `ছবি, PDF, ডেভেলপার ইউটিলিটি, ক্যালকুলেটর ও আরও অনেক কিছুর ${categories.length}টি ক্যাটাগরি ব্রাউজ করুন।`
  );

  return {
    title,
    description,
    alternates: pageAlternates(l, "/categories"),
    openGraph: pageOpenGraph({ locale: l, path: "/categories", title, description }),
  };
}

const categoryIcons: Record<string, LucideIcon> = {
  image: ImageIcon,
  pdf: FileText,
  developer: Code,
  calculator: Calculator,
  text: Type,
  seo: Search,
  social: Share2,
  ai: Sparkles,
  data: Database,
  web: Globe,
  file: Folder,
};

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale;
  const dict = await getDictionary(l);
  const visibleCategories = categories.filter((c) =>
    allTools.some((t) => t.category === c.slug)
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      <nav
        className="mb-6 flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]"
        aria-label={pick(l, "Breadcrumb", "ব্রেডক্রাম্ব")}
      >
        <Link href={`/${l}`} className="transition-colors hover:text-[var(--primary)]">
          {dict.ui.home}
        </Link>
        <ChevronRight size={12} aria-hidden="true" />
        <span className="text-[var(--foreground)]">{dict.nav.categories}</span>
      </nav>

      {/* Header */}
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--muted-foreground)]">
          <Layers size={13} className="text-[var(--primary)]" aria-hidden="true" />
          <span>
            {visibleCategories.length} {pick(l, "curated categories", "নির্বাচিত ক্যাটাগরি")}
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] md:text-5xl">
          {dict.nav.categories}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)] md:text-base">
          {pick(
            l,
            "Navigate the complete toolkit, organized by workflow, media type and functional need.",
            "কাজের ধরন, মিডিয়া ও প্রয়োজন অনুযায়ী সাজানো সম্পূর্ণ টুলকিট ব্রাউজ করুন।"
          )}
        </p>
      </div>

      {/* Categories grid */}
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visibleCategories.map((c) => {
          const Icon = categoryIcons[c.slug] || Sparkles;
          const categoryTools = allTools.filter((t) => t.category === c.slug);
          const popularExamples = categoryTools.filter((t) => t.popular).slice(0, 3);
          const examples = popularExamples.length > 0 ? popularExamples : categoryTools.slice(0, 3);

          return (
            <div
              key={c.slug}
              className="group flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[var(--primary)] hover:shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--primary-subtle)] text-[var(--primary)]">
                    <Icon size={20} aria-hidden="true" />
                  </div>
                  <span className="rounded-full bg-[var(--surface-2)] px-2.5 py-1 text-xs font-semibold tabular-nums text-[var(--foreground)]">
                    {categoryTools.length} {dict.ui.tools}
                  </span>
                </div>

                <h2 className="mt-4 text-lg font-bold text-[var(--foreground)] transition-colors group-hover:text-[var(--primary)]">
                  <Link href={`/${l}/categories/${c.slug}`}>{c.name[l] || c.name.en}</Link>
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-[var(--muted-foreground)]">
                  {c.description[l] || c.description.en}
                </p>

                {examples.length > 0 && (
                  <div className="mt-5 border-t border-[var(--border)] pt-4">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--subtle-foreground)]">
                      {dict.sections.popularTools}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {examples.map((t) => (
                        <Link
                          key={t.id}
                          href={`/${l}/tools/${t.slug}`}
                          className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1 text-[11px] text-[var(--muted-foreground)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
                        >
                          {t.name[l] || t.name.en}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <Link
                  href={`/${l}/categories/${c.slug}`}
                  className="inline-flex w-full items-center justify-between rounded-xl bg-[var(--surface-2)] px-4 py-2.5 text-xs font-semibold text-[var(--foreground)] transition-colors group-hover:bg-[var(--primary)] group-hover:text-[var(--primary-foreground)]"
                >
                  <span>
                    {pick(l, "Explore", "দেখুন")} {c.name[l] || c.name.en}
                  </span>
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
