"use client";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";
import { useTheme } from "@/components/theme-provider";
import {
  Sun, Moon, Monitor, Menu, X, Search, ChevronDown,
  Zap, Layers, Star, LayoutGrid, Sparkles,
} from "lucide-react";
import { useState, useRef, useEffect, useLayoutEffect } from "react";

// Shared dictionary shape used by Header and Footer navigation/footer labels.
export interface HeaderDict {
  nav: { login: string; register: string };
  footer: { tagline: string };
}

const navLinks = (locale: string) => [
  { href: `/${locale}/tools`, label: "All Tools", icon: LayoutGrid },
  { href: `/${locale}/categories`, label: "Categories", icon: Layers },
  { href: `/${locale}/popular`, label: "Popular", icon: Star },
  { href: `/${locale}/pricing`, label: "Pricing", icon: Sparkles },
  { href: `/${locale}/blog`, label: "Blog", icon: Zap },
];

export function Header({ locale, dict }: { locale: Locale; dict: HeaderDict }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  // Close lang dropdown on outside click
  useLayoutEffect(() => {
    function handler(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on route change - defer to next tick
  useLayoutEffect(() => {
    if (mobileOpen) {
      requestAnimationFrame(() => setMobileOpen(false));
    }
  }, [pathname, mobileOpen]);

  const switchLocale = (l: Locale) => {
    const parts = pathname.split("/");
    parts[1] = l;
    return parts.join("/") || `/${l}`;
  };

  const cycleTheme = () => {
    setTheme(theme === "dark" ? "light" : theme === "light" ? "system" : "dark");
  };

  const ThemeIcon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <header
        className="sticky top-0 z-50"
        style={{
          background: "color-mix(in srgb, var(--background) 85%, transparent)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6"
        >
          {/* Left: Logo */}
          <BrandLogo locale={locale} compact />

          {/* Center: Navigation (desktop) */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            {navLinks(locale).map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(href)
                    ? "bg-[var(--primary-subtle)] text-[var(--primary)]"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <Link
              href={`/${locale}/search`}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--muted-foreground)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] transition-colors"
              aria-label="Search tools"
            >
              <Search size={15} />
              <span className="hidden lg:flex items-center gap-2">
                <span className="text-xs">Search</span>
                <kbd className="hidden xl:inline-flex items-center rounded border border-[var(--border)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--subtle-foreground)]">
                  ⌘K
                </kbd>
              </span>
            </Link>

            {/* Language switcher (desktop) */}
            <div className="relative hidden md:block" ref={langRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-[var(--muted-foreground)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] transition-colors"
                aria-label="Switch language"
                aria-expanded={langOpen}
              >
                <span className="text-xs font-medium">{locale.toUpperCase()}</span>
                <ChevronDown size={12} className={`transition-transform ${langOpen ? "rotate-180" : ""}`} />
              </button>
              {langOpen && (
                <div
                  className="absolute right-0 top-full mt-1 w-24 rounded-xl border border-[var(--border)] py-1 shadow-lg"
                  style={{ background: "var(--surface)" }}
                  role="menu"
                >
                  {locales.map((l) => (
                    <Link
                      key={l}
                      href={switchLocale(l)}
                      role="menuitem"
                      onClick={() => setLangOpen(false)}
                      className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                        l === locale
                          ? "text-[var(--primary)] font-medium"
                          : "text-[var(--muted-foreground)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      {l === "en" ? "🇺🇸" : "🇧🇩"} {l.toUpperCase()}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Theme toggle */}
            <button
              onClick={cycleTheme}
              className="rounded-lg p-2 text-[var(--muted-foreground)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] transition-colors"
              aria-label={`Theme: ${theme}. Click to change.`}
            >
              <ThemeIcon size={16} />
            </button>

            {/* Auth links (desktop) */}
            <div className="hidden items-center gap-2 md:flex ml-2">
              <Link
                href={`/${locale}/login`}
                className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] transition-colors"
              >
                {dict.nav.login}
              </Link>
              <Link
                href={`/${locale}/register`}
                className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90"
                style={{ background: "var(--primary)" }}
              >
                {dict.nav.register}
              </Link>
            </div>

            {/* Mobile menu toggle */}
            <button
              className="rounded-lg p-2 text-[var(--muted-foreground)] hover:bg-[var(--surface-2)] transition-colors md:hidden ml-1"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        {mobileOpen && (
          <div
            className="border-t border-[var(--border)] md:hidden"
            style={{ background: "var(--surface)" }}
          >
            <nav className="flex flex-col px-4 py-3 gap-1" aria-label="Mobile navigation">
              {navLinks(locale).map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive(href)
                      ? "bg-[var(--primary-subtle)] text-[var(--primary)]"
                      : "text-[var(--foreground)] hover:bg-[var(--surface-2)]"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              ))}

              {/* Mobile language + auth */}
              <div className="mt-3 flex flex-col gap-2 border-t border-[var(--border)] pt-3">
                <div className="flex gap-2">
                  {locales.map((l) => (
                    <Link
                      key={l}
                      href={switchLocale(l)}
                      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                        l === locale
                          ? "bg-[var(--primary-subtle)] text-[var(--primary)]"
                          : "border border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--surface-2)]"
                      }`}
                    >
                      {l === "en" ? "🇺🇸" : "🇧🇩"} {l.toUpperCase()}
                    </Link>
                  ))}
                </div>
                <div className="flex gap-2 pt-1">
                  <Link
                    href={`/${locale}/login`}
                    className="flex-1 rounded-lg border border-[var(--border)] px-4 py-2 text-center text-sm font-medium text-[var(--foreground)] hover:bg-[var(--surface-2)] transition-colors"
                  >
                    {dict.nav.login}
                  </Link>
                  <Link
                    href={`/${locale}/register`}
                    className="flex-1 rounded-lg px-4 py-2 text-center text-sm font-medium text-white transition-all hover:opacity-90"
                    style={{ background: "var(--primary)" }}
                  >
                    {dict.nav.register}
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

export function Footer({ locale, dict }: { locale: Locale; dict: HeaderDict }) {
  const year = new Date().getFullYear();

  const toolsLinks = [
    { href: `/${locale}/tools`, label: "All Tools" },
    { href: `/${locale}/popular`, label: "Popular Tools" },
    { href: `/${locale}/categories`, label: "Categories" },
    { href: `/${locale}/search`, label: "Search" },
  ];

  const resourceLinks = [
    { href: `/${locale}/pricing`, label: "Pricing & Plans" },
    { href: `/${locale}/blog`, label: "Blog & Guides" },
    { href: `/${locale}/directory`, label: "A–Z Directory" },
    { href: `/${locale}/dashboard`, label: "User Dashboard" },
  ];

  const legalLinks = [
    { href: `/${locale}/privacy`, label: "Privacy Policy" },
    { href: `/${locale}/terms`, label: "Terms of Service" },
  ];

  return (
    <footer
      className="border-t mt-auto"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      role="contentinfo"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:py-16">
        <div className="grid gap-10 md:grid-cols-5">
          {/* Brand */}
          <div className="md:col-span-2">
            <BrandLogo locale={locale} />
            <p className="mt-4 max-w-xs text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
              {dict.footer.tagline} 161+ free tools for images, PDFs, text, calculations and more.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                style={{ background: "var(--success-subtle)", color: "var(--success)" }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                All systems operational
              </span>
            </div>
          </div>

          {/* Tools */}
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Tools</p>
            <ul className="mt-4 space-y-2.5">
              {toolsLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm transition-colors hover:text-[var(--primary)]"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Resources</p>
            <ul className="mt-4 space-y-2.5">
              {resourceLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm transition-colors hover:text-[var(--primary)]"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Legal</p>
            <ul className="mt-4 space-y-2.5">
              {legalLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm transition-colors hover:text-[var(--primary)]"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-8 text-xs md:flex-row"
          style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
        >
          <p>© {year} Nasir Tools. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <span style={{ color: "var(--error)" }}>♥</span> for the web
          </p>
        </div>
      </div>
    </footer>
  );
}
