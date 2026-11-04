import { getDb } from "@/lib/db/client";

export default async function AdminRedirectsPage() {
  const db = await getDb();
  const res = db ? await db.prepare("SELECT id,source,destination,status_code,active FROM redirects ORDER BY created_at DESC").all() : { results: [] };
  const items = (res.results ?? []) as Array<{ id: string; source: string; destination: string; status_code: number; active: boolean }>;
  return (
    <div>
      <h1 className="text-2xl font-bold">Redirects</h1>
      <table className="mt-4 w-full text-sm border border-[var(--border)]">
        <thead><tr className="bg-[var(--muted)]"><th className="p-2 text-left">Source</th><th className="p-2">Destination</th><th className="p-2">Code</th><th className="p-2">Active</th></tr></thead>
        <tbody>
          {items.length === 0 && <tr><td colSpan={4} className="p-2 text-[var(--foreground)]/60">No redirects yet.</td></tr>}
          {items.map((r) => (
            <tr key={r.id} className="border-t border-[var(--border)]"><td className="p-2">{r.source}</td><td className="p-2">{r.destination}</td><td className="p-2">{r.status_code}</td><td className="p-2">{r.active}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
