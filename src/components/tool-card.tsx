import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { ToolDefinition } from "@/lib/tools/types";
import * as Icons from "lucide-react";

export function ToolCard({ tool, locale }: { tool: ToolDefinition; locale: Locale }) {
  const Icon = (Icons as any)[tool.icon] || Icons.Wrench;
  return (
    <Link href={`/${locale}/tools/${tool.slug}`} className="group flex flex-col gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 transition hover:shadow-md hover:border-[var(--accent)]">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-[var(--muted)] p-2 text-[var(--accent)]">
          <Icon size={20} />
        </div>
        <h3 className="font-semibold">{tool.name[locale]}</h3>
      </div>
      <p className="text-sm text-[var(--foreground)]/70 line-clamp-2">{tool.description[locale]}</p>
    </Link>
  );
}
