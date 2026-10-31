import { getDictionary } from "@/lib/dictionary";
import { allTools } from "@/tools/registry";
import { categories } from "@/lib/categories";
import { ToolCard } from "@/components/tool-card";
import { SearchBox } from "@/components/search-box";
import type { Locale } from "@/lib/i18n";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const dict = await getDictionary(l);
  const popular = allTools.slice(0, 8);
  const recent = allTools.slice(-6);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <section className="rounded-2xl bg-[var(--muted)] p-8 text-center">
        <h1 className="text-3xl font-bold md:text-5xl">{dict.hero.title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-[var(--foreground)]/70">{dict.hero.description}</p>
        <div className="mt-6 flex justify-center gap-3">
          <a href={`/${l}/tools`} className="rounded-lg bg-[var(--accent)] px-5 py-2 text-white">{dict.hero.explore}</a>
          <a href={`/${l}/popular`} className="rounded-lg border border-[var(--border)] px-5 py-2">{dict.hero.popular}</a>
        </div>
        <SearchBox locale={l} placeholder={dict.hero.searchPlaceholder} />
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">{dict.sections.popularTools}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((t) => <ToolCard key={t.id} tool={t} locale={l} />)}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">{dict.sections.browseCategories}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <a key={c.slug} href={`/${l}/categories/${c.slug}`} className="rounded-xl border border-[var(--border)] p-5 transition hover:shadow-md">
              <div className="font-semibold">{c.name[l]}</div>
              <p className="mt-1 text-sm text-[var(--foreground)]/70">{c.description[l]}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">{dict.sections.recentlyAdded}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((t) => <ToolCard key={t.id} tool={t} locale={l} />)}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">{dict.sections.why}</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {dict.why.map((w: string, i: number) => <li key={i} className="rounded-lg border border-[var(--border)] p-3">✅ {w}</li>)}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">{dict.sections.howItWorks}</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {dict.how.map((h: any, i: number) => (
            <div key={i} className="rounded-xl border border-[var(--border)] p-5">
              <div className="text-2xl font-bold text-[var(--accent)]">{i + 1}</div>
              <div className="mt-2 font-semibold">{h.title}</div>
              <p className="text-sm text-[var(--foreground)]/70">{h.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
