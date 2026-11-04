import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { categories } from "@/lib/categories";
import { getToolsByCategory } from "@/tools/registry";
import { ToolCard } from "@/components/tool-card";
import type { Locale } from "@/lib/i18n";
import Link from "next/link";
import { ChevronRight, Layers } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) return {};
  const l = locale as Locale;
  const name = cat.name[l] || cat.name.en;
  const desc = cat.description[l] || cat.description.en;
  return {
    title: `${name} — Free Online Tools | Nasir Tools`,
    description: `${desc} Free, instant, browser-based utilities for ${name.toLowerCase()}.`,
    alternates: {
      canonical: `https://tools.nasirdigitalhub.com/${locale}/categories/${slug}`,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const l = locale as Locale;
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) notFound();

  const dict = await getDictionary(l);
  const tools = getToolsByCategory(slug);
  const otherCategories = categories.filter((c) => c.slug !== slug).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12 animate-fade-in">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
        <Link href={`/${l}`} className="hover:text-[var(--primary)] transition">Home</Link>
        <ChevronRight size={12} />
        <Link href={`/${l}/categories`} className="hover:text-[var(--primary)] transition">Categories</Link>
        <ChevronRight size={12} />
        <span className="text-[var(--foreground)]">{cat.name[l] || cat.name.en}</span>
      </nav>

      {/* Category Hero */}
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 md:p-12 mb-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold mb-3" style={{ background: "var(--primary-subtle)", color: "var(--primary)" }}>
            <Layers size={13} />
            <span>Category Hub</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl text-[var(--foreground)]">
            {cat.name[l] || cat.name.en}
          </h1>
          <p className="mt-2 text-base text-[var(--muted-foreground)] leading-relaxed">
            {cat.description[l] || cat.description.en}
          </p>
          <div className="mt-4 flex items-center gap-3 text-xs text-[var(--subtle-foreground)]">
            <span>{tools.length} {tools.length === 1 ? "tool" : "tools"} available</span>
            <span>•</span>
            <span>100% Free to use</span>
            <span>•</span>
            <span>No installation required</span>
          </div>
        </div>
      </div>

      {/* Category Tools Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[var(--foreground)]">
            All {cat.name[l] || cat.name.en}
          </h2>
          <span className="text-xs text-[var(--muted-foreground)]">
            {tools.length} {tools.length === 1 ? "item" : "items"}
          </span>
        </div>

        {tools.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tools.map((t) => (
              <ToolCard key={t.id} tool={t} locale={l} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center">
            <p className="text-sm text-[var(--muted-foreground)]">{dict.common.noResults}</p>
          </div>
        )}
      </div>

      {/* Other Categories */}
      <div className="mt-16 border-t border-[var(--border)] pt-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-[var(--foreground)]">
            Explore Other Categories
          </h3>
          <Link
            href={`/${l}/categories`}
            className="text-xs font-semibold text-[var(--primary)] hover:underline"
          >
            View all categories →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {otherCategories.map((c) => (
            <Link
              key={c.slug}
              href={`/${l}/categories/${c.slug}`}
              className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition hover:border-[var(--primary)] hover:shadow-sm"
            >
              <div className="font-semibold text-sm group-hover:text-[var(--primary)] transition">
                {c.name[l] || c.name.en}
              </div>
              <p className="mt-1 text-xs text-[var(--muted-foreground)] line-clamp-1">
                {c.description[l] || c.description.en}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
