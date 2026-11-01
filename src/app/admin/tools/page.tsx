import { getDb } from "@/lib/db/client";
import { allTools } from "@/tools/registry";
import { Wrench, Layers, CheckCircle2, AlertCircle } from "lucide-react";

export default async function AdminToolsPage() {
  const db = await getDb();
  const res = db
    ? await db
        .prepare("SELECT id,slug,category_id,status,created_at FROM tools ORDER BY created_at DESC LIMIT 200")
        .all()
    : { results: [] };
  const dbTools = (res.results ?? []) as {
    id: string;
    slug: string;
    category_id: string | null;
    status: string;
    created_at: string;
  }[];

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Tool Catalog & Architecture</h1>
          <p className="text-xs text-[var(--muted-foreground)]">
            Frontend code registry acts as execution engine; DB stores persistent operational states.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[var(--primary-subtle)] px-3 py-1 text-xs font-semibold text-[var(--primary)]">
            Registry: {allTools.length} active
          </span>
          <span className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-xs font-medium text-[var(--muted-foreground)] border border-[var(--border)]">
            DB Records: {dbTools.length}
          </span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <div className="text-xs font-medium text-[var(--muted-foreground)]">Runtime Tools</div>
          <div className="mt-1 text-3xl font-extrabold text-[var(--primary)]">{allTools.length}</div>
          <p className="mt-1 text-[11px] text-[var(--subtle-foreground)]">Imported from registry.ts</p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--border)]/30 bg-[var(--surface)] p-5">
          <div className="text-xs font-medium text-[var(--muted-foreground)]">Database Tracked</div>
          <div className="mt-1 text-3xl font-extrabold text-[var(--foreground)]">{dbTools.length}</div>
          <p className="mt-1 text-[11px] text-[var(--subtle-foreground)]">Recorded in D1 database</p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <div className="text-xs font-medium text-[var(--muted-foreground)]">Deployment Mode</div>
          <div className="mt-1 text-xl font-bold text-[var(--success)]">Cloudflare OpenNext</div>
          <p className="mt-1 text-[11px] text-[var(--subtle-foreground)]">Edge SSR + Static Generation</p>
        </div>
      </div>

      {/* DB Tools Table */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[var(--foreground)]">Registered DB Entries</h2>
          <span className="text-xs text-[var(--muted-foreground)]">{dbTools.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted-foreground)]">
                <th className="p-3.5 font-semibold">Slug</th>
                <th className="p-3.5 font-semibold">Category ID</th>
                <th className="p-3.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {dbTools.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-xs text-[var(--muted-foreground)]">
                    No custom DB overrides active. All {allTools.length} tools operate from code registry.
                  </td>
                </tr>
              ) : (
                dbTools.map((t) => (
                  <tr key={t.id} className="hover:bg-[var(--surface-2)]/50 transition">
                    <td className="p-3.5 font-mono font-medium text-[var(--foreground)]">{t.slug}</td>
                    <td className="p-3.5 text-xs text-[var(--muted-foreground)]">{t.category_id || "—"}</td>
                    <td className="p-3.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--success-subtle)] px-2 py-0.5 text-[11px] font-semibold text-[var(--success)]">
                        <CheckCircle2 size={11} />
                        {t.status}
                      </span>
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
