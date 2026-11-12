"use client";
import { useState, useLayoutEffect, useRef, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, Clock, Sparkles, CornerDownLeft } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import * as Icons from "lucide-react";
import { getToolIcon } from "@/lib/icons";
import Link from "next/link";
import { searchToolIndex, type ToolIndexEntry } from "@/lib/tool-discovery";

const MAX_RESULTS = 8;
const MAX_RECENT = 5;
const RECENT_KEY = "nasir_recent_searches";

const strings = {
  en: {
    placeholder: "Search 160+ tools — image compressor, PDF merger, JSON…",
    tools: "Tools",
    recent: "Recent searches",
    clear: "Clear search",
    noResults: "No tools found for",
    tryDifferent: "Try a different keyword or",
    searchAll: "search all tools",
    startTyping: "Start typing to search every tool",
    navigate: "Navigate",
    open: "Open",
    close: "Close",
    allResults: "See all results",
  },
  bn: {
    placeholder: "১৬০+ টুল খুঁজুন — ইমেজ কম্প্রেস, PDF মার্জ, JSON…",
    tools: "টুল",
    recent: "সাম্প্রতিক অনুসন্ধান",
    clear: "অনুসন্ধান মুছুন",
    noResults: "কোনো টুল পাওয়া যায়নি:",
    tryDifferent: "অন্য কীওয়ার্ড চেষ্টা করুন অথবা",
    searchAll: "সব টুলে খুঁজুন",
    startTyping: "সব টুল খুঁজতে লেখা শুরু করুন",
    navigate: "চলাচল",
    open: "খুলুন",
    close: "বন্ধ",
    allResults: "সব ফলাফল দেখুন",
  },
} satisfies Record<Locale, Record<string, string>>;

function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(q: string) {
  if (typeof window === "undefined" || !q.trim()) return;
  try {
    const existing = getRecentSearches();
    const updated = [q.trim(), ...existing.filter((s) => s !== q.trim())].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  } catch {}
}

interface CommandPaletteProps {
  locale: Locale;
  tools: ToolIndexEntry[];
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ locale, tools, isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const t = strings[locale];

  useLayoutEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        setQuery("");
        setSelected(0);
        setRecent(getRecentSearches());
        inputRef.current?.focus();
      });
    }
  }, [isOpen]);

  // Lock background scroll while the palette is open.
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  const results = useMemo(
    () => (query.trim() ? searchToolIndex(tools, query).slice(0, MAX_RESULTS) : []),
    [query, tools]
  );

  const navigate = useCallback(
    (slug: string) => {
      saveRecentSearch(query);
      router.push(`/${locale}/tools/${slug}`);
      onClose();
    },
    [locale, query, router, onClose]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => (results.length ? Math.min(s + 1, results.length - 1) : 0));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (results[selected]) navigate(results[selected].slug);
      else if (query.trim()) {
        router.push(`/${locale}/search?q=${encodeURIComponent(query.trim())}`);
        onClose();
      }
    }
    if (e.key === "Tab" && panelRef.current) {
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="cmd-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={t.placeholder}
    >
      <div ref={panelRef} className="cmd-panel mx-4 flex w-full flex-col">
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-3">
          <Search size={16} className="shrink-0 text-[var(--muted-foreground)]" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder={t.placeholder}
            className="flex-1 bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--subtle-foreground)]"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="cmd-results"
            aria-activedescendant={results[selected] ? `cmd-option-${results[selected].slug}` : undefined}
            aria-label={t.placeholder}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="rounded p-1 transition-colors hover:bg-[var(--surface-2)]"
              aria-label={t.clear}
            >
              <X size={14} className="text-[var(--muted-foreground)]" />
            </button>
          )}
          <kbd className="hidden rounded border border-[var(--border)] px-1.5 py-0.5 text-xs text-[var(--subtle-foreground)] sm:inline-flex">
            Esc
          </kbd>
        </div>

        {/* Results */}
        <div id="cmd-results" className="max-h-[420px] overflow-y-auto py-2" role="listbox" aria-label={t.tools}>
          {results.length > 0 && (
            <div>
              <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--subtle-foreground)]">
                {t.tools}
              </p>
              {results.map((tool, i) => {
                const iconName = getToolIcon(tool.slug, tool.icon);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const Icon = (Icons as any)[iconName] || Icons.Wrench;
                return (
                  <button
                    key={tool.slug}
                    id={`cmd-option-${tool.slug}`}
                    role="option"
                    aria-selected={i === selected}
                    onClick={() => navigate(tool.slug)}
                    onMouseEnter={() => setSelected(i)}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      i === selected ? "bg-[var(--primary-subtle)]" : "hover:bg-[var(--surface-2)]"
                    }`}
                  >
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={
                        i === selected
                          ? { background: "var(--primary-subtle)", color: "var(--primary)" }
                          : { background: "var(--surface-2)", color: "var(--muted-foreground)" }
                      }
                    >
                      <Icon size={15} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div
                        className="truncate text-sm font-medium"
                        style={{ color: i === selected ? "var(--primary)" : "var(--foreground)" }}
                      >
                        {tool.name[locale]}
                      </div>
                      <div className="truncate text-xs text-[var(--muted-foreground)]">
                        {tool.description[locale]}
                      </div>
                    </div>
                    <span className="hidden shrink-0 rounded-full bg-[var(--surface-2)] px-2 py-0.5 text-[10px] capitalize text-[var(--subtle-foreground)] sm:block">
                      {tool.category}
                    </span>
                    <ArrowRight size={12} className="text-[var(--subtle-foreground)]" aria-hidden="true" />
                  </button>
                );
              })}
              <Link
                href={`/${locale}/search?q=${encodeURIComponent(query.trim())}`}
                onClick={onClose}
                className="mx-2 mt-1 flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-xs font-medium text-[var(--primary)] transition-colors hover:bg-[var(--primary-subtle)]"
              >
                {t.allResults}
                <CornerDownLeft size={12} aria-hidden="true" />
              </Link>
            </div>
          )}

          {/* Recent searches */}
          {!query && recent.length > 0 && (
            <div>
              <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--subtle-foreground)]">
                {t.recent}
              </p>
              {recent.map((r, i) => (
                <button
                  key={`${r}-${i}`}
                  onClick={() => setQuery(r)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-[var(--surface-2)]"
                >
                  <Clock size={14} className="text-[var(--subtle-foreground)]" aria-hidden="true" />
                  <span className="text-sm text-[var(--muted-foreground)]">{r}</span>
                </button>
              ))}
            </div>
          )}

          {/* Empty state */}
          {query && results.length === 0 && (
            <div className="px-4 py-10 text-center">
              <Sparkles size={28} className="mx-auto mb-3 text-[var(--muted-foreground)] opacity-30" aria-hidden="true" />
              <p className="text-sm font-medium text-[var(--muted-foreground)]">
                {t.noResults} &quot;{query}&quot;
              </p>
              <p className="mt-1 text-xs text-[var(--subtle-foreground)]">
                {t.tryDifferent}{" "}
                <Link
                  href={`/${locale}/search?q=${encodeURIComponent(query)}`}
                  onClick={onClose}
                  className="text-[var(--primary)] hover:underline"
                >
                  {t.searchAll}
                </Link>
              </p>
            </div>
          )}

          {/* No query prompt */}
          {!query && recent.length === 0 && (
            <div className="px-4 py-10 text-center">
              <Search size={28} className="mx-auto mb-3 text-[var(--muted-foreground)] opacity-30" aria-hidden="true" />
              <p className="text-sm text-[var(--muted-foreground)]">{t.startTyping}</p>
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center gap-4 border-t border-[var(--border)] px-4 py-2.5 text-xs text-[var(--subtle-foreground)]">
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-[var(--border)] px-1">↑↓</kbd>
            {t.navigate}
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-[var(--border)] px-1">Enter</kbd>
            {t.open}
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-[var(--border)] px-1">Esc</kbd>
            {t.close}
          </span>
        </div>
      </div>
    </div>
  );
}

/** Global keyboard handler — mounts once in the locale layout. */
export function CommandPaletteProvider({
  locale,
  tools,
}: {
  locale: Locale;
  tools: ToolIndexEntry[];
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    const openHandler = () => setOpen(true);
    window.addEventListener("keydown", handler);
    window.addEventListener("nasir:open-search", openHandler);
    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("nasir:open-search", openHandler);
    };
  }, []);

  return (
    <CommandPalette locale={locale} tools={tools} isOpen={open} onClose={() => setOpen(false)} />
  );
}
