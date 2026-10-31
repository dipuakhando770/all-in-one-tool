import { getDb } from "@/lib/db/client";

export default async function AdminOverviewPage() {
  const db = await getDb();
  const users = db ? await db.prepare("SELECT COUNT(*) as c FROM users").first<{ c: number }>() : { c: 0 };
  const tools = db ? await db.prepare("SELECT COUNT(*) as c FROM tools").first<{ c: number }>() : { c: 0 };
  const posts = db ? await db.prepare("SELECT COUNT(*) as c FROM blog_posts").first<{ c: number }>() : { c: 0 };
  return (
    <div>
      <h1 className="text-2xl font-bold">Overview</h1>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--border)] p-5"><div className="text-sm text-[var(--foreground)]/60">Users</div><div className="text-2xl font-bold">{users?.c ?? 0}</div></div>
        <div className="rounded-xl border border-[var(--border)] p-5"><div className="text-sm text-[var(--foreground)]/60">Tools (DB)</div><div className="text-2xl font-bold">{tools?.c ?? 0}</div></div>
        <div className="rounded-xl border border-[var(--border)] p-5"><div className="text-sm text-[var(--foreground)]/60">Blog posts</div><div className="text-2xl font-bold">{posts?.c ?? 0}</div></div>
      </div>
    </div>
  );
}
