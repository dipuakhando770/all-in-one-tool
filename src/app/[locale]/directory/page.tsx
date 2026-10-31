"use client";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { allTools } from "@/tools/registry";
import { categories } from "@/lib/categories";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function DirectoryPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const [query, setQuery] = useState("");
  const [letter, setLetter] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allTools.filter((t) => {
      const name = t.name[locale as "en" | "bn"] || t.name.en;
      if (letter && !name.toUpperCase().startsWith(letter)) return false;
      if (category && t.category !== category) return false;
      if (q) {
        const hay = [t.slug, t.name.en, t.name.bn, t.description.en, t.description.bn, ...t.keywords, t.category].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    }).sort((a, b) => (a.name.en || "").localeCompare(b.name.en || ""));
  }, [query, letter, category, locale]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    LETTERS.forEach((l) => { c[l] = allTools.filter((t) => (t.name.en || "").toUpperCase().startsWith(l)).length; });
    return c;
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold">A–Z Tool Directory</h1>
      <p className="mt-2 text-[var(--foreground)]/70">Browse all {allTools.length} tools alphabetically.</p>

      <div className="mt-6 flex flex-col gap-4 md:flex-row">
        <input
          className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--muted)] p-2"
          placeholder="Search tools..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-2"
          value={category || ""}
          onChange={(e) => setCategory(e.target.value || null)}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name[locale as "en" | "bn"]}</option>
          ))}
        </select>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setLetter(null)}
          className={`rounded px-3 py-1 text-sm ${letter === null ? "bg-[var(--accent)] text-white" : "border border-[var(--border)] hover:bg-[var(--muted)]"}`}
        >
          All
        </button>
        {LETTERS.map((l) => (
          <button
            key={l}
            onClick={() => setLetter(l)}
            disabled={counts[l] === 0}
            className={`rounded px-3 py-1 text-sm ${letter === l ? "bg-[var(--accent)] text-white" : counts[l] === 0 ? "opacity-40 border border-[var(--border)]" : "border border-[var(--border)] hover:bg-[var(--muted)]"}`}
          >
            {l} ({counts[l]})
          </button>
        ))}
      </div>

      <div className="mt-6">
        {filtered.length === 0 && (
          <p className="text-[var(--foreground)]/60">No tools found.</p>
        )}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((t) => (
            <a
              key={t.id}
              href={`/${locale}/tools/${t.slug}`}
              className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 transition hover:shadow-md hover:border-[var(--accent)]"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold">{t.name[locale as "en" | "bn"]}</span>
              </div>
              <p className="mt-1 text-sm text-[var(--foreground)]/70 line-clamp-2">{t.description[locale as "en" | "bn"]}</p>
              <div className="mt-2 text-xs text-[var(--foreground)]/50">{t.category}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
