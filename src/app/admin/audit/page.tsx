import { getDb } from "@/lib/db/client";

export default async function AdminAuditPage() {
  const db = await getDb();
  const res = db ? await db.prepare("SELECT id,user_id,action,entity_type,entity_id,created_at FROM audit_logs ORDER BY created_at DESC LIMIT 200").all() : { results: [] };
  const logs = res.results ?? [];
  return (
    <div>
      <h1 className="text-2xl font-bold">Audit logs</h1>
      <table className="mt-4 w-full text-sm border border-[var(--border)]">
        <thead><tr className="bg-[var(--muted)]"><th className="p-2 text-left">Action</th><th className="p-2">Entity</th><th className="p-2">User</th><th className="p-2">When</th></tr></thead>
        <tbody>
          {logs.length === 0 && <tr><td colSpan={4} className="p-2 text-[var(--foreground)]/60">No logs yet.</td></tr>}
          {logs.map((l: any) => (
            <tr key={l.id} className="border-t border-[var(--border)]"><td className="p-2">{l.action}</td><td className="p-2">{l.entity_type}:{l.entity_id}</td><td className="p-2">{l.user_id}</td><td className="p-2">{l.created_at}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
