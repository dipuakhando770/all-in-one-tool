import { getDictionary } from "@/lib/dictionary";
import { allTools } from "@/tools/registry";
import { categories } from "@/lib/categories";
import { ToolCard } from "@/components/tool-card";
import type { Locale } from "@/lib/i18n";
import Link from "next/link";
import { LayoutGrid, List } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: `All Tools — Nasir Tools`,
    description: `Browse ${allTools.length}+ free online tools for images, PDFs, text, code, calculations and more.`,
    alternates: {
      canonical: `https://tools.nasirdigitalhub.com/${locale}/tools`,
    },
  };
}

export default async function ToolsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ category?: string; sort?: string }>;
}) {
  const { locale } = await params;
  const sp = searchParams ? await searchParams : {};
  const l = locale as Locale;
  const dict = await getDictionary(l);
  const activeCategory = sp?.category || "all";
  const sort = sp?.sort || "default";

  let tools = activeCategory === "all"
    ? allTools
    : allTools.filter((t) => t.category === activeCategory);

  if (sort === "popular") {
    tools = [...tools].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
  } else if (sort === "new") {
    tools = [...tools].sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0));
  } else if (sort === "name") {
    tools = [...tools].sort((a, b) => a.name[l].localeCompare(b.name[l]));
  }

  const totalTools = allTools.length;
  const filteredCount = tools.length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <nav className="mb-2 flex items-center gap-1.5 text-xs" style={{ color: "var(--muted-foreground)" }} aria-label="Breadcrumb">
              <Link href={`/${l}`} className="hover:text-[var(--primary)] transition-colors">Home</Link>
              <span>/</span>
              <span style={{ color: "var(--foreground)" }}>All Tools</span>
            </nav>
            <h1 className="text-3xl font-bold tracking-tight">{dict.nav.allTools}</h1>
            <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
              {filteredCount} of {totalTools} tools
              {activeCategory !== "all" && (
                <> in <span className="font-medium capitalize">{activeCategory}</span></>
              )}
            </p>
          </div>
          {/* Sort controls */}
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>Sort:</span>
            {[
              { value: "default", label: "Default" },
              { value: "popular", label: "Popular" },
              { value: "new", label: "New" },
              { value: "name", label: "A–Z" },
            ].map((s) => (
              <Link
                key={s.value}
                href={`/${l}/tools?category=${activeCategory}&sort=${s.value}`}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  sort === s.value
                    ? "text-[var(--primary)]"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
                }`}
                style={
                  sort === s.value
                    ? { background: "var(--primary-subtle)" }
                    : {}
                }
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar — Category filter */}
        <aside className="hidden w-52 shrink-0 lg:block">
          <div className="sticky top-20">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
              Categories
            </p>
            <nav className="space-y-0.5">
              <Link
                href={`/${l}/tools?category=all&sort=${sort}`}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                  activeCategory === "all"
                    ? "font-medium text-[var(--primary)]"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
                }`}
                style={activeCategory === "all" ? { background: "var(--primary-subtle)" } : {}}
              >
                <span>All Tools</span>
                <span
                  className="rounded-full px-1.5 py-0.5 text-[10px]"
                  style={{ background: "var(--surface-2)", color: "var(--subtle-foreground)" }}
                >
                  {totalTools}
                </span>
              </Link>
              {categories.map((c) => {
                const count = allTools.filter((t) => t.category === c.slug).length;
                const active = activeCategory === c.slug;
                return (
                  <Link
                    key={c.slug}
                    href={`/${l}/tools?category=${c.slug}&sort=${sort}`}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                      active
                        ? "font-medium text-[var(--primary)]"
                        : "text-[var(--muted-foreground)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
                    }`}
                    style={active ? { background: "var(--primary-subtle)" } : {}}
                  >
                    <span>{c.name[l]}</span>
                    <span
                      className="rounded-full px-1.5 py-0.5 text-[10px]"
                      style={{ background: "var(--surface-2)", color: "var(--subtle-foreground)" }}
                    >
                      {count}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          {/* Mobile category pills */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2 lg:hidden">
            <Link
              href={`/${l}/tools?category=all`}
              className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                activeCategory === "all"
                  ? "border-[var(--primary)] text-[var(--primary)]"
                  : "border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary-subtle)]"
              }`}
              style={activeCategory === "all" ? { background: "var(--primary-subtle)" } : {}}
            >
              All
            </Link>
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/${l}/tools?category=${c.slug}`}
                className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  activeCategory === c.slug
                    ? "border-[var(--primary)] text-[var(--primary)]"
                    : "border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary-subtle)]"
                }`}
                style={activeCategory === c.slug ? { background: "var(--primary-subtle)" } : {}}
              >
                {c.name[l]}
              </Link>
            ))}
          </div>

          {/* Tools grid */}
          {tools.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {tools.map((t) => <ToolCard key={t.id} tool={t} locale={l} />)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <LayoutGrid size={40} style={{ color: "var(--muted-foreground)" }} className="mb-4 opacity-40" />
              <p className="font-medium">No tools found</p>
              <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
                Try a different category or{" "}
                <Link href={`/${l}/tools`} className="text-[var(--primary)] hover:underline">
                  view all tools
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
