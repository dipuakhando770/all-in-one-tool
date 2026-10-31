import { getDb } from "@/lib/db/client";

export default async function AdminCategoriesPage() {
  const db = await getDb();
  const res = db ? await db.prepare("SELECT id,slug,icon,color,sort_order FROM categories ORDER BY sort_order").all() : { results: [] };
  const cats = res.results ?? [];
  return (
    <div>
      <h1 className="text-2xl font-bold">Categories</h1>
      <table className="mt-4 w-full text-sm border border-[var(--border)]">
        <thead><tr className="bg-[var(--muted)]"><th className="p-2 text-left">Slug</th><th className="p-2">Icon</th><th className="p-2">Color</th><th className="p-2">Order</th></tr></thead>
        <tbody>
          {cats.length === 0 && <tr><td colSpan={4} className="p-2 text-[var(--foreground)]/60">No DB categories yet.</td></tr>}
          {cats.map((c: any) => (
            <tr key={c.id} className="border-t border-[var(--border)]"><td className="p-2">{c.slug}</td><td className="p-2">{c.icon}</td><td className="p-2">{c.color}</td><td className="p-2">{c.sort_order}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
