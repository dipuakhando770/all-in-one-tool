import { getDictionary } from "@/lib/dictionary";
import { categories } from "@/lib/categories";
import { allTools } from "@/tools/registry";
import type { Locale } from "@/lib/i18n";
import Link from "next/link";
import {
  Sparkles, Layers, ArrowRight,
  Image as ImageIcon, FileText, Code, Calculator, Type,
  Search, Share2, Database, Globe, Folder,
} from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: `Browse Categories — Nasir Tools`,
    description: `Explore ${categories.length} curated categories of online tools for images, PDFs, developer utilities, calculators and more.`,
    alternates: {
      canonical: `https://tools.nasirdigitalhub.com/${locale}/categories`,
    },
  };
}

const categoryIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  image: ImageIcon,
  pdf: FileText,
  developer: Code,
  calculator: Calculator,
  text: Type,
  seo: Search,
  social: Share2,
  ai: Sparkles,
  data: Database,
  web: Globe,
  file: Folder,
};

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale;
  const dict = await getDictionary(l);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12 animate-fade-in">
      {/* Header */}
      <div className="mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--muted-foreground)] mb-4">
          <Layers size={13} className="text-[var(--primary)]" />
          <span>{categories.length} Curated Categories</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl text-[var(--foreground)]">
          {dict.nav.categories}
        </h1>
        <p className="mt-3 text-sm text-[var(--muted-foreground)] md:text-base leading-relaxed">
          Quickly navigate through our complete toolkit organized by workflow, media type and functional needs.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => {
          const Icon = categoryIcons[c.slug] || Sparkles;
          const categoryTools = allTools.filter((t) => t.category === c.slug);
          const popularExamples = categoryTools.filter((t) => t.popular).slice(0, 3);
          const fallbackExamples = categoryTools.slice(0, 3);
          const displayExamples = popularExamples.length > 0 ? popularExamples : fallbackExamples;

          return (
            <div
              key={c.slug}
              className="card-hover group relative flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl transition group-hover:scale-105"
                    style={{ background: "var(--primary-subtle)", color: "var(--primary)" }}
                  >
                    <Icon size={22} />
                  </div>
                  <span
                    className="rounded-full px-2.5 py-1 text-xs font-semibold"
                    style={{ background: "var(--surface-2)", color: "var(--foreground)" }}
                  >
                    {categoryTools.length} {categoryTools.length === 1 ? "tool" : "tools"}
                  </span>
                </div>

                <h2 className="mt-4 text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition">
                  {c.name[l] || c.name.en}
                </h2>
                <p className="mt-1 text-xs md:text-sm text-[var(--muted-foreground)] leading-relaxed">
                  {c.description[l] || c.description.en}
                </p>

                {/* Popular tools preview list */}
                {displayExamples.length > 0 && (
                  <div className="mt-5 border-t border-[var(--border)] pt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--subtle-foreground)] mb-2">
                      Popular tools
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {displayExamples.map((t) => (
                        <Link
                          key={t.id}
                          href={`/${l}/tools/${t.slug}`}
                          className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1 text-[11px] text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition"
                        >
                          {t.name[l] || t.name.en}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Link */}
              <div className="mt-6 pt-3">
                <Link
                  href={`/${l}/categories/${c.slug}`}
                  className="inline-flex w-full items-center justify-between rounded-xl bg-[var(--surface-2)] px-4 py-2.5 text-xs font-semibold text-[var(--foreground)] group-hover:bg-[var(--primary)] group-hover:text-white transition"
                >
                  <span>Explore {c.name[l] || c.name.en}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
