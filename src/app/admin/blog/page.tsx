import { getDb } from "@/lib/db/client";
import { BookOpen, CheckCircle2, FileEdit } from "lucide-react";

export default async function AdminBlogPage() {
  const db = await getDb();
  const res = db
    ? await db
        .prepare("SELECT id,slug,status,published_at,created_at FROM blog_posts ORDER BY created_at DESC")
        .all()
    : { results: [] };
  const posts = (res.results ?? []) as {
    id: string;
    slug: string;
    status: string;
    published_at: string | null;
    created_at: string;
  }[];

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Blog CMS & Content</h1>
          <p className="text-xs text-[var(--muted-foreground)]">
            Manage tutorials, guides and updates published to the public content hub.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[var(--primary-subtle)] px-3 py-1 text-xs font-semibold text-[var(--primary)]">
            Articles: {posts.length}
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted-foreground)]">
                <th className="p-3.5 font-semibold">Post Slug</th>
                <th className="p-3.5 font-semibold">Publish Status</th>
                <th className="p-3.5 font-semibold">Publication Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-xs text-[var(--muted-foreground)]">
                    No articles created yet in the database.
                  </td>
                </tr>
              ) : (
                posts.map((p) => (
                  <tr key={p.id} className="hover:bg-[var(--surface-2)]/50 transition">
                    <td className="p-3.5 font-mono font-medium text-[var(--foreground)]">{p.slug}</td>
                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          p.status === "published"
                            ? "bg-[var(--success-subtle)] text-[var(--success)]"
                            : "bg-[var(--warning-subtle)] text-[var(--warning)]"
                        }`}
                      >
                        {p.status === "published" ? <CheckCircle2 size={11} /> : <FileEdit size={11} />}
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-xs text-[var(--subtle-foreground)]">
                      {p.published_at ? new Date(p.published_at).toLocaleDateString() : "Draft (Unscheduled)"}
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
