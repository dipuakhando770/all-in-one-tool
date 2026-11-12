"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { usePathname } from "next/navigation";
import { locales, localeNames, type Locale, type Dictionary } from "@/lib/i18n";
import { useTheme } from "@/components/theme-provider";
import {
  Sun,
  Moon,
  Monitor,
  Menu,
  X,
  Search,
  ChevronDown,
  Layers,
  Star,
  LayoutGrid,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";

/**
 * Open the global command palette from anywhere.
 * The palette provider listens for this event.
 */
function openSearch() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("nasir:open-search"));
  }
}

const navLinks = (locale: string, dict: Dictionary) => [
  { href: `/${locale}/tools`, label: dict.nav.allTools, icon: LayoutGrid },
  { href: `/${locale}/categories`, label: dict.nav.categories, icon: Layers },
  { href: `/${locale}/popular`, label: dict.nav.popular, icon: Star },
  { href: `/${locale}/blog`, label: dict.nav.blog, icon: Sparkles },
];

export function Header({
  locale,
  dict,
  toolCount,
}: {
  locale: Locale;
  dict: Dictionary;
  toolCount: number;
}) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }
  const langRef = useRef<HTMLDivElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    mobileButtonRef.current?.focus();
  }, []);

  // Close language dropdown on outside click / Escape
  useEffect(() => {
    function onPointer(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // Lock scroll + Escape handling while the mobile menu is open
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeMobile();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen, closeMobile]);

  // Avoid layout flashes during hydration
  useLayoutEffect(() => {
    if (!mobileOpen) return;
    const id = requestAnimationFrame(() => {
      document.getElementById("mobile-nav-first")?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [mobileOpen]);

  const switchLocale = (l: Locale) => {
    const parts = pathname.split("/");
    parts[1] = l;
    return parts.join("/") || `/${l}`;
  };

  const cycleTheme = () =>
    setTheme(theme === "dark" ? "light" : theme === "light" ? "system" : "dark");

  const themeLabel =
    theme === "dark"
      ? locale === "bn"
        ? "ডার্ক"
        : "Dark"
      : theme === "light"
        ? locale === "bn"
          ? "লাইট"
          : "Light"
        : locale === "bn"
          ? "সিস্টেম"
          : "System";

  const ThemeIcon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: "color-mix(in srgb, var(--background) 85%, transparent)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:rounded-lg focus:bg-[var(--primary)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--primary-foreground)]"
      >
        {locale === "bn" ? "মূল কনটেন্টে যান" : "Skip to main content"}
      </a>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 md:px-6">
        {/* Left: Logo */}
        <div className="flex min-w-0 items-center gap-3">
          <BrandLogo locale={locale} compact />
          <span className="hidden rounded-full border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 text-[10px] font-medium tabular-nums text-[var(--muted-foreground)] xl:inline-block">
            {toolCount} {dict.ui.tools}
          </span>
        </div>

        {/* Center: Navigation (desktop) */}
        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label={locale === "bn" ? "প্রধান নেভিগেশন" : "Main navigation"}
        >
          {navLinks(locale, dict).map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
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
        <div className="flex shrink-0 items-center gap-1">
          {/* Search trigger */}
          <button
            type="button"
            onClick={openSearch}
            className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-[var(--muted-foreground)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] sm:px-3"
            aria-label={dict.ui.searchTools}
          >
            <Search size={16} aria-hidden="true" />
            <span className="hidden items-center gap-2 lg:flex">
              <span className="text-xs">{dict.ui.search}</span>
              <kbd className="hidden items-center rounded border border-[var(--border)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--subtle-foreground)] xl:inline-flex">
                ⌘K
              </kbd>
            </span>
          </button>

          {/* Language switcher (desktop) */}
          <div className="relative hidden md:block" ref={langRef}>
            <button
              type="button"
              onClick={() => setLangOpen((v) => !v)}
              className="flex items-center gap-1 rounded-lg px-2.5 py-2 text-sm text-[var(--muted-foreground)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
              aria-label={dict.nav.language}
              aria-haspopup="menu"
              aria-expanded={langOpen}
            >
              <span className="text-xs font-semibold">{locale.toUpperCase()}</span>
              <ChevronDown
                size={12}
                aria-hidden="true"
                className={`transition-transform ${langOpen ? "rotate-180" : ""}`}
              />
            </button>
            {langOpen && (
              <div
                className="absolute right-0 top-full z-50 mt-1 w-40 rounded-xl border border-[var(--border)] bg-[var(--surface)] py-1 shadow-lg"
                role="menu"
                aria-label={dict.nav.language}
              >
                {locales.map((l) => (
                  <Link
                    key={l}
                    href={switchLocale(l)}
                    role="menuitem"
                    hrefLang={l}
                    lang={l}
                    aria-current={l === locale ? "true" : undefined}
                    onClick={() => setLangOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                      l === locale
                        ? "font-medium text-[var(--primary)]"
                        : "text-[var(--muted-foreground)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    <span aria-hidden="true">{l === "en" ? "🇺🇸" : "🇧🇩"}</span>
                    {localeNames[l]}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={cycleTheme}
            className="rounded-lg p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
            aria-label={`${dict.nav.theme}: ${themeLabel}`}
            title={`${dict.nav.theme}: ${themeLabel}`}
          >
            <ThemeIcon size={16} aria-hidden="true" />
          </button>

          {/* Auth links (desktop) */}
          <div className="ml-1 hidden items-center gap-2 md:flex">
            <Link
              href={`/${locale}/login`}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--muted-foreground)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
            >
              {dict.nav.login}
            </Link>
            <Link
              href={`/${locale}/register`}
              className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)] transition-colors hover:bg-[var(--primary-hover)]"
            >
              {dict.nav.register}
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            ref={mobileButtonRef}
            type="button"
            className="ml-1 rounded-lg p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--surface-2)] md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={
              mobileOpen
                ? locale === "bn"
                  ? "মেনু বন্ধ করুন"
                  : "Close menu"
                : locale === "bn"
                  ? "মেনু খুলুন"
                  : "Open menu"
            }
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            {mobileOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileOpen && (
        <div
          id="mobile-nav"
          className="max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-t border-[var(--border)] bg-[var(--surface)] md:hidden"
        >
          <nav
            className="flex flex-col gap-1 px-4 py-3"
            aria-label={locale === "bn" ? "মোবাইল নেভিগেশন" : "Mobile navigation"}
          >
            {navLinks(locale, dict).map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                aria-current={isActive(href) ? "page" : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive(href)
                    ? "bg-[var(--primary-subtle)] text-[var(--primary)]"
                    : "text-[var(--foreground)] hover:bg-[var(--surface-2)]"
                }`}
              >
                <Icon size={16} aria-hidden="true" />
                {label}
              </Link>
            ))}

            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                openSearch();
              }}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--surface-2)]"
            >
              <Search size={16} aria-hidden="true" />
              {dict.ui.searchTools}
            </button>

            <div className="mt-3 flex flex-col gap-3 border-t border-[var(--border)] pt-3">
              <div className="flex items-center gap-2" role="group" aria-label={dict.nav.language}>
                {locales.map((l) => (
                  <Link
                    key={l}
                    href={switchLocale(l)}
                    hrefLang={l}
                    lang={l}
                    className={`flex-1 rounded-lg px-3 py-1.5 text-center text-sm font-medium transition-colors ${
                      l === locale
                        ? "bg-[var(--primary-subtle)] text-[var(--primary)]"
                        : "border border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--surface-2)]"
                    }`}
                  >
                    {localeNames[l]}
                  </Link>
                ))}
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/${locale}/login`}
                  className="flex-1 rounded-lg border border-[var(--border)] px-4 py-2 text-center text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--surface-2)]"
                >
                  {dict.nav.login}
                </Link>
                <Link
                  href={`/${locale}/register`}
                  className="flex-1 rounded-lg bg-[var(--primary)] px-4 py-2 text-center text-sm font-semibold text-[var(--primary-foreground)] transition-colors hover:bg-[var(--primary-hover)]"
                >
                  {dict.nav.register}
                </Link>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export function Footer({
  locale,
  dict,
  toolCount,
}: {
  locale: Locale;
  dict: Dictionary;
  toolCount: number;
}) {
  const year = new Date().getFullYear();

  const columns = [
    {
      title: locale === "bn" ? "টুল" : "Tools",
      links: [
        { href: `/${locale}/tools`, label: dict.footer.allTools },
        { href: `/${locale}/popular`, label: dict.footer.popularTools },
        { href: `/${locale}/categories`, label: dict.footer.categories },
        { href: `/${locale}/directory`, label: locale === "bn" ? "A–Z ডিরেক্টরি" : "A–Z Directory" },
      ],
    },
    {
      title: locale === "bn" ? "রিসোর্স" : "Resources",
      links: [
        { href: `/${locale}/blog`, label: dict.footer.blog },
        { href: `/${locale}/pricing`, label: locale === "bn" ? "প্রাইসিং" : "Pricing" },
        { href: `/${locale}/dashboard`, label: dict.nav.dashboard },
        { href: `/${locale}/search`, label: dict.ui.searchTools },
      ],
    },
    {
      title: locale === "bn" ? "লিগ্যাল" : "Legal",
      links: [
        { href: `/${locale}/privacy`, label: dict.footer.privacy },
        { href: `/${locale}/terms`, label: dict.footer.terms },
      ],
    },
  ];

  const trust = [dict.ui.noAccountNeeded, dict.ui.browserProcessing, dict.ui.trusted];

  return (
    <footer
      className="mt-auto border-t border-[var(--border)] bg-[var(--surface)]"
      role="contentinfo"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <BrandLogo locale={locale} />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--muted-foreground)]">
              {dict.footer.tagline}{" "}
              {locale === "bn"
                ? `${toolCount}+ ফ্রি টুল — ছবি, PDF, টেক্সট, ক্যালকুলেটর ও আরও অনেক কিছু।`
                : `${toolCount}+ free tools for images, PDFs, text, calculations and more.`}
            </p>
            <ul className="mt-5 flex flex-col gap-2">
              {trust.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]"
                >
                  <ShieldCheck size={13} className="shrink-0 text-[var(--success)]" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Link columns */}
          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="text-sm font-semibold text-[var(--foreground)]">{column.title}</h2>
              <ul className="mt-4 space-y-2.5">
                {column.links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--primary)]"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-[var(--border)] pt-8 text-xs text-[var(--muted-foreground)] md:flex-row">
          <p>
            © {year} Nasir Tools.{" "}
            {locale === "bn" ? "সর্বস্বত্ব সংরক্ষিত।" : "All rights reserved."}
          </p>
          <p>
            {locale === "bn" ? (
              <>
                <span aria-hidden="true">♥</span> দিয়ে তৈরি — সবার জন্য
              </>
            ) : (
              <>
                Made with <span aria-hidden="true">♥</span> for the web
              </>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
