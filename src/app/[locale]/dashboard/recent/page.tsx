import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";
import { getToolBySlug } from "@/tools/registry";
import type { Locale } from "@/lib/i18n";
import Link from "next/link";
import { Clock, ChevronRight, LayoutDashboard, Heart, Settings, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import * as Icons from "lucide-react";
import { getToolIcon } from "@/lib/icons";

export default async function RecentPage({
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
        .prepare("SELECT tool_slug, success, created_at FROM tool_usage WHERE user_id=? ORDER BY created_at DESC LIMIT 50")
        .bind(user.id)
        .all()
    : { results: [] };
  const rows = (res.results ?? []) as { tool_slug: string; success: number; created_at: string }[];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-10 animate-fade-in">
      {/* Breadcrumbs */}
      <nav className="mb-4 flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
        <Link href={`/${l}/dashboard`} className="hover:text-[var(--primary)] transition">Dashboard</Link>
        <ChevronRight size={12} />
        <span className="text-[var(--foreground)]">Recent Activity</span>
      </nav>

      {/* Header & Tabs */}
      <div className="border-b border-[var(--border)] pb-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl text-[var(--foreground)]">
              Recent Activity
            </h1>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Audit log of tools you have executed and their status.
            </p>
          </div>
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
            className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--muted-foreground)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] transition"
          >
            <Heart size={14} />
            Favorites
          </Link>
          <Link
            href={`/${l}/dashboard/recent`}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary-subtle)] px-3 py-1.5 text-xs font-medium text-[var(--primary)] transition"
          >
            <Clock size={14} />
            Recent Activity ({rows.length})
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
        {rows.length > 0 ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] divide-y divide-[var(--border)] overflow-hidden">
            {rows.map((r, i) => {
              const tool = getToolBySlug(r.tool_slug);
              const iconName = tool ? getToolIcon(tool.slug, tool.icon) : "Wrench";
              const Icon = (Icons as any)[iconName] || Icons.Wrench;

              return (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 transition hover:bg-[var(--surface-2)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-2)] text-[var(--primary)]">
                      <Icon size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/${l}/tools/${r.tool_slug}`}
                          className="text-sm font-semibold text-[var(--foreground)] hover:text-[var(--primary)] transition"
                        >
                          {tool ? tool.name[l] || tool.name.en : r.tool_slug}
                        </Link>
                        {r.success ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--success-subtle)] px-2 py-0.5 text-[10px] font-semibold text-[var(--success)]">
                            <CheckCircle2 size={10} />
                            Success
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--error-subtle)] px-2 py-0.5 text-[10px] font-semibold text-[var(--error)]">
                            <AlertCircle size={10} />
                            Failed
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {tool ? tool.description[l] || tool.description.en : `Slug: ${r.tool_slug}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs text-[var(--subtle-foreground)]">
                      {new Date(r.created_at).toLocaleString()}
                    </span>
                    <Link
                      href={`/${l}/tools/${r.tool_slug}`}
                      className="rounded-lg p-1.5 text-[var(--muted-foreground)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] transition"
                      title="Open Tool"
                    >
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface-2)] text-[var(--muted-foreground)]">
              <Clock size={26} />
            </div>
            <h3 className="text-base font-semibold text-[var(--foreground)]">No activity recorded yet</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-[var(--muted-foreground)]">
              As you run image tools, PDF processors, or calculators, your recent runs will be tracked here.
            </p>
            <Link
              href={`/${l}/tools`}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:opacity-90 transition"
            >
              Start Using Tools
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
