"use client";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { allTools } from "@/tools/registry";
import { categories } from "@/lib/categories";
import { ToolCard } from "@/components/tool-card";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { Search, ChevronRight, BookOpen, Filter } from "lucide-react";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function DirectoryPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const [query, setQuery] = useState("");
  const [letter, setLetter] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allTools
      .filter((t) => {
        const name = t.name[locale as "en" | "bn"] || t.name.en;
        if (letter && !name.toUpperCase().startsWith(letter)) return false;
        if (category && t.category !== category) return false;
        if (q) {
          const hay = [
            t.slug,
            t.name.en,
            t.name.bn,
            t.description.en,
            t.description.bn,
            ...t.keywords,
            t.category,
          ]
            .join(" ")
            .toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => (a.name.en || "").localeCompare(b.name.en || ""));
  }, [query, letter, category, locale]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    LETTERS.forEach((l) => {
      c[l] = allTools.filter((t) =>
        (t.name.en || "").toUpperCase().startsWith(l)
      ).length;
    });
    return c;
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12 animate-fade-in">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
        <Link href={`/${locale}`} className="hover:text-[var(--primary)] transition">Home</Link>
        <ChevronRight size={12} />
        <span className="text-[var(--foreground)]">A–Z Directory</span>
      </nav>

      {/* Header */}
      <div className="mx-auto max-w-3xl text-center mb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--primary)] mb-3">
          <BookOpen size={13} />
          <span>Full Tool Index</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl text-[var(--foreground)]">
          A–Z Tool Directory
        </h1>
        <p className="mt-2 text-sm text-[var(--muted-foreground)] md:text-base leading-relaxed">
          Browse our comprehensive catalog of {allTools.length} utilities alphabetically or filter by category.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 md:p-6 mb-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]"
            />
            <input
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] py-2.5 pl-10 pr-4 text-xs md:text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)] transition"
              placeholder="Filter by name, description or keyword..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-[var(--muted-foreground)]" />
            <select
              className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 text-xs md:text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)] transition"
              value={category || ""}
              onChange={(e) => setCategory(e.target.value || null)}
            >
              <option value="">All Categories ({allTools.length})</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name[locale as "en" | "bn"] || c.name.en}
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
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                letter === null
                  ? "bg-[var(--primary)] text-white shadow-sm"
                  : "border border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted-foreground)] hover:bg-[var(--surface)]"
              }`}
            >
              All
            </button>
            {LETTERS.map((l) => {
              const count = counts[l] || 0;
              const isSelected = letter === l;
              return (
                <button
                  key={l}
                  onClick={() => setLetter(isSelected ? null : l)}
                  disabled={count === 0}
                  className={`rounded-lg px-2 py-1 text-xs font-medium transition ${
                    isSelected
                      ? "bg-[var(--primary)] text-white shadow-sm"
                      : count === 0
                      ? "opacity-30 border border-transparent text-[var(--subtle-foreground)] cursor-not-allowed"
                      : "border border-[var(--border)] bg-[var(--surface-2)] text-[var(--foreground)] hover:bg-[var(--surface)] hover:border-[var(--primary)]"
                  }`}
                  title={`${count} tools starting with ${l}`}
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
          Showing <strong className="text-[var(--foreground)]">{filtered.length}</strong> tools
          {letter && <> starting with &ldquo;<strong>{letter}</strong>&rdquo;</>}
          {category && <> in &ldquo;<strong>{category}</strong>&rdquo;</>}
        </span>
        {(letter || category || query) && (
          <button
            onClick={() => { setLetter(null); setCategory(null); setQuery(""); }}
            className="text-[var(--primary)] hover:underline"
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((tool) => (
            <ToolCard key={tool.id} tool={tool} locale={locale as Locale} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center">
          <p className="text-sm text-[var(--muted-foreground)]">
            No tools match the selected filters.
          </p>
          <button
            onClick={() => { setLetter(null); setCategory(null); setQuery(""); }}
            className="mt-4 rounded-xl bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white hover:opacity-90 transition"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
