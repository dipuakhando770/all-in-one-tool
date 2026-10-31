import { getDb } from "@/lib/db/client";

export default async function AdminBlogPage() {
  const db = await getDb();
  const res = db ? await db.prepare("SELECT id,slug,status,published_at,created_at FROM blog_posts ORDER BY created_at DESC").all() : { results: [] };
  const posts = res.results ?? [];
  return (
    <div>
      <h1 className="text-2xl font-bold">Blog CMS</h1>
      <table className="mt-4 w-full text-sm border border-[var(--border)]">
        <thead><tr className="bg-[var(--muted)]"><th className="p-2 text-left">Slug</th><th className="p-2">Status</th><th className="p-2">Published</th></tr></thead>
        <tbody>
          {posts.length === 0 && <tr><td colSpan={3} className="p-2 text-[var(--foreground)]/60">No posts yet.</td></tr>}
          {posts.map((p: any) => (
            <tr key={p.id} className="border-t border-[var(--border)]"><td className="p-2">{p.slug}</td><td className="p-2">{p.status}</td><td className="p-2">{p.published_at}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
