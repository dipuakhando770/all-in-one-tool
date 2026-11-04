import { getDb } from "@/lib/db/client";

export default async function AdminPagesPage() {
  const db = await getDb();
  const res = db ? await db.prepare("SELECT id,slug,status,updated_at FROM pages ORDER BY updated_at DESC").all() : { results: [] };
  const pages = (res.results ?? []) as Array<{ id: string; slug: string; status: string; updated_at: string }>;
  return (
    <div>
      <h1 className="text-2xl font-bold">Page CMS</h1>
      <table className="mt-4 w-full text-sm border border-[var(--border)]">
        <thead><tr className="bg-[var(--muted)]"><th className="p-2 text-left">Slug</th><th className="p-2">Status</th><th className="p-2">Updated</th></tr></thead>
        <tbody>
          {pages.length === 0 && <tr><td colSpan={3} className="p-2 text-[var(--foreground)]/60">No pages yet.</td></tr>}
          {pages.map((p) => (
            <tr key={p.id} className="border-t border-[var(--border)]"><td className="p-2">{p.slug}</td><td className="p-2">{p.status}</td><td className="p-2">{p.updated_at}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
