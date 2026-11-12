"use client";
import { useMemo, useState } from "react";
import { categories } from "@/lib/categories";
import { ToolCard } from "@/components/tool-card";
import { searchToolIndex, type ToolIndexEntry } from "@/lib/tool-discovery";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { Search, ChevronRight, BookOpen, Filter } from "lucide-react";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const text = {
  en: {
    home: "Home",
    crumb: "A–Z Directory",
    badge: "Full tool index",
    title: "A–Z Tool Directory",
    subtitle: (n: number) =>
      `Browse our complete catalog of ${n} utilities alphabetically or filter by category.`,
    filterPlaceholder: "Filter by name, description or keyword…",
    allCategories: (n: number) => `All categories (${n})`,
    all: "All",
    showing: "Showing",
    tools: "tools",
    startingWith: "starting with",
    in: "in",
    reset: "Reset all filters",
    empty: "No tools match the selected filters.",
    clear: "Clear filters",
    startsWith: (l: string, n: number) => `${n} tools starting with ${l}`,
  },
  bn: {
    home: "হোম",
    crumb: "A–Z ডিরেক্টরি",
    badge: "সম্পূর্ণ টুল তালিকা",
    title: "A–Z টুল ডিরেক্টরি",
    subtitle: (n: number) => `${n}টি ফ্রি অনলাইন টুল বর্ণানুক্রমে বা ক্যাটাগরি অনুযায়ী ব্রাউজ করুন।`,
    filterPlaceholder: "নাম, বর্ণনা বা কীওয়ার্ড দিয়ে ফিল্টার করুন…",
    allCategories: (n: number) => `সব ক্যাটাগরি (${n})`,
    all: "সব",
    showing: "দেখানো হচ্ছে",
    tools: "টুল",
    startingWith: "শুরু হয়",
    in: "ক্যাটাগরিতে",
    reset: "সব ফিল্টার রিসেট",
    empty: "নির্বাচিত ফিল্টারে কোনো টুল মেলেনি।",
    clear: "ফিল্টার মুছুন",
    startsWith: (l: string, n: number) => `${l} দিয়ে শুরু হওয়া ${n}টি টুল`,
  },
} satisfies Record<Locale, Record<string, unknown>>;

export function DirectoryClient({ locale, tools }: { locale: Locale; tools: ToolIndexEntry[] }) {
  const [query, setQuery] = useState("");
  const [letter, setLetter] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const t = text[locale];

  const filtered = useMemo(() => {
    let list = tools;
    if (query.trim()) {
      const matched = new Set(searchToolIndex(tools, query).map((tool) => tool.slug));
      list = list.filter((tool) => matched.has(tool.slug));
    }
    if (letter) {
      list = list.filter((tool) => tool.name[locale].toUpperCase().startsWith(letter));
    }
    if (category) {
      list = list.filter((tool) => tool.category === category);
    }
    return [...list].sort((a, b) => a.name[locale].localeCompare(b.name[locale]));
  }, [query, letter, category, locale, tools]);

  const counts = useMemo(() => {
    const result: Record<string, number> = {};
    for (const l of LETTERS) {
      result[l] = tools.filter((tool) => tool.name[locale].toUpperCase().startsWith(l)).length;
    }
    return result;
  }, [locale, tools]);

  const reset = () => {
    setLetter(null);
    setCategory(null);
    setQuery("");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12 animate-fade-in">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]" aria-label="Breadcrumb">
        <Link href={`/${locale}`} className="transition hover:text-[var(--primary)]">
          {t.home}
        </Link>
        <ChevronRight size={12} aria-hidden="true" />
        <span className="text-[var(--foreground)]">{t.crumb}</span>
      </nav>

      {/* Header */}
      <div className="mx-auto mb-8 max-w-3xl text-center">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--primary)]">
          <BookOpen size={13} aria-hidden="true" />
          <span>{t.badge}</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] md:text-5xl">
          {t.title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)] md:text-base">
          {t.subtitle(tools.length)}
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <label htmlFor="directory-search" className="sr-only">
              {t.filterPlaceholder}
            </label>
            <Search
              size={16}
              aria-hidden="true"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]"
            />
            <input
              id="directory-search"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] py-2.5 pl-10 pr-4 text-xs text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] md:text-sm"
              placeholder={t.filterPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="search"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-[var(--muted-foreground)]" aria-hidden="true" />
            <label htmlFor="directory-category" className="sr-only">
              {t.allCategories(tools.length)}
            </label>
            <select
              id="directory-category"
              className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 text-xs text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] md:text-sm"
              value={category || ""}
              onChange={(e) => setCategory(e.target.value || null)}
            >
              <option value="">{t.allCategories(tools.length)}</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name[locale] || c.name.en}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Alphabetical Buttons */}
        <div className="mt-5 border-t border-[var(--border)] pt-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setLetter(null)}
              aria-pressed={letter === null}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                letter === null
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
                  : "border border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted-foreground)] hover:bg-[var(--surface)]"
              }`}
            >
              {t.all}
            </button>
            {LETTERS.map((l) => {
              const count = counts[l] || 0;
              const isSelected = letter === l;
              return (
                <button
                  key={l}
                  onClick={() => setLetter(isSelected ? null : l)}
                  disabled={count === 0}
                  aria-pressed={isSelected}
                  className={`rounded-lg px-2 py-1 text-xs font-medium transition ${
                    isSelected
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
                      : count === 0
                        ? "cursor-not-allowed border border-transparent text-[var(--subtle-foreground)] opacity-30"
                        : "border border-[var(--border)] bg-[var(--surface-2)] text-[var(--foreground)] hover:border-[var(--primary)] hover:bg-[var(--surface)]"
                  }`}
                  title={t.startsWith(l, count)}
                >
                  {l}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="mb-4 flex items-center justify-between text-xs text-[var(--muted-foreground)]">
        <span>
          {t.showing} <strong className="text-[var(--foreground)]">{filtered.length}</strong> {t.tools}
          {letter && <> {t.startingWith} &ldquo;<strong>{letter}</strong>&rdquo;</>}
          {category && <> {t.in} &ldquo;<strong>{category}</strong>&rdquo;</>}
        </span>
        {(letter || category || query) && (
          <button onClick={reset} className="text-[var(--primary)] hover:underline">
            {t.reset}
          </button>
        )}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} locale={locale} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center">
          <p className="text-sm text-[var(--muted-foreground)]">{t.empty}</p>
          <button
            onClick={reset}
            className="mt-4 rounded-xl bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-[var(--primary-foreground)] transition hover:bg-[var(--primary-hover)]"
          >
            {t.clear}
          </button>
        </div>
      )}
    </div>
  );
}
