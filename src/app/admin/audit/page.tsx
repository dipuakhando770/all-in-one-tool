import { getDb } from "@/lib/db/client";
import { ShieldAlert, Clock, User } from "lucide-react";

export default async function AdminAuditPage() {
  const db = await getDb();
  const res = db
    ? await db
        .prepare("SELECT id,user_id,action,entity_type,entity_id,created_at FROM audit_logs ORDER BY created_at DESC LIMIT 200")
        .all()
    : { results: [] };
  const logs = (res.results ?? []) as {
    id: string;
    user_id: string | null;
    action: string;
    entity_type: string | null;
    entity_id: string | null;
    created_at: string;
  }[];

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Security & Audit Logs</h1>
          <p className="text-xs text-[var(--muted-foreground)]">
            Immutable server-side trail of administrative operations, role modifications and system events.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-xs font-medium text-[var(--muted-foreground)] border border-[var(--border)]">
            Entries: {logs.length}
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted-foreground)]">
                <th className="p-3.5 font-semibold">Action</th>
                <th className="p-3.5 font-semibold">Target Entity</th>
                <th className="p-3.5 font-semibold">User ID</th>
                <th className="p-3.5 font-semibold">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-xs text-[var(--muted-foreground)]">
                    No administrative audit events recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((l) => (
                  <tr key={l.id} className="hover:bg-[var(--surface-2)]/50 transition">
                    <td className="p-3.5 font-semibold text-[var(--foreground)]">{l.action}</td>
                    <td className="p-3.5 font-mono text-xs text-[var(--muted-foreground)]">
                      {l.entity_type ? `${l.entity_type}:${l.entity_id}` : "—"}
                    </td>
                    <td className="p-3.5 font-mono text-xs text-[var(--subtle-foreground)]">
                      {l.user_id || "system"}
                    </td>
                    <td className="p-3.5 text-xs text-[var(--subtle-foreground)]">
                      {new Date(l.created_at).toLocaleString()}
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
