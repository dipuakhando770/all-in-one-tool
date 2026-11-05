"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { allTools, searchTools } from "@/tools/registry";
import { categories } from "@/lib/categories";
import { ToolCard } from "@/components/tool-card";
import type { Locale } from "@/lib/i18n";
import { Search, X, Sparkles, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import Link from "next/link";

const quickSearches = [
  "image compressor",
  "pdf merger",
  "json formatter",
  "word counter",
  "age calculator",
  "qr code",
  "markdown",
];

export function SearchClient({ locale }: { locale: Locale }) {
  const sp = useSearchParams();
  const router = useRouter();
  const initialQuery = sp.get("q") || "";
  const initialCategory = sp.get("category") || "all";

  const [q, setQ] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<"relevance" | "name" | "popular">("relevance");

  const results = useMemo(() => {
    let list = q.trim() ? searchTools(q) : allTools;

    if (selectedCategory !== "all") {
      list = list.filter((t) => t.category === selectedCategory);
    }

    if (sortBy === "name") {
      list = [...list].sort((a, b) =>
        (a.name[locale] || a.name.en).localeCompare(b.name[locale] || b.name.en)
      );
    } else if (sortBy === "popular") {
      list = [...list].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    }

    return list;
  }, [q, selectedCategory, sortBy, locale]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    router.push(`/${locale}/search?${params.toString()}`);
  };

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (slug !== "all") params.set("category", slug);
    router.push(`/${locale}/search?${params.toString()}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12 animate-fade-in">
      {/* Header */}
      <div className="mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--muted-foreground)] mb-4">
          <Sparkles size={13} className="text-[var(--primary)]" />
          <span>{allTools.length}+ tools indexed & searchable</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl text-[var(--foreground)]">
          Search Nasir Tools
        </h1>
        <p className="mt-2 text-sm text-[var(--muted-foreground)] md:text-base">
          Find instant utilities for images, PDFs, code, text, conversions and calculations.
        </p>

        {/* Search input form */}
        <form onSubmit={handleSearchSubmit} className="mt-6">
          <div className="relative flex items-center shadow-sm">
            <Search
              size={18}
              className="absolute left-4 text-[var(--muted-foreground)] pointer-events-none"
            />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Type any tool name, category or action (e.g. compress image)..."
              className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] py-3.5 pl-11 pr-24 text-sm md:text-base outline-none transition-all focus:border-[var(--primary)] focus:shadow-[0_0_0_4px_var(--primary-subtle)] text-[var(--foreground)] placeholder:text-[var(--subtle-foreground)]"
              autoFocus
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                className="absolute right-12 p-1.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-2 rounded-xl bg-[var(--primary)] px-4 py-2 text-xs md:text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
            >
              Search
            </button>
          </div>
        </form>

        {/* Quick searches */}
        {!q && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-[var(--subtle-foreground)]">Popular:</span>
            {quickSearches.map((s) => (
              <button
                key={s}
                onClick={() => setQ(s)}
                className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-xs text-[var(--muted-foreground)] transition hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--primary-subtle)]"
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
          {/* Categories horizontal scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => handleCategorySelect("all")}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                selectedCategory === "all"
                  ? "bg-[var(--primary)] text-white"
                  : "border border-[var(--border)] bg-[var(--surface)] text-[var(--muted-foreground)] hover:bg-[var(--surface-2)]"
              }`}
            >
              All Categories ({allTools.length})
            </button>
            {categories.map((c) => {
              const count = allTools.filter((t) => t.category === c.slug).length;
              const active = selectedCategory === c.slug;
              return (
                <button
                  key={c.slug}
                  onClick={() => handleCategorySelect(c.slug)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    active
                      ? "bg-[var(--primary)] text-white"
                      : "border border-[var(--border)] bg-[var(--surface)] text-[var(--muted-foreground)] hover:bg-[var(--surface-2)]"
                  }`}
                >
                  {c.name[locale] || c.name.en} ({count})
                </button>
              );
            })}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2 shrink-0">
            <ArrowUpDown size={14} className="text-[var(--muted-foreground)]" />
            <span className="text-xs text-[var(--muted-foreground)]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'relevance' | 'popular' | 'name')}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-xs text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
            >
              <option value="relevance">Relevance</option>
              <option value="popular">Popular First</option>
              <option value="name">Alphabetical (A–Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Result count */}
      <div className="mt-4 flex items-center justify-between text-xs text-[var(--muted-foreground)]">
        <span>
          Showing <strong className="text-[var(--foreground)]">{results.length}</strong> {results.length === 1 ? "tool" : "tools"}
          {q && (
            <> for &ldquo;<span className="text-[var(--primary)]">{q}</span>&rdquo;</>
          )}
        </span>
        {q && (
          <button
            onClick={() => setQ("")}
            className="text-[var(--primary)] hover:underline"
          >
            Clear filter
          </button>
        )}
      </div>

      {/* Tools Grid */}
      {results.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((tool) => (
            <ToolCard key={tool.id} tool={tool} locale={locale} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="mt-12 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface-2)] text-[var(--muted-foreground)]">
            <Search size={26} />
          </div>
          <h3 className="text-lg font-semibold text-[var(--foreground)]">No matching tools found</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted-foreground)]">
            We couldn&apos;t find any tools matching &ldquo;{q}&rdquo;. Try another search keyword or browse by category.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => { setQ(""); setSelectedCategory("all"); }}
              className="rounded-lg bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white hover:opacity-90"
            >
              View All 161+ Tools
            </button>
            <Link
              href={`/${locale}/categories`}
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-xs font-medium text-[var(--foreground)] hover:bg-[var(--surface-2)]"
            >
              Browse Categories
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
