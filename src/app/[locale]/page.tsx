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
  const featured = allTools.slice(8, 16);
  const recent = allTools.slice(-6);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--muted)] to-[var(--background)] p-8 text-center md:p-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">{dict.hero.title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--foreground)]/70">{dict.hero.description}</p>
          <div className="mt-6 flex justify-center gap-3">
            <a href={`/${l}/tools`} className="rounded-lg bg-[var(--accent)] px-6 py-3 text-white shadow-md transition hover:opacity-90">{dict.hero.explore}</a>
            <a href={`/${l}/popular`} className="rounded-lg border border-[var(--border)] px-6 py-3 transition hover:bg-[var(--muted)]">{dict.hero.popular}</a>
          </div>
          <SearchBox locale={l} placeholder={dict.hero.searchPlaceholder} />
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm text-[var(--foreground)]/60">
            {["image compressor", "json formatter", "pdf merger", "word counter", "age calculator"].map((s) => (
              <a key={s} href={`/${l}/search?q=${encodeURIComponent(s)}`} className="rounded-full border border-[var(--border)] px-3 py-1 hover:bg-[var(--muted)]">{s}</a>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-16">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{dict.sections.popularTools}</h2>
          <a href={`/${l}/popular`} className="text-sm text-[var(--accent)] hover:underline">View all →</a>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((t) => <ToolCard key={t.id} tool={t} locale={l} />)}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold">{dict.sections.browseCategories}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <a key={c.slug} href={`/${l}/categories/${c.slug}`} className="group rounded-xl border border-[var(--border)] bg-[var(--background)] p-5 transition hover:shadow-md hover:border-[var(--accent)]">
              <div className="font-semibold group-hover:text-[var(--accent)]">{c.name[l]}</div>
              <p className="mt-1 text-sm text-[var(--foreground)]/70">{c.description[l]}</p>
              <div className="mt-3 text-xs text-[var(--foreground)]/50">{allTools.filter((t) => t.category === c.slug).length} tools</div>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold">Featured Tools</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((t) => <ToolCard key={t.id} tool={t} locale={l} />)}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold">{dict.sections.recentlyAdded}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((t) => <ToolCard key={t.id} tool={t} locale={l} />)}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold">{dict.sections.why}</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {dict.why.map((w: string, i: number) => (
            <li key={i} className="flex items-start gap-2 rounded-lg border border-[var(--border)] p-4">
              <span className="text-[var(--accent)]">✓</span>
              <span>{w}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
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

      <section className="mt-16">
        <h2 className="text-2xl font-bold">{dict.sections.faq}</h2>
        <div className="mt-4 space-y-3">
          {[
            { q: "Are these tools free?", a: "Yes, all tools are free to use." },
            { q: "Is my data safe?", a: "Files are processed in your browser where possible; we do not store your files." },
            { q: "Do I need to register?", a: "No, public tools work without registration." },
          ].map((f, i) => (
            <div key={i} className="rounded-lg border border-[var(--border)] p-4">
              <div className="font-semibold">{f.q}</div>
              <div className="text-sm text-[var(--foreground)]/70">{f.a}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

