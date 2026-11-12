import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { categories } from "@/lib/categories";
import { getToolsByCategory, allTools } from "@/tools/registry";
import { ToolCard } from "@/components/tool-card";
import type { Locale } from "@/lib/i18n";
import Link from "next/link";
import { ChevronRight, Layers, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { pageAlternates, pageOpenGraph, pick } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) return {};
  const l = locale as Locale;
  const name = cat.name[l] || cat.name.en;
  const desc = cat.description[l] || cat.description.en;
  const count = getToolsByCategory(slug).length;
  const title = pick(
    l,
    `${name} Tools (${count} free utilities)`,
    `${name} টুল (${count}টি ফ্রি ইউটিলিটি)`
  );
  const description = pick(
    l,
    `${desc} ${count} free, instant, browser-based ${name.toLowerCase()} tools. No registration required.`,
    `${desc} ${count}টি ফ্রি, তাৎক্ষণিক ব্রাউজার-ভিত্তিক টুল। রেজিস্ট্রেশন লাগে না।`
  );

  return {
    title,
    description,
    alternates: pageAlternates(l, `/categories/${slug}`),
    openGraph: pageOpenGraph({
      locale: l,
      path: `/categories/${slug}`,
      title,
      description,
    }),
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const l = locale as Locale;
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) notFound();

  const dict = await getDictionary(l);
  const tools = getToolsByCategory(slug);
  const otherCategories = categories
    .filter((c) => c.slug !== slug && allTools.some((t) => t.category === c.slug))
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      {/* Breadcrumbs */}
      <nav
        className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-[var(--muted-foreground)]"
        aria-label={pick(l, "Breadcrumb", "ব্রেডক্রাম্ব")}
      >
        <Link href={`/${l}`} className="transition-colors hover:text-[var(--primary)]">
          {dict.ui.home}
        </Link>
        <ChevronRight size={12} aria-hidden="true" />
        <Link
          href={`/${l}/categories`}
          className="transition-colors hover:text-[var(--primary)]"
        >
          {dict.nav.categories}
        </Link>
        <ChevronRight size={12} aria-hidden="true" />
        <span className="text-[var(--foreground)]">{cat.name[l] || cat.name.en}</span>
      </nav>

      {/* Category hero */}
      <header className="mb-10 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 md:p-10">
        <div className="max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--primary-subtle)] px-3 py-1 text-xs font-semibold text-[var(--primary)]">
            <Layers size={13} aria-hidden="true" />
            <span>{pick(l, "Category hub", "ক্যাটাগরি হাব")}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] md:text-4xl">
            {cat.name[l] || cat.name.en}
          </h1>
          <p className="mt-2 text-base leading-relaxed text-[var(--muted-foreground)]">
            {cat.description[l] || cat.description.en}
          </p>
          <ul className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[var(--muted-foreground)]">
            <li className="tabular-nums">
              {tools.length} {dict.ui.toolsAvailable}
            </li>
            <li aria-hidden="true" className="text-[var(--border-strong)]">
              •
            </li>
            <li>{dict.ui.freeToUse}</li>
            <li aria-hidden="true" className="text-[var(--border-strong)]">
              •
            </li>
            <li>{dict.ui.browserBased}</li>
          </ul>
        </div>
      </header>

      {/* Tools grid */}
      <section aria-labelledby="category-tools-heading">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2
            id="category-tools-heading"
            className="text-xl font-bold text-[var(--foreground)]"
          >
            {pick(l, "All", "সব")} {cat.name[l] || cat.name.en}
          </h2>
          <span className="text-xs tabular-nums text-[var(--muted-foreground)]">
            {tools.length} {dict.ui.tools}
          </span>
        </div>

        {tools.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tools.map((t) => (
              <ToolCard key={t.id} tool={t} locale={l} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center">
            <p className="text-sm text-[var(--muted-foreground)]">{dict.common.noResults}</p>
            <Link
              href={`/${l}/tools`}
              className="mt-3 inline-block text-sm text-[var(--primary)] hover:underline"
            >
              {pick(l, "Browse all tools", "সব টুল দেখুন")}
            </Link>
          </div>
        )}
      </section>

      {/* Other categories */}
      {otherCategories.length > 0 && (
        <section className="mt-14 border-t border-[var(--border)] pt-10">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-[var(--foreground)]">
              {pick(l, "Explore other categories", "অন্য ক্যাটাগরি দেখুন")}
            </h2>
            <Link
              href={`/${l}/categories`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)] hover:underline"
            >
              {pick(l, "View all categories", "সব ক্যাটাগরি")}
              <ArrowRight size={12} aria-hidden="true" />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {otherCategories.map((c) => (
              <Link
                key={c.slug}
                href={`/${l}/categories/${c.slug}`}
                className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors hover:border-[var(--primary)]"
              >
                <div className="text-sm font-semibold transition-colors group-hover:text-[var(--primary)]">
                  {c.name[l] || c.name.en}
                </div>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--muted-foreground)]">
                  {c.description[l] || c.description.en}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
