import { getDb } from "@/lib/db/client";
import { BarChart3, TrendingUp, Search, Activity } from "lucide-react";

export default async function AdminAnalyticsPage() {
  const db = await getDb();
  const popular = db
    ? await db
        .prepare("SELECT tool_slug, COUNT(*) as count FROM tool_usage GROUP BY tool_slug ORDER BY count DESC LIMIT 20")
        .all()
    : { results: [] };
  const searches = db
    ? await db
        .prepare("SELECT query, COUNT(*) as count FROM search_analytics GROUP BY query ORDER BY count DESC LIMIT 20")
        .all()
    : { results: [] };
  const total = db
    ? await db.prepare("SELECT COUNT(*) as c FROM tool_usage").first<{ c: number }>()
    : { c: 0 };

  const popularList = (popular.results ?? []) as { tool_slug: string; count: number }[];
  const searchList = (searches.results ?? []) as { query: string; count: number }[];

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Platform Analytics</h1>
          <p className="text-xs text-[var(--muted-foreground)]">
            Telemetry metrics tracking real tool invocations and user query volume.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Total Executions</span>
            <Activity size={18} className="text-[var(--primary)]" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-[var(--foreground)]">{total?.c ?? 0}</div>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">Recorded across all tool categories</p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Unique Queries</span>
            <Search size={18} className="text-[var(--info)]" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-[var(--foreground)]">{searchList.length}</div>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">Top logged user search patterns</p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Active Utilities</span>
            <TrendingUp size={18} className="text-[var(--success)]" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-[var(--foreground)]">{popularList.length}</div>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">Tools with recorded usage events</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Popular Tools List */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[var(--foreground)]">Most Executed Tools</h2>
            <span className="text-xs text-[var(--muted-foreground)]">Real invocations</span>
          </div>
          {popularList.length === 0 ? (
            <p className="py-8 text-center text-xs text-[var(--muted-foreground)]">
              No tool executions logged yet. Real usage appears here as users run utilities.
            </p>
          ) : (
            <div className="space-y-3">
              {popularList.map((p, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="font-mono font-medium text-[var(--foreground)]">{p.tool_slug}</span>
                  <span className="rounded-full bg-[var(--primary-subtle)] px-2.5 py-0.5 font-semibold text-[var(--primary)]">
                    {p.count} runs
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Search Queries */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[var(--foreground)]">Top User Search Queries</h2>
            <span className="text-xs text-[var(--muted-foreground)]">Search index hits</span>
          </div>
          {searchList.length === 0 ? (
            <p className="py-8 text-center text-xs text-[var(--muted-foreground)]">
              No search logs collected yet.
            </p>
          ) : (
            <div className="space-y-3">
              {searchList.map((s, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[var(--foreground)]">&ldquo;{s.query}&rdquo;</span>
                  <span className="rounded-full bg-[var(--surface-2)] px-2.5 py-0.5 font-semibold text-[var(--muted-foreground)] border border-[var(--border)]">
                    {s.count} searches
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
