import { getDb } from "@/lib/db/client";
import { Users, Mail, Calendar, ShieldCheck, CheckCircle2 } from "lucide-react";

export default async function AdminUsersPage() {
  const db = await getDb();
  const res = db
    ? await db
        .prepare("SELECT id,email,name,status,created_at FROM users ORDER BY created_at DESC LIMIT 100")
        .all()
    : { results: [] };
  const users = (res.results ?? []) as {
    id: string;
    email: string;
    name: string | null;
    status: string;
    created_at: string;
  }[];

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">User Management</h1>
          <p className="text-xs text-[var(--muted-foreground)]">
            Registered customer accounts, authentication status and registration audit trail.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[var(--primary-subtle)] px-3 py-1 text-xs font-semibold text-[var(--primary)]">
            Total Users: {users.length}
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted-foreground)]">
                <th className="p-3.5 font-semibold">User</th>
                <th className="p-3.5 font-semibold">Email</th>
                <th className="p-3.5 font-semibold">Status</th>
                <th className="p-3.5 font-semibold">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-xs text-[var(--muted-foreground)]">
                    No registered users in D1 database yet.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const initials = (u.name || u.email || "U")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2);

                  return (
                    <tr key={u.id} className="hover:bg-[var(--surface-2)]/50 transition">
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--primary-subtle)] text-xs font-bold text-[var(--primary)]">
                            {initials}
                          </div>
                          <span className="font-medium text-[var(--foreground)]">
                            {u.name || "Unnamed user"}
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5 font-mono text-xs text-[var(--muted-foreground)]">
                        {u.email}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            u.status === "active"
                              ? "bg-[var(--success-subtle)] text-[var(--success)]"
                              : "bg-[var(--warning-subtle)] text-[var(--warning)]"
                          }`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {u.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-xs text-[var(--subtle-foreground)]">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
