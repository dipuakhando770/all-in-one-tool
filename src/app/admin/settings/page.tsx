import { getDb } from "@/lib/db/client";

export default async function AdminSettingsPage() {
  const db = await getDb();
  const res = db ? await db.prepare("SELECT key,value,updated_at FROM site_settings").all() : { results: [] };
  const settings = res.results ?? [];
  return (
    <div>
      <h1 className="text-2xl font-bold">System settings</h1>
      <table className="mt-4 w-full text-sm border border-[var(--border)]">
        <thead><tr className="bg-[var(--muted)]"><th className="p-2 text-left">Key</th><th className="p-2">Value</th><th className="p-2">Updated</th></tr></thead>
        <tbody>
          {settings.length === 0 && <tr><td colSpan={3} className="p-2 text-[var(--foreground)]/60">No settings yet.</td></tr>}
          {settings.map((s: any) => (
            <tr key={s.key} className="border-t border-[var(--border)]"><td className="p-2">{s.key}</td><td className="p-2">{s.value}</td><td className="p-2">{s.updated_at}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
