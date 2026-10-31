import { getDb } from "@/lib/db/client";

export default async function AdminAnalyticsPage() {
  const db = await getDb();
  const popular = db ? await db.prepare("SELECT tool_slug, COUNT(*) as count FROM tool_usage GROUP BY tool_slug ORDER BY count DESC LIMIT 20").all() : { results: [] };
  const searches = db ? await db.prepare("SELECT query, COUNT(*) as count FROM search_analytics GROUP BY query ORDER BY count DESC LIMIT 20").all() : { results: [] };
  const total = db ? await db.prepare("SELECT COUNT(*) as c FROM tool_usage").first<{ c: number }>() : { c: 0 };
  return (
    <div>
      <h1 className="text-2xl font-bold">Analytics</h1>
      <p className="mt-2">Total tool executions: {total?.c ?? 0}</p>
      <h2 className="mt-4 font-semibold">Popular tools</h2>
      <ul className="mt-2 space-y-1">{(popular.results ?? []).map((p: any, i: number) => <li key={i}>{p.tool_slug}: {p.count}</li>)}</ul>
      <h2 className="mt-4 font-semibold">Top searches</h2>
      <ul className="mt-2 space-y-1">{(searches.results ?? []).map((s: any, i: number) => <li key={i}>{s.query}: {s.count}</li>)}</ul>
    </div>
  );
}
