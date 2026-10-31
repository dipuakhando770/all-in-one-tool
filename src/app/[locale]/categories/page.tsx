import { getDictionary } from "@/lib/dictionary";
import { categories } from "@/lib/categories";
import { getToolsByCategory } from "@/tools/registry";
import { ToolCard } from "@/components/tool-card";
import type { Locale } from "@/lib/i18n";

export default async function CategoriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const dict = await getDictionary(l);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold">{dict.nav.categories}</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((c) => (
          <a key={c.slug} href={`/${l}/categories/${c.slug}`} className="rounded-xl border border-[var(--border)] p-5 transition hover:shadow-md">
            <div className="font-semibold">{c.name[l]}</div>
            <p className="mt-1 text-sm text-[var(--foreground)]/70">{c.description[l]}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
