import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { ToolDefinition } from "@/lib/tools/types";
import { getToolIcon } from "@/lib/icons";
import * as Icons from "lucide-react";
import { Star, Sparkles } from "lucide-react";

export function ToolCard({ tool, locale }: { tool: ToolDefinition; locale: Locale }) {
  const iconName = getToolIcon(tool.slug, tool.icon);
  const Icon = (Icons as any)[iconName] || Icons.Wrench;

  return (
    <Link
      href={`/${locale}/tools/${tool.slug}`}
      className="group relative flex flex-col rounded-xl border bg-[var(--surface)] p-4 transition-all hover:border-[var(--primary)] hover:shadow-md"
      style={{
        borderColor: "var(--border)",
        transition: "border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease",
      }}
    >
      {/* Badges */}
      {(tool.popular || tool.new) && (
        <div className="absolute right-3 top-3 flex gap-1">
          {tool.popular && (
            <span
              className="inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold"
              style={{ background: "var(--warning-subtle)", color: "var(--warning)" }}
            >
              <Star size={8} />
              Popular
            </span>
          )}
          {tool.new && (
            <span
              className="inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold"
              style={{ background: "var(--success-subtle)", color: "var(--success)" }}
            >
              <Sparkles size={8} />
              New
            </span>
          )}
        </div>
      )}

      {/* Icon */}
      <div
        className="mb-3 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors group-hover:bg-[var(--primary-subtle)]"
        style={{ background: "var(--surface-2)", color: "var(--muted-foreground)" }}
      >
        <Icon size={18} className="transition-colors group-hover:text-[var(--primary)]" />
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold leading-snug transition-colors group-hover:text-[var(--primary)]">
        {tool.name[locale]}
      </h3>

      {/* Description */}
      <p
        className="mt-1 text-xs leading-relaxed line-clamp-2"
        style={{ color: "var(--muted-foreground)" }}
      >
        {tool.description[locale]}
      </p>

      {/* Category badge */}
      <div className="mt-3 flex items-center">
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-medium capitalize"
          style={{ background: "var(--surface-2)", color: "var(--subtle-foreground)" }}
        >
          {tool.category}
        </span>
      </div>
    </Link>
  );
}

/** Compact horizontal tool list item variant */
export function ToolListItem({ tool, locale }: { tool: ToolDefinition; locale: Locale }) {
  const iconName = getToolIcon(tool.slug, tool.icon);
  const Icon = (Icons as any)[iconName] || Icons.Wrench;

  return (
    <Link
      href={`/${locale}/tools/${tool.slug}`}
      className="group flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 transition-all hover:border-[var(--primary)] hover:shadow-sm"
    >
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
        style={{ background: "var(--surface-2)", color: "var(--muted-foreground)" }}
      >
        <Icon size={15} className="transition-colors group-hover:text-[var(--primary)]" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium group-hover:text-[var(--primary)] transition-colors">
          {tool.name[locale]}
        </div>
        <div className="truncate text-xs" style={{ color: "var(--muted-foreground)" }}>
          {tool.description[locale]}
        </div>
      </div>
      {(tool.popular || tool.new) && (
        <span
          className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
          style={
            tool.popular
              ? { background: "var(--warning-subtle)", color: "var(--warning)" }
              : { background: "var(--success-subtle)", color: "var(--success)" }
          }
        >
          {tool.popular ? "Popular" : "New"}
        </span>
      )}
    </Link>
  );
}
