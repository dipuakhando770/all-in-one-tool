"use client";
import { useState, useLayoutEffect, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, Clock, Sparkles } from "lucide-react";
import { allTools } from "@/tools/registry";
import type { Locale } from "@/lib/i18n";
import * as Icons from "lucide-react";
import { getToolIcon } from "@/lib/icons";
import Link from "next/link";

const MAX_RESULTS = 8;
const MAX_RECENT = 5;
const RECENT_KEY = "nasir_recent_searches";

function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveRecentSearch(q: string) {
  if (typeof window === 'undefined') return;
  try {
    const existing = getRecentSearches();
    const updated = [q, ...existing.filter((s) => s !== q)].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  } catch {}
}

interface CommandPaletteProps {
  locale: Locale;
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ locale, isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Reset state when opening - using RAF to defer setState outside effect
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

  const results = query.trim()
    ? allTools
        .filter((t) => {
          const q = query.toLowerCase();
          return (
            t.name.en.toLowerCase().includes(q) ||
            t.name.bn.toLowerCase().includes(q) ||
            t.description.en.toLowerCase().includes(q) ||
            t.slug.includes(q) ||
            t.category.includes(q) ||
            t.keywords.some((k) => k.toLowerCase().includes(q))
          );
        })
        .slice(0, MAX_RESULTS)
    : [];

  const navigate = useCallback(
    (slug: string) => {
      saveRecentSearch(query.trim());
      router.push(`/${locale}/tools/${slug}`);
      onClose();
    },
    [locale, query, router, onClose]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { onClose(); return; }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, results.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    }
    if (e.key === "Enter" && results[selected]) {
      navigate(results[selected].slug);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="cmd-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Search tools"
    >
      <div className="cmd-panel w-full mx-4">
        {/* Search input */}
        <div
          className="flex items-center gap-3 border-b px-4 py-3"
          style={{ borderColor: "var(--border)" }}
        >
          <Search size={16} style={{ color: "var(--muted-foreground)" }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Search tools..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--subtle-foreground)]"
            style={{ color: "var(--foreground)" }}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="rounded p-1 hover:bg-[var(--surface-2)] transition-colors"
              aria-label="Clear search"
            >
              <X size={14} style={{ color: "var(--muted-foreground)" }} />
            </button>
          )}
          <kbd
            className="rounded border border-[var(--border)] px-1.5 py-0.5 text-xs hidden sm:inline-flex"
            style={{ color: "var(--subtle-foreground)" }}
          >
            Esc
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto py-2" role="listbox">
          {/* Tool results */}
          {results.length > 0 && (
            <div>
              <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--subtle-foreground)" }}>
                Tools
              </p>
              {results.map((tool, i) => {
                const iconName = getToolIcon(tool.slug, tool.icon);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const Icon = (Icons as any)[iconName] || Icons.Wrench;
                return (
                  <button
                    key={tool.id}
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
                        className="text-sm font-medium truncate"
                        style={{ color: i === selected ? "var(--primary)" : "var(--foreground)" }}
                      >
                        {tool.name.en}
                      </div>
                      <div className="text-xs truncate" style={{ color: "var(--muted-foreground)" }}>
                        {tool.description.en}
                      </div>
                    </div>
                    <span
                      className="shrink-0 rounded-full px-2 py-0.5 text-[10px] capitalize"
                      style={{ background: "var(--surface-2)", color: "var(--subtle-foreground)" }}
                    >
                      {tool.category}
                    </span>
                    <ArrowRight size={12} style={{ color: "var(--subtle-foreground)" }} />
                  </button>
                );
              })}
            </div>
          )}

          {/* Recent searches */}
          {!query && recent.length > 0 && (
            <div>
              <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--subtle-foreground)" }}>
                Recent Searches
              </p>
              {recent.map((r, i) => (
                <button
                  key={i}
                  onClick={() => setQuery(r)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-[var(--surface-2)] transition-colors"
                >
                  <Clock size={14} style={{ color: "var(--subtle-foreground)" }} />
                  <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>{r}</span>
                </button>
              ))}
            </div>
          )}

          {/* Empty state */}
          {query && results.length === 0 && (
            <div className="px-4 py-10 text-center">
              <Sparkles size={28} className="mx-auto mb-3 opacity-30" style={{ color: "var(--muted-foreground)" }} />
              <p className="text-sm font-medium" style={{ color: "var(--muted-foreground)" }}>
                No tools found for &quot;{query}&quot;
              </p>
              <p className="mt-1 text-xs" style={{ color: "var(--subtle-foreground)" }}>
                Try a different keyword or{" "}
                <Link
                  href={`/${locale}/search?q=${encodeURIComponent(query)}`}
                  onClick={onClose}
                  className="text-[var(--primary)] hover:underline"
                >
                  search all tools
                </Link>
              </p>
            </div>
          )}

          {/* No query prompt */}
          {!query && recent.length === 0 && (
            <div className="px-4 py-10 text-center">
              <Search size={28} className="mx-auto mb-3 opacity-30" style={{ color: "var(--muted-foreground)" }} />
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                Start typing to search 157+ tools
              </p>
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div
          className="flex items-center gap-4 border-t px-4 py-2.5 text-xs"
          style={{ borderColor: "var(--border)", color: "var(--subtle-foreground)" }}
        >
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-[var(--border)] px-1">↑↓</kbd>
            Navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-[var(--border)] px-1">Enter</kbd>
            Open
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-[var(--border)] px-1">Esc</kbd>
            Close
          </span>
        </div>
      </div>
    </div>
  );
}

/** Global keyboard handler — mounts once in the root layout area */
export function CommandPaletteProvider({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return <CommandPalette locale={locale} isOpen={open} onClose={() => setOpen(false)} />;
}

