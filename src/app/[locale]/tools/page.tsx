import { getDictionary } from "@/lib/dictionary";
import { allTools } from "@/tools/registry";
import { ToolCard } from "@/components/tool-card";
import type { Locale } from "@/lib/i18n";

export default async function ToolsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const dict = await getDictionary(l);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold">{dict.nav.allTools}</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {allTools.map((t) => <ToolCard key={t.id} tool={t} locale={l} />)}
      </div>
    </div>
  );
}
