import { getDb } from "@/lib/db/client";

export default async function AdminSeoPage() {
  const db = await getDb();
  const res = db ? await db.prepare("SELECT id,entity_type,entity_id,locale,title,robots,updated_at FROM seo_metadata ORDER BY updated_at DESC LIMIT 200").all() : { results: [] };
  const items = (res.results ?? []) as Array<{ id: string; entity_type: string; entity_id: string; locale: string; title: string; robots: string }>;
  return (
    <div>
      <h1 className="text-2xl font-bold">SEO management</h1>
      <table className="mt-4 w-full text-sm border border-[var(--border)]">
        <thead><tr className="bg-[var(--muted)]"><th className="p-2 text-left">Type</th><th className="p-2">Entity</th><th className="p-2">Locale</th><th className="p-2">Title</th><th className="p-2">Robots</th></tr></thead>
        <tbody>
          {items.length === 0 && <tr><td colSpan={5} className="p-2 text-[var(--foreground)]/60">No metadata yet.</td></tr>}
          {items.map((i) => (
            <tr key={i.id} className="border-t border-[var(--border)]"><td className="p-2">{i.entity_type}</td><td className="p-2">{i.entity_id}</td><td className="p-2">{i.locale}</td><td className="p-2">{i.title}</td><td className="p-2">{i.robots}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
