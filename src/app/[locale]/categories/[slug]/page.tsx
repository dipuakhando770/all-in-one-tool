import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { categories } from "@/lib/categories";
import { getToolsByCategory } from "@/tools/registry";
import { ToolCard } from "@/components/tool-card";
import type { Locale } from "@/lib/i18n";

export default async function CategoryPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const l = locale as Locale;
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) notFound();
  const dict = await getDictionary(l);
  const tools = getToolsByCategory(slug);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold">{cat.name[l]}</h1>
      <p className="mt-2 text-[var(--foreground)]/70">{cat.description[l]}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tools.map((t) => <ToolCard key={t.id} tool={t} locale={l} />)}
      </div>
      {tools.length === 0 && <p className="mt-6">{dict.common.noResults}</p>}
    </div>
  );
}
