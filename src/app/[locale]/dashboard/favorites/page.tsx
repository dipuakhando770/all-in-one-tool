import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";
import { getToolBySlug } from "@/tools/registry";
import { ToolCard } from "@/components/tool-card";
import type { Locale } from "@/lib/i18n";
import Link from "next/link";
import { Heart, ChevronRight, LayoutDashboard, Clock, Settings, Search } from "lucide-react";

export default async function FavoritesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale;
  const c = await cookies();
  const user = await getSessionUser(c.get("nasir_session")?.value);
  if (!user) redirect(`/${l}/login`);

  const db = await getDb();
  const res = db
    ? await db
        .prepare("SELECT tool_slug, created_at FROM favorites WHERE user_id=? ORDER BY created_at DESC")
        .bind(user.id)
        .all()
    : { results: [] };
  const favs = (res.results ?? []) as { tool_slug: string; created_at: string }[];

  const favoriteTools = favs
    .map((f) => ({
      ...f,
      tool: getToolBySlug(f.tool_slug),
    }))
    .filter((f) => f.tool !== undefined);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-10 animate-fade-in">
      {/* Breadcrumbs */}
      <nav className="mb-4 flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
        <Link href={`/${l}/dashboard`} className="hover:text-[var(--primary)] transition">Dashboard</Link>
        <ChevronRight size={12} />
        <span className="text-[var(--foreground)]">Favorites</span>
      </nav>

      {/* Header & Tabs */}
      <div className="border-b border-[var(--border)] pb-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl text-[var(--foreground)]">
              Favorite Tools
            </h1>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Quick access to the utilities you use and love the most.
            </p>
          </div>
          <Link
            href={`/${l}/search`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-90 transition"
          >
            <Search size={14} />
            Find More Tools
          </Link>
        </div>

        {/* Dashboard Nav Tabs */}
        <div className="mt-6 flex gap-2">
          <Link
            href={`/${l}/dashboard`}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--muted-foreground)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] transition"
          >
            <LayoutDashboard size={14} />
            Overview
          </Link>
          <Link
            href={`/${l}/dashboard/favorites`}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary-subtle)] px-3 py-1.5 text-xs font-medium text-[var(--primary)] transition"
          >
            <Heart size={14} />
            Favorites ({favoriteTools.length})
          </Link>
          <Link
            href={`/${l}/dashboard/recent`}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--muted-foreground)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] transition"
          >
            <Clock size={14} />
            Recent Activity
          </Link>
          <Link
            href={`/${l}/dashboard/settings`}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--muted-foreground)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] transition"
          >
            <Settings size={14} />
            Settings
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="mt-8">
        {favoriteTools.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteTools.map((fav) => (
              <ToolCard key={fav.tool_slug} tool={fav.tool!} locale={l} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--error-subtle)] text-[var(--error)]">
              <Heart size={26} />
            </div>
            <h3 className="text-base font-semibold text-[var(--foreground)]">No favorites saved yet</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-[var(--muted-foreground)]">
              When you find a tool you use often, add it to your favorites for lightning-fast access right from here.
            </p>
            <Link
              href={`/${l}/tools`}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:opacity-90 transition"
            >
              Browse All Tools
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
