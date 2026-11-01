import { getDb } from "@/lib/db/client";
import { Settings, ShieldCheck } from "lucide-react";

export default async function AdminSettingsPage() {
  const db = await getDb();
  const res = db
    ? await db.prepare("SELECT key,value,updated_at FROM site_settings").all()
    : { results: [] };
  const settings = (res.results ?? []) as {
    key: string;
    value: string;
    updated_at: string;
  }[];

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">System Configuration</h1>
          <p className="text-xs text-[var(--muted-foreground)]">
            Persistent key-value platform flags, maintenance controls and operational parameters.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted-foreground)]">
                <th className="p-3.5 font-semibold">Config Key</th>
                <th className="p-3.5 font-semibold">Assigned Value</th>
                <th className="p-3.5 font-semibold">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {settings.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-xs text-[var(--muted-foreground)]">
                    No custom site settings stored in D1 database yet. Default production values active.
                  </td>
                </tr>
              ) : (
                settings.map((s) => (
                  <tr key={s.key} className="hover:bg-[var(--surface-2)]/50 transition">
                    <td className="p-3.5 font-mono font-medium text-[var(--foreground)]">{s.key}</td>
                    <td className="p-3.5 font-mono text-xs text-[var(--muted-foreground)]">{s.value}</td>
                    <td className="p-3.5 text-xs text-[var(--subtle-foreground)]">
                      {new Date(s.updated_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
