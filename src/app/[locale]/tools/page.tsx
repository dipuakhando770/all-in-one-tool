import { getDictionary } from "@/lib/dictionary";
import { allTools } from "@/tools/registry";
import { categories } from "@/lib/categories";
import { ToolCard } from "@/components/tool-card";
import type { Locale } from "@/lib/i18n";
import Link from "next/link";
import { LayoutGrid, ChevronRight, Search, SlidersHorizontal } from "lucide-react";
import type { Metadata } from "next";
import { pageAlternates, pageOpenGraph, pick } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  const title = pick(l, "All Tools", "সব টুল");
  const description = pick(
    l,
    `Browse ${allTools.length}+ free online tools for images, PDFs, text, code, calculations and more. No registration required.`,
    `ছবি, PDF, টেক্সট, কোড, ক্যালকুলেটর ও আরও অনেক কিছুর জন্য ${allTools.length}+ ফ্রি অনলাইন টুল ব্রাউজ করুন। রেজিস্ট্রেশন লাগে না।`
  );

  return {
    title: `${title} (${allTools.length}+)`,
    description,
    alternates: pageAlternates(l, "/tools"),
    openGraph: pageOpenGraph({ locale: l, path: "/tools", title, description }),
  };
}

export default async function ToolsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ category?: string; sort?: string }>;
}) {
  const { locale } = await params;
  const sp = searchParams ? await searchParams : {};
  const l = locale as Locale;
  const dict = await getDictionary(l);

  const activeCategory =
    sp?.category && sp.category !== "all" ? sp.category : "all";
  const sort = sp?.sort || "default";

  const activeCategoryMeta =
    activeCategory === "all"
      ? null
      : categories.find((c) => c.slug === activeCategory) ?? null;

  let tools =
    activeCategory === "all"
      ? allTools
      : allTools.filter((t) => t.category === activeCategory);

  if (sort === "popular") {
    tools = [...tools].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
  } else if (sort === "new") {
    tools = [...tools].sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0));
  } else if (sort === "name") {
    tools = [...tools].sort((a, b) => a.name[l].localeCompare(b.name[l]));
  }

  const totalTools = allTools.length;
  const filteredCount = tools.length;

  const sortOptions = [
    { value: "default", label: dict.ui.sortDefault },
    { value: "popular", label: dict.ui.sortPopular },
    { value: "new", label: dict.ui.sortNew },
    { value: "name", label: dict.ui.sortName },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <nav
          className="mb-3 flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]"
          aria-label={pick(l, "Breadcrumb", "ব্রেডক্রাম্ব")}
        >
          <Link href={`/${l}`} className="transition-colors hover:text-[var(--primary)]">
            {dict.ui.home}
          </Link>
          <ChevronRight size={12} aria-hidden="true" />
          <span className="text-[var(--foreground)]">{dict.nav.allTools}</span>
        </nav>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] md:text-4xl">
              {activeCategoryMeta ? activeCategoryMeta.name[l] : dict.nav.allTools}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted-foreground)]">
              {activeCategoryMeta
                ? activeCategoryMeta.description[l]
                : pick(
                    l,
                    `${totalTools} free browser-based tools for everyday digital work.`,
                    `প্রতিদিনের ডিজিটাল কাজের জন্য ${totalTools}টি ফ্রি ব্রাউজার-ভিত্তিক টুল।`
                  )}
            </p>
            <p className="mt-2 text-xs tabular-nums text-[var(--subtle-foreground)]">
              {pick(l, "Showing", "দেখানো হচ্ছে")}{" "}
              <strong className="text-[var(--foreground)]">{filteredCount}</strong>{" "}
              {pick(l, "tools", "টুল")}
              {activeCategoryMeta && (
                <>
                  {" "}
                  {pick(l, "in", "—")}{" "}
                  <strong className="text-[var(--foreground)]">
                    {activeCategoryMeta.name[l]}
                  </strong>
                </>
              )}
            </p>
          </div>

          {/* Sort controls */}
          <div
            className="flex items-center gap-1 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1"
            role="group"
            aria-label={dict.ui.sortBy}
          >
            <SlidersHorizontal
              size={13}
              className="ml-2 mr-1 shrink-0 text-[var(--muted-foreground)]"
              aria-hidden="true"
            />
            {sortOptions.map((s) => (
              <Link
                key={s.value}
                href={`/${l}/tools?category=${activeCategory}&sort=${s.value}`}
                aria-current={sort === s.value ? "true" : undefined}
                className={`shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  sort === s.value
                    ? "bg-[var(--primary-subtle)] text-[var(--primary)]"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
                }`}
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar — category filter */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-20">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              {dict.nav.categories}
            </p>
            <nav className="space-y-0.5" aria-label={dict.nav.categories}>
              <Link
                href={`/${l}/tools?category=all&sort=${sort}`}
                aria-current={activeCategory === "all" ? "true" : undefined}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                  activeCategory === "all"
                    ? "bg-[var(--primary-subtle)] font-medium text-[var(--primary)]"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
                }`}
              >
                <span>{dict.ui.allCategories}</span>
                <span className="rounded-full bg-[var(--surface-2)] px-1.5 py-0.5 text-[10px] tabular-nums text-[var(--subtle-foreground)]">
                  {totalTools}
                </span>
              </Link>
              {categories.map((c) => {
                const count = allTools.filter((t) => t.category === c.slug).length;
                if (count === 0) return null;
                const active = activeCategory === c.slug;
                return (
                  <Link
                    key={c.slug}
                    href={`/${l}/tools?category=${c.slug}&sort=${sort}`}
                    aria-current={active ? "true" : undefined}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                      active
                        ? "bg-[var(--primary-subtle)] font-medium text-[var(--primary)]"
                        : "text-[var(--muted-foreground)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    <span className="truncate">{c.name[l]}</span>
                    <span className="ml-2 shrink-0 rounded-full bg-[var(--surface-2)] px-1.5 py-0.5 text-[10px] tabular-nums text-[var(--subtle-foreground)]">
                      {count}
                    </span>
                  </Link>
                );
              })}
            </nav>

            <Link
              href={`/${l}/search`}
              className="mt-4 flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-xs text-[var(--muted-foreground)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
            >
              <Search size={13} aria-hidden="true" />
              {dict.ui.searchTools}
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          {/* Mobile category pills */}
          <div
            className="mb-6 flex gap-2 overflow-x-auto pb-2 lg:hidden"
            role="group"
            aria-label={dict.nav.categories}
          >
            <Link
              href={`/${l}/tools?category=all&sort=${sort}`}
              aria-current={activeCategory === "all" ? "true" : undefined}
              className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                activeCategory === "all"
                  ? "border-[var(--primary)] bg-[var(--primary-subtle)] text-[var(--primary)]"
                  : "border-[var(--border)] text-[var(--muted-foreground)]"
              }`}
            >
              {dict.ui.allCategories}
            </Link>
            {categories.map((c) => {
              const count = allTools.filter((t) => t.category === c.slug).length;
              if (count === 0) return null;
              return (
                <Link
                  key={c.slug}
                  href={`/${l}/tools?category=${c.slug}&sort=${sort}`}
                  aria-current={activeCategory === c.slug ? "true" : undefined}
                  className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    activeCategory === c.slug
                      ? "border-[var(--primary)] bg-[var(--primary-subtle)] text-[var(--primary)]"
                      : "border-[var(--border)] text-[var(--muted-foreground)]"
                  }`}
                >
                  {c.name[l]}
                </Link>
              );
            })}
          </div>

          {/* Tools grid */}
          {tools.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {tools.map((t) => (
                <ToolCard key={t.id} tool={t} locale={l} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] py-24 text-center">
              <LayoutGrid
                size={36}
                className="mb-4 text-[var(--muted-foreground)] opacity-40"
                aria-hidden="true"
              />
              <p className="font-medium">{dict.common.noResults}</p>
              <Link
                href={`/${l}/tools`}
                className="mt-3 text-sm text-[var(--primary)] hover:underline"
              >
                {pick(l, "View all tools", "সব টুল দেখুন")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
