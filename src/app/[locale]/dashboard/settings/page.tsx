import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import type { Locale } from "@/lib/i18n";
import SettingsForm from "./settings-form";
import Link from "next/link";
import { Settings, ChevronRight, LayoutDashboard, Heart, Clock } from "lucide-react";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale;
  const c = await cookies();
  const user = await getSessionUser(c.get("nasir_session")?.value);
  if (!user) redirect(`/${l}/login`);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-10 animate-fade-in">
      {/* Breadcrumbs */}
      <nav className="mb-4 flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
        <Link href={`/${l}/dashboard`} className="hover:text-[var(--primary)] transition">Dashboard</Link>
        <ChevronRight size={12} />
        <span className="text-[var(--foreground)]">Settings</span>
      </nav>

      {/* Header & Tabs */}
      <div className="border-b border-[var(--border)] pb-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl text-[var(--foreground)]">
              Account Settings
            </h1>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Manage your profile details, language preference and interface theme.
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
            className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--muted-foreground)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] transition"
          >
            <Clock size={14} />
            Recent Activity
          </Link>
          <Link
            href={`/${l}/dashboard/settings`}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary-subtle)] px-3 py-1.5 text-xs font-medium text-[var(--primary)] transition"
          >
            <Settings size={14} />
            Settings
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="mt-8 max-w-2xl">
        <SettingsForm
          locale={l}
          initial={{
            email: user.email,
            name: user.name,
            locale: user.locale,
            theme: user.theme,
          }}
        />
      </div>
    </div>
  );
}
