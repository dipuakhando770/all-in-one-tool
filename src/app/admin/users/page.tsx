import { getDb } from "@/lib/db/client";

export default async function AdminUsersPage() {
  const db = await getDb();
  const res = db ? await db.prepare("SELECT id,email,name,status,created_at FROM users ORDER BY created_at DESC LIMIT 100").all() : { results: [] };
  const users = res.results ?? [];
  return (
    <div>
      <h1 className="text-2xl font-bold">Users</h1>
      <table className="mt-4 w-full text-sm border border-[var(--border)]">
        <thead><tr className="bg-[var(--muted)]"><th className="p-2 text-left">Email</th><th className="p-2">Name</th><th className="p-2">Status</th><th className="p-2">Created</th></tr></thead>
        <tbody>
          {users.map((u: any) => (
            <tr key={u.id} className="border-t border-[var(--border)]"><td className="p-2">{u.email}</td><td className="p-2">{u.name}</td><td className="p-2">{u.status}</td><td className="p-2">{u.created_at}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
