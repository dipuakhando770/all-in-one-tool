import { getDb } from "@/lib/db/client";

export default async function AdminToolsPage() {
  const db = await getDb();
  const res = db ? await db.prepare("SELECT id,slug,category_id,status,created_at FROM tools ORDER BY created_at DESC LIMIT 200").all() : { results: [] };
  const tools = res.results ?? [];
  return (
    <div>
      <h1 className="text-2xl font-bold">Tools</h1>
      <p className="mt-2 text-sm text-[var(--foreground)]/60">Frontend tool registry remains source of truth for runtime; DB tracks metadata/analytics.</p>
      <table className="mt-4 w-full text-sm border border-[var(--border)]">
        <thead><tr className="bg-[var(--muted)]"><th className="p-2 text-left">Slug</th><th className="p-2">Category</th><th className="p-2">Status</th></tr></thead>
        <tbody>
          {tools.length === 0 && <tr><td colSpan={3} className="p-2 text-[var(--foreground)]/60">No DB tools yet.</td></tr>}
          {tools.map((t: any) => (
            <tr key={t.id} className="border-t border-[var(--border)]"><td className="p-2">{t.slug}</td><td className="p-2">{t.category_id}</td><td className="p-2">{t.status}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
