import { getDb } from "@/lib/db/client";
import { categories as defaultCategories } from "@/lib/categories";
import { Layers } from "lucide-react";

export default async function AdminCategoriesPage() {
  const db = await getDb();
  const res = db
    ? await db
        .prepare("SELECT id,slug,icon,color,sort_order FROM categories ORDER BY sort_order")
        .all()
    : { results: [] };
  const cats = (res.results ?? []) as {
    id: string;
    slug: string;
    icon: string | null;
    color: string | null;
    sort_order: number;
  }[];

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Category Management</h1>
          <p className="text-xs text-[var(--muted-foreground)]">
            Taxonomy structure for tool grouping, discovery hubs and SEO organization.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[var(--primary-subtle)] px-3 py-1 text-xs font-semibold text-[var(--primary)]">
            Default: {defaultCategories.length} categories
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted-foreground)]">
                <th className="p-3.5 font-semibold">Slug</th>
                <th className="p-3.5 font-semibold">Icon</th>
                <th className="p-3.5 font-semibold">Color Token</th>
                <th className="p-3.5 font-semibold">Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {cats.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-xs text-[var(--muted-foreground)]">
                    No custom DB categories seeded. System is serving {defaultCategories.length} categories from standard configuration.
                  </td>
                </tr>
              ) : (
                cats.map((c) => (
                  <tr key={c.id} className="hover:bg-[var(--surface-2)]/50 transition">
                    <td className="p-3.5 font-mono font-medium text-[var(--foreground)]">{c.slug}</td>
                    <td className="p-3.5 text-xs text-[var(--muted-foreground)]">{c.icon || "—"}</td>
                    <td className="p-3.5 text-xs text-[var(--muted-foreground)]">{c.color || "—"}</td>
                    <td className="p-3.5 text-xs text-[var(--subtle-foreground)]">{c.sort_order}</td>
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
