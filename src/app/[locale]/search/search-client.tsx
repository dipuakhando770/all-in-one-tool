"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { categories } from "@/lib/categories";
import { ToolCard } from "@/components/tool-card";
import { searchToolIndex, suggestTools, type ToolIndexEntry } from "@/lib/tool-discovery";
import type { Locale } from "@/lib/i18n";
import { Search, X, Sparkles, ArrowUpDown, ArrowRight } from "lucide-react";
import Link from "next/link";

const text = {
  en: {
    badge: "tools indexed & searchable",
    title: "Search Nasir Tools",
    subtitle: "Find instant utilities for images, PDFs, code, text, conversions and calculations.",
    placeholder: "Type any tool, category or action (e.g. compress image)…",
    search: "Search",
    clear: "Clear search",
    popular: "Popular:",
    allCategories: "All categories",
    sort: "Sort:",
    relevance: "Relevance",
    popularFirst: "Popular first",
    alphabetical: "Alphabetical (A–Z)",
    showing: "Showing",
    tool: "tool",
    tools: "tools",
    for: "for",
    clearFilter: "Clear filter",
    none: "No matching tools found",
    noneHelp: "We couldn't find any tools for this search. Try another keyword or browse by category.",
    viewAll: "View all tools",
    browse: "Browse categories",
    suggestions: "Did you mean",
  },
  bn: {
    badge: "টি টুল অনুসন্ধানযোগ্য",
    title: "নাসির টুলস খুঁজুন",
    subtitle: "ছবি, PDF, কোড, টেক্সট, কনভার্শন ও হিসাবের জন্য তাৎক্ষণিক টুল খুঁজুন।",
    placeholder: "টুল, ক্যাটাগরি বা কাজ লিখুন (যেমন: ছবি কম্প্রেস)…",
    search: "খুঁজুন",
    clear: "অনুসন্ধান মুছুন",
    popular: "জনপ্রিয়:",
    allCategories: "সব ক্যাটাগরি",
    sort: "সাজান:",
    relevance: "প্রাসঙ্গিকতা",
    popularFirst: "জনপ্রিয় আগে",
    alphabetical: "বর্ণানুক্রমিক (A–Z)",
    showing: "দেখানো হচ্ছে",
    tool: "টুল",
    tools: "টুল",
    for: "জন্য",
    clearFilter: "ফিল্টার মুছুন",
    none: "কোনো মিল পাওয়া যায়নি",
    noneHelp: "এই অনুসন্ধানে কোনো টুল পাওয়া যায়নি। অন্য কীওয়ার্ড চেষ্টা করুন বা ক্যাটাগরি দেখুন।",
    viewAll: "সব টুল দেখুন",
    browse: "ক্যাটাগরি দেখুন",
    suggestions: "আপনি কি খুঁজছেন",
  },
} satisfies Record<Locale, Record<string, string>>;

const quickSearches = [
  "image compressor",
  "pdf merger",
  "json formatter",
  "word counter",
  "age calculator",
  "qr code",
  "markdown",
];

const quickSearchesBn = [
  "ছবি কম্প্রেস",
  "পিডিএফ মার্জ",
  "JSON ফরম্যাট",
  "শব্দ গণনা",
  "বয়স",
  "কিউআর কোড",
  "মার্কডাউন",
];

export function SearchClient({ locale, tools }: { locale: Locale; tools: ToolIndexEntry[] }) {
  const sp = useSearchParams();
  const router = useRouter();
  const initialQuery = sp.get("q") || "";
  const initialCategory = sp.get("category") || "all";
  const queryForSuggestions = sp.get("q") || "";
  const suggestions = useMemo(
    () =>
      queryForSuggestions
        ? suggestTools(tools, queryForSuggestions, 4).filter(
            (t) => t.name[locale].toLowerCase() !== queryForSuggestions.toLowerCase()
          )
        : [],
    [queryForSuggestions, tools, locale]
  );

  const [q, setQ] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<"relevance" | "name" | "popular">("relevance");
  const t = text[locale];

  const results = useMemo(() => {
    let list = q.trim() ? searchToolIndex(tools, q) : tools;
    if (selectedCategory !== "all") {
      list = list.filter((tool) => tool.category === selectedCategory);
    }
    if (sortBy === "name") {
      list = [...list].sort((a, b) =>
        (a.name[locale] || a.name.en).localeCompare(b.name[locale] || b.name.en)
      );
    } else if (sortBy === "popular") {
      list = [...list].sort((a, b) => Number(Boolean(b.popular)) - Number(Boolean(a.popular)));
    }
    return list;
  }, [q, selectedCategory, sortBy, locale, tools]);

  const pushParams = (nextQuery: string, nextCategory: string) => {
    const params = new URLSearchParams();
    if (nextQuery.trim()) params.set("q", nextQuery.trim());
    if (nextCategory !== "all") params.set("category", nextCategory);
    const qs = params.toString();
    router.push(`/${locale}/search${qs ? `?${qs}` : ""}`, { scroll: false });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    pushParams(q, selectedCategory);
  };

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    pushParams(q, slug);
  };

  const clearAll = () => {
    setQ("");
    setSelectedCategory("all");
    router.push(`/${locale}/search`, { scroll: false });
  };

  const quick = locale === "bn" ? quickSearchesBn : quickSearches;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12 animate-fade-in">
      {/* Header */}
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--muted-foreground)]">
          <Sparkles size={13} className="text-[var(--primary)]" aria-hidden="true" />
          <span>{tools.length}+ {t.badge}</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] md:text-4xl">
          {t.title}
        </h1>
        <p className="mt-2 text-sm text-[var(--muted-foreground)] md:text-base">{t.subtitle}</p>

        <form onSubmit={handleSearchSubmit} className="mt-6" role="search">
          <label htmlFor="tool-search" className="sr-only">
            {t.placeholder}
          </label>
          <div className="relative flex items-center shadow-sm">
            <Search
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute left-4 text-[var(--muted-foreground)]"
            />
            <input
              id="tool-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t.placeholder}
              className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] py-3.5 pl-11 pr-24 text-sm text-[var(--foreground)] outline-none transition-all placeholder:text-[var(--subtle-foreground)] focus:border-[var(--primary)] focus:shadow-[0_0_0_4px_var(--primary-subtle)] md:text-base"
              autoFocus
              autoComplete="off"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                className="absolute right-12 p-1.5 text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                aria-label={t.clear}
              >
                <X size={16} />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-2 rounded-xl bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-[var(--primary-foreground)] shadow-sm transition hover:bg-[var(--primary-hover)] md:text-sm"
            >
              {t.search}
            </button>
          </div>
        </form>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-[var(--subtle-foreground)]">{t.suggestions}:</span>
            {suggestions.map((s) => (
              <Link
                key={s.slug}
                href={`/${locale}/tools/${s.slug}`}
                className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-[var(--muted-foreground)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
              >
                {s.name[locale]}
              </Link>
            ))}
          </div>
        )}

        {/* Quick searches */}
        {!q && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-[var(--subtle-foreground)]">{t.popular}</span>
            {quick.map((s) => (
              <button
                key={s}
                onClick={() => setQ(s)}
                className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-xs text-[var(--muted-foreground)] transition hover:border-[var(--primary)] hover:bg-[var(--primary-subtle)] hover:text-[var(--primary)]"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filter and sorting bar */}
      <div className="mt-10 border-b border-[var(--border)] pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => handleCategorySelect("all")}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                selectedCategory === "all"
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "border border-[var(--border)] bg-[var(--surface)] text-[var(--muted-foreground)] hover:bg-[var(--surface-2)]"
              }`}
              aria-pressed={selectedCategory === "all"}
            >
              {t.allCategories} ({tools.length})
            </button>
            {categories.map((c) => {
              const count = tools.filter((tool) => tool.category === c.slug).length;
              if (count === 0) return null;
              const active = selectedCategory === c.slug;
              return (
                <button
                  key={c.slug}
                  onClick={() => handleCategorySelect(c.slug)}
                  aria-pressed={active}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    active
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                      : "border border-[var(--border)] bg-[var(--surface)] text-[var(--muted-foreground)] hover:bg-[var(--surface-2)]"
                  }`}
                >
                  {c.name[locale] || c.name.en} ({count})
                </button>
              );
            })}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <ArrowUpDown size={14} className="text-[var(--muted-foreground)]" aria-hidden="true" />
            <label htmlFor="sort" className="text-xs text-[var(--muted-foreground)]">
              {t.sort}
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "relevance" | "popular" | "name")}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-xs text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
            >
              <option value="relevance">{t.relevance}</option>
              <option value="popular">{t.popularFirst}</option>
              <option value="name">{t.alphabetical}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Result count */}
      <div className="mt-4 flex items-center justify-between text-xs text-[var(--muted-foreground)]">
        <span>
          {t.showing} <strong className="text-[var(--foreground)]">{results.length}</strong>{" "}
          {results.length === 1 ? t.tool : t.tools}
          {q && (
            <>
              {" "}{t.for} &ldquo;<span className="text-[var(--primary)]">{q}</span>&rdquo;
            </>
          )}
        </span>
        {(q || selectedCategory !== "all") && (
          <button onClick={clearAll} className="text-[var(--primary)] hover:underline">
            {t.clearFilter}
          </button>
        )}
      </div>

      {/* Tools Grid */}
      {results.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} locale={locale} />
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface-2)] text-[var(--muted-foreground)]">
            <Search size={26} aria-hidden="true" />
          </div>
          <h2 className="text-lg font-semibold text-[var(--foreground)]">{t.none}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted-foreground)]">{t.noneHelp}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button
              onClick={clearAll}
              className="rounded-lg bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]"
            >
              {t.viewAll} ({tools.length})
            </button>
            <Link
              href={`/${locale}/categories`}
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-4 py-2 text-xs font-medium text-[var(--foreground)] hover:bg-[var(--surface-2)]"
            >
              {t.browse} <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
