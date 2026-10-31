"use client";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";
import { useTheme } from "@/components/theme-provider";
import { Sun, Moon, Monitor, Menu, X, Search } from "lucide-react";
import { useState } from "react";

export function Header({ locale, dict }: { locale: Locale; dict: any }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const switchLocale = (l: Locale) => {
    const parts = pathname.split("/");
    parts[1] = l;
    return parts.join("/") || `/${l}`;
  };
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <BrandLogo locale={locale} compact />
        <nav className="hidden items-center gap-6 md:flex">
          <Link href={`/${locale}`}>{dict.nav.home}</Link>
          <Link href={`/${locale}/tools`}>{dict.nav.allTools}</Link>
          <Link href={`/${locale}/categories`}>{dict.nav.categories}</Link>
          <Link href={`/${locale}/popular`}>{dict.nav.popular}</Link>
          <Link href={`/${locale}/blog`}>{dict.nav.blog}</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href={`/${locale}/search`} className="rounded-lg p-2 hover:bg-[var(--muted)]" aria-label="search"><Search size={18} /></Link>
          <div className="hidden gap-1 md:flex">
            {locales.map((l) => (
              <Link key={l} href={switchLocale(l)} className={`rounded px-2 py-1 text-sm ${l === locale ? "bg-[var(--accent)] text-white" : "hover:bg-[var(--muted)]"}`}>
                {l.toUpperCase()}
              </Link>
            ))}
          </div>
          <button onClick={() => setTheme(theme === "dark" ? "light" : theme === "light" ? "system" : "dark")} className="rounded-lg p-2 hover:bg-[var(--muted)]" aria-label="theme">
            {theme === "dark" ? <Moon size={18} /> : theme === "light" ? <Sun size={18} /> : <Monitor size={18} />}
          </button>
          <button className="md:hidden rounded-lg p-2 hover:bg-[var(--muted)]" onClick={() => setOpen(!open)} aria-label="menu">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-[var(--border)] md:hidden">
          <nav className="flex flex-col gap-2 px-4 py-3">
            <Link href={`/${locale}`} onClick={() => setOpen(false)}>{dict.nav.home}</Link>
            <Link href={`/${locale}/tools`} onClick={() => setOpen(false)}>{dict.nav.allTools}</Link>
            <Link href={`/${locale}/categories`} onClick={() => setOpen(false)}>{dict.nav.categories}</Link>
            <Link href={`/${locale}/popular`} onClick={() => setOpen(false)}>{dict.nav.popular}</Link>
            <Link href={`/${locale}/blog`} onClick={() => setOpen(false)}>{dict.nav.blog}</Link>
            <div className="flex gap-2 pt-2">
              {locales.map((l) => (
                <Link key={l} href={switchLocale(l)} className={`rounded px-2 py-1 text-sm ${l === locale ? "bg-[var(--accent)] text-white" : "hover:bg-[var(--muted)]"}`}>
                  {l.toUpperCase()}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export function Footer({ locale, dict }: { locale: Locale; dict: any }) {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--muted)]">
      <div className="mx-auto max-w-7xl px-4 py-10 text-sm">
        <div className="grid gap-6 md:grid-cols-4">
          <div>
            <div className="font-bold text-lg">Nasir Tools</div>
            <p className="mt-2 text-[var(--foreground)]/70">{dict.footer.tagline}</p>
          </div>
          <div>
            <div className="font-semibold">{dict.nav.allTools}</div>
            <ul className="mt-2 space-y-1">
              <li><Link href={`/${locale}/tools`}>{dict.footer.allTools}</Link></li>
              <li><Link href={`/${locale}/categories`}>{dict.footer.categories}</Link></li>
              <li><Link href={`/${locale}/popular`}>{dict.footer.popularTools}</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold">{dict.nav.blog}</div>
            <ul className="mt-2 space-y-1">
              <li><Link href={`/${locale}/blog`}>{dict.footer.blog}</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold">Legal</div>
            <ul className="mt-2 space-y-1">
              <li><Link href={`/${locale}/privacy`}>Privacy</Link></li>
              <li><Link href={`/${locale}/terms`}>Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-[var(--border)] pt-4 text-center text-[var(--foreground)]/60">
          © 2026 Nasir Tools. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
