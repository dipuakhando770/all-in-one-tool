"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Wrench,
  Layers,
  BookOpen,
  FileText,
  Search,
  ArrowRightLeft,
  BarChart2,
  Settings,
  ClipboardList,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/admin",            label: "Overview",    icon: LayoutDashboard },
  { href: "/admin/users",      label: "Users",       icon: Users           },
  { href: "/admin/tools",      label: "Tools",       icon: Wrench          },
  { href: "/admin/categories", label: "Categories",  icon: Layers          },
  { href: "/admin/blog",       label: "Blog",        icon: BookOpen        },
  { href: "/admin/pages",      label: "Pages",       icon: FileText        },
  { href: "/admin/seo",        label: "SEO",         icon: Search          },
  { href: "/admin/redirects",  label: "Redirects",   icon: ArrowRightLeft  },
  { href: "/admin/analytics",  label: "Analytics",   icon: BarChart2       },
  { href: "/admin/settings",   label: "Settings",    icon: Settings        },
  { href: "/admin/audit",      label: "Audit",       icon: ClipboardList   },
];

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {/* Backdrop (mobile only) */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-30 flex w-64 flex-col",
          "bg-[var(--surface)] border-r border-[var(--border)]",
          "transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:static lg:z-auto lg:flex",
        ].join(" ")}
      >
        {/* Brand */}
        <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-[var(--border)] px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)]">
            <ShieldCheck className="h-4 w-4 text-[var(--primary-foreground)]" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-[var(--foreground)]">
            Admin Panel
          </span>
          {/* Close button visible on mobile */}
          <button
            onClick={onClose}
            className="ml-auto rounded p-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={[
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[var(--primary-subtle)] text-[var(--primary)]"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--elevated)] hover:text-[var(--foreground)]",
                ].join(" ")}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="shrink-0 border-t border-[var(--border)] p-3">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--muted-foreground)] hover:bg-[var(--elevated)] hover:text-[var(--foreground)] transition-colors"
          >
            <ExternalLink className="h-4 w-4 shrink-0" />
            Back to site
          </Link>
        </div>
      </aside>
    </>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top header */}
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-3 border-b border-[var(--border)] bg-[var(--surface)] px-4 lg:px-6">
          {/* Hamburger (mobile) */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-[var(--muted-foreground)] hover:bg-[var(--elevated)] hover:text-[var(--foreground)] lg:hidden transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[var(--primary)] hidden lg:block" />
            <span className="text-sm font-semibold text-[var(--foreground)]">
              Nasir Tools — Admin
            </span>
          </div>

          <div className="ml-auto">
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--muted-foreground)] hover:border-[var(--border-strong)] hover:text-[var(--foreground)] transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Back to site
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

// ─── Server wrapper (auth guard) ──────────────────────────────────────────────
// The actual auth guard runs server-side in a separate RSC wrapper.
// We re-export via the default that Next.js calls for the layout segment.
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { isAdmin } from "@/lib/auth/rbac";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const c = await cookies();
  const user = await getSessionUser(c.get("nasir_session")?.value);
  if (!user || !isAdmin(user.roles)) redirect("/en/login");

  return <AdminShell>{children}</AdminShell>;
}
