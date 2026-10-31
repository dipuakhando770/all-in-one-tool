"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { allTools, searchTools } from "@/tools/registry";
import { ToolCard } from "@/components/tool-card";
import type { Locale } from "@/lib/i18n";

export function SearchClient({ locale }: { locale: Locale }) {
  const sp = useSearchParams();
  const router = useRouter();
  const initial = sp.get("q") || "";
  const [q, setQ] = useState(initial);
  const results = q.trim() ? searchTools(q) : allTools;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/${locale}/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold">Search Tools</h1>
      <form onSubmit={submit} className="mt-4 flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search tools..."
          className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3"
        />
        <button type="submit" className="rounded-lg bg-[var(--accent)] px-4 py-2 text-white">Search</button>
      </form>
      <p className="mt-4 text-sm text-[var(--foreground)]/60">{results.length} results</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {results.map((t) => <ToolCard key={t.id} tool={t} locale={locale} />)}
      </div>
      {results.length === 0 && <p className="mt-6">No tools found.</p>}
    </div>
  );
}
