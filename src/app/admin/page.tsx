import { getDb } from "@/lib/db/client";
import { allTools } from "@/tools/registry";
import {
  Users,
  Wrench,
  BookOpen,
  Package,
} from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  accent?: "primary" | "success" | "warning" | "default";
  note?: string;
}

function StatCard({ label, value, icon, accent = "default", note }: StatCardProps) {
  const accentStyles: Record<string, { bg: string; iconBg: string; iconColor: string }> = {
    primary: {
      bg: "bg-[var(--primary-subtle)]",
      iconBg: "bg-[var(--primary)]",
      iconColor: "text-[var(--primary-foreground)]",
    },
    success: {
      bg: "bg-[var(--success-subtle)]",
      iconBg: "bg-[var(--success)]",
      iconColor: "text-white",
    },
    warning: {
      bg: "bg-[var(--warning-subtle)]",
      iconBg: "bg-[var(--warning)]",
      iconColor: "text-white",
    },
    default: {
      bg: "bg-[var(--surface)]",
      iconBg: "bg-[var(--elevated)]",
      iconColor: "text-[var(--muted-foreground)]",
    },
  };

  const s = accentStyles[accent];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-[var(--border)] p-6 ${s.bg} shadow-sm`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-widest text-[var(--muted-foreground)]">
            {label}
          </p>
          <p className="mt-2 text-4xl font-bold tabular-nums text-[var(--foreground)]">
            {value}
          </p>
          {note && (
            <p className="mt-1.5 text-xs text-[var(--subtle-foreground)]">{note}</p>
          )}
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${s.iconBg} shadow-sm`}
        >
          <span className={s.iconColor}>{icon}</span>
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-3">
      {children}
    </h2>
  );
}

export default async function AdminOverviewPage() {
  const db = await getDb();

  // ── Existing DB queries (preserved exactly) ──────────────────────────────
  const users = db
    ? await db.prepare("SELECT COUNT(*) as c FROM users").first<{ c: number }>()
    : { c: 0 };
  const tools = db
    ? await db.prepare("SELECT COUNT(*) as c FROM tools").first<{ c: number }>()
    : { c: 0 };
  const posts = db
    ? await db.prepare("SELECT COUNT(*) as c FROM blog_posts").first<{ c: number }>()
    : { c: 0 };

  // ── Tool Registry (client-side source of truth) ───────────────────────────
  const registryCount = allTools.length;

  return (
    <div className="max-w-5xl space-y-10">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
          Overview
        </h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Live snapshot of your platform data.
        </p>
      </div>

      {/* ── Platform stats ─────────────────────────────────────────────── */}
      <section>
        <SectionHeading>Platform Stats</SectionHeading>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Registered Users"
            value={users?.c ?? 0}
            icon={<Users className="h-5 w-5" />}
            accent="primary"
            note="From users table"
          />
          <StatCard
            label="Tools (DB)"
            value={tools?.c ?? 0}
            icon={<Wrench className="h-5 w-5" />}
            accent="success"
            note="Metadata rows in tools table"
          />
          <StatCard
            label="Blog Posts"
            value={posts?.c ?? 0}
            icon={<BookOpen className="h-5 w-5" />}
            accent="warning"
            note="From blog_posts table"
          />
        </div>
      </section>

      {/* ── Tool Registry ──────────────────────────────────────────────── */}
      <section>
        <SectionHeading>Tool Registry</SectionHeading>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Registered Tools"
            value={registryCount}
            icon={<Package className="h-5 w-5" />}
            note="Frontend registry — source of truth for runtime"
          />
        </div>

        <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
            <span className="font-semibold text-[var(--foreground)]">
              {registryCount} tools
            </span>{" "}
            are registered in the frontend tool registry (
            <code className="rounded bg-[var(--elevated)] px-1 py-0.5 text-[10px]">
              @/tools/registry
            </code>
            ). The DB&apos;s{" "}
            <span className="font-semibold text-[var(--foreground)]">
              tools
            </span>{" "}
            table ({tools?.c ?? 0} rows) tracks per-tool metadata &amp;
            analytics and is synced separately.
          </p>
        </div>
      </section>
    </div>
  );
}
