import { getDictionary } from "@/lib/dictionary";
import {
  allTools,
  getPopularTools,
  getNewTools,
  getTrendingTools,
  getFeaturedTools,
} from "@/tools/registry";
import { categories } from "@/lib/categories";
import { ToolCard } from "@/components/tool-card";
import type { Locale } from "@/lib/i18n";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Shield,
  Zap,
  Globe,
  ArrowRight,
  Sparkles,
  Gauge,
  CheckCircle2,
  Search,
  MousePointerClick,
  Layers,
  Lock,
} from "lucide-react";

const SITE_URL = "https://tools.nasirdigitalhub.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isBn = locale === "bn";
  return {
    title: isBn
      ? `নাসির টুলস — ${allTools.length}+ ফ্রি অনলাইন টুল`
      : `Nasir Tools — ${allTools.length}+ Free Online Tools`,
    description: isBn
      ? `ছবি কম্প্রেস, PDF ম্যানেজ, টেক্সট, কোড, SEO ও ক্যালকুলেটর — ${allTools.length}+ ফ্রি অনলাইন টুল। রেজিস্ট্রেশন ছাড়াই ব্রাউজারে ব্যবহার করুন।`
      : `Compress images, manage PDFs, format code, calculate and convert with ${allTools.length}+ free browser-based tools. No registration required.`,
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        en: `${SITE_URL}/en`,
        bn: `${SITE_URL}/bn`,
        "x-default": `${SITE_URL}/en`,
      },
    },
    openGraph: {
      title: isBn ? "নাসির টুলস — ফ্রি অনলাইন টুল" : "Nasir Tools — Free Online Tools",
      description: isBn
        ? "প্রতিদিনের ডিজিটাল কাজের জন্য ফ্রি, দ্রুত ও গোপনীয় টুল।"
        : "Free, fast and private tools for everyday digital work.",
      url: `${SITE_URL}/${locale}`,
      siteName: "Nasir Tools",
      locale: isBn ? "bn_BD" : "en_US",
      type: "website",
    },
  };
}

function dedupe<T extends { slug: string }>(lists: T[][]): T[] {
  const seen = new Set<string>();
  const result: T[] = [];
  for (const list of lists) {
    for (const item of list) {
      if (!seen.has(item.slug)) {
        seen.add(item.slug);
        result.push(item);
      }
    }
  }
  return result;
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const dict = await getDictionary(l);
  const ui = dict.ui;

  const trending = getTrendingTools(8);
  const featured = getFeaturedTools(8);
  const popularList = dedupe([getPopularTools(), trending, featured]).slice(0, 8);
  const recent = dedupe([getNewTools(), [...allTools].slice(-6).reverse()]).slice(0, 6);
  const totalTools = allTools.length;
  const categoryCount = categories.filter((c) =>
    allTools.some((t) => t.category === c.slug)
  ).length;

  const quickLinks = [
    { label: l === "bn" ? "ছবি কম্প্রেস" : "Image compressor", query: l === "bn" ? "ছবি কম্প্রেস" : "image compressor" },
    { label: l === "bn" ? "PDF মার্জ" : "PDF merger", query: l === "bn" ? "পিডিএফ মার্জ" : "pdf merger" },
    { label: l === "bn" ? "JSON ফরম্যাট" : "JSON formatter", query: "json formatter" },
    { label: l === "bn" ? "শব্দ গণনা" : "Word counter", query: "word counter" },
    { label: l === "bn" ? "বয়স নির্ণয়" : "Age calculator", query: "age calculator" },
  ];

  const benefits = [
    { icon: Gauge, title: ui.instant, description: ui.instantDesc },
    { icon: Lock, title: ui.private, description: ui.privateDesc },
    { icon: Globe, title: ui.everywhere, description: ui.everywhereDesc },
    { icon: Shield, title: ui.free, description: ui.freeDesc },
  ];

  const faqs = dict.homeFaq;
  const steps = dict.how;

  return (
    <div>
      {/* FAQ structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          }),
        }}
      />

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(ellipse at 50% 0%, black 35%, transparent 75%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-44 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full opacity-[0.13] blur-3xl"
          style={{ background: "var(--primary)" }}
        />

        <div className="relative mx-auto max-w-7xl px-4 py-16 text-center md:px-6 md:py-24 lg:py-28">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-1.5 text-xs shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" aria-hidden="true" />
            <span className="text-[var(--muted-foreground)]">
              {totalTools}+ {ui.toolsAvailable}
            </span>
            <span className="text-[var(--border-strong)]" aria-hidden="true">|</span>
            <span className="font-medium text-[var(--primary)]">{ui.noAccountNeeded}</span>
          </div>

          <h1 className="mx-auto max-w-4xl text-balance text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-[4.25rem]">
            <span className="text-[var(--foreground)]">{dict.hero.title}</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-[var(--muted-foreground)] md:text-lg">
            {dict.hero.description}
          </p>

          {/* Functional search form */}
          <form
            action={`/${l}/search`}
            method="get"
            role="search"
            className="mx-auto mt-9 max-w-2xl"
          >
            <label htmlFor="home-search" className="sr-only">
              {dict.hero.searchPlaceholder}
            </label>
            <div className="group relative flex items-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-[0_1px_2px_rgba(15,21,35,0.04),0_12px_32px_-16px_rgba(91,80,232,0.25)] transition-colors focus-within:border-[var(--primary)]">
              <Search
                size={18}
                aria-hidden="true"
                className="ml-2.5 shrink-0 text-[var(--muted-foreground)]"
              />
              <input
                id="home-search"
                name="q"
                type="search"
                placeholder={dict.hero.searchPlaceholder}
                className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--subtle-foreground)] md:text-base"
                autoComplete="off"
              />
              <kbd className="mr-2 hidden rounded-md border border-[var(--border)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--subtle-foreground)] sm:inline-block">
                ⌘K
              </kbd>
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-[var(--primary-foreground)] transition-colors hover:bg-[var(--primary-hover)] md:px-5"
              >
                {ui.search}
              </button>
            </div>
          </form>

          {/* Quick links */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {quickLinks.map((item) => (
              <Link
                key={item.query}
                href={`/${l}/search?q=${encodeURIComponent(item.query)}`}
                className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs text-[var(--muted-foreground)] transition-colors hover:border-[var(--primary)] hover:bg-[var(--primary-subtle)] hover:text-[var(--primary)]"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <Link
              href={`/${l}/tools`}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-[var(--primary-foreground)] shadow-sm transition-colors hover:bg-[var(--primary-hover)]"
            >
              {dict.hero.explore}
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <Link
              href={`/${l}/popular`}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--surface-2)]"
            >
              <Sparkles size={15} aria-hidden="true" />
              {dict.hero.popular}
            </Link>
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="border-b border-[var(--border)] bg-[var(--surface)]" aria-label="Platform statistics">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-7 md:grid-cols-4 md:px-6">
          {[
            { value: `${totalTools}+`, label: ui.toolsAvailable },
            { value: `${categoryCount}`, label: ui.allCategories },
            { value: "100%", label: ui.browserProcessing },
            { value: "0", label: ui.noAccountNeeded },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold tabular-nums text-[var(--primary)] md:text-3xl">
                {value}
              </div>
              <div className="mt-1 text-xs text-[var(--muted-foreground)] md:text-sm">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TRENDING ─── */}
      {trending.length > 0 && (
        <section className="py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">
                  <Zap size={12} aria-hidden="true" />
                  {ui.trending}
                </p>
                <h2 className="mt-1.5 text-2xl font-bold tracking-tight md:text-3xl">
                  {ui.trending}
                </h2>
                <p className="mt-1.5 text-sm text-[var(--muted-foreground)]">{ui.trendingDesc}</p>
              </div>
              <Link
                href={`/${l}/tools`}
                className="inline-flex items-center gap-1 text-sm font-medium text-[var(--muted-foreground)] transition-colors hover:text-[var(--primary)]"
              >
                {ui.viewAll} <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {trending.map((tool) => (
                <ToolCard key={tool.id} tool={tool} locale={l} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CATEGORIES ─── */}
      <section className="border-y border-[var(--border)] bg-[var(--surface)] py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">
                <Layers size={12} aria-hidden="true" />
                {dict.sections.browseCategories}
              </p>
              <h2 className="mt-1.5 text-2xl font-bold tracking-tight md:text-3xl">
                {dict.sections.browseCategories}
              </h2>
            </div>
            <Link
              href={`/${l}/categories`}
              className="inline-flex items-center gap-1 text-sm font-medium text-[var(--muted-foreground)] transition-colors hover:text-[var(--primary)]"
            >
              {ui.viewAll} <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const count = allTools.filter((t) => t.category === category.slug).length;
              if (count === 0) return null;
              return (
                <Link
                  key={category.slug}
                  href={`/${l}/categories/${category.slug}`}
                  className="group rounded-xl border border-[var(--border)] bg-[var(--elevated)] p-4 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[var(--primary)] hover:shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold transition-colors group-hover:text-[var(--primary)]">
                      {category.name[l]}
                    </h3>
                    <span className="shrink-0 rounded-full bg-[var(--surface-2)] px-2 py-0.5 text-[10px] font-medium text-[var(--subtle-foreground)]">
                      {count} {ui.tools}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--muted-foreground)] line-clamp-2">
                    {category.description[l]}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── POPULAR ─── */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">
                {dict.sections.popularTools}
              </p>
              <h2 className="mt-1.5 text-2xl font-bold tracking-tight md:text-3xl">
                {dict.sections.popularTools}
              </h2>
            </div>
            <Link
              href={`/${l}/popular`}
              className="inline-flex items-center gap-1 text-sm font-medium text-[var(--muted-foreground)] transition-colors hover:text-[var(--primary)]"
            >
              {ui.viewAll} <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {popularList.map((tool) => (
              <ToolCard key={tool.id} tool={tool} locale={l} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED ─── */}
      {featured.length > 0 && (
        <section className="border-y border-[var(--border)] bg-[var(--surface)] py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">
                  <MousePointerClick size={12} aria-hidden="true" />
                  {ui.featured}
                </p>
                <h2 className="mt-1.5 text-2xl font-bold tracking-tight md:text-3xl">
                  {ui.featured}
                </h2>
                <p className="mt-1.5 text-sm text-[var(--muted-foreground)]">{ui.featuredDesc}</p>
              </div>
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((tool) => (
                <ToolCard key={tool.id} tool={tool} locale={l} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── RECENTLY ADDED ─── */}
      {recent.length > 0 && (
        <section className="py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">
                  {dict.sections.recentlyAdded}
                </p>
                <h2 className="mt-1.5 text-2xl font-bold tracking-tight md:text-3xl">
                  {dict.sections.recentlyAdded}
                </h2>
                <p className="mt-1.5 text-sm text-[var(--muted-foreground)]">{ui.newToolsNote}</p>
              </div>
              <Link
                href={`/${l}/tools?sort=new`}
                className="inline-flex items-center gap-1 text-sm font-medium text-[var(--muted-foreground)] transition-colors hover:text-[var(--primary)]"
              >
                {ui.viewAll} <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {recent.map((tool) => (
                <ToolCard key={tool.id} tool={tool} locale={l} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── WHY ─── */}
      <section className="border-t border-[var(--border)] bg-[var(--surface)] py-14 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">
              {dict.sections.why}
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
              {dict.sections.why}
            </h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-xl border border-[var(--border)] bg-[var(--elevated)] p-5">
                <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary-subtle)] text-[var(--primary)]">
                  <Icon size={17} aria-hidden="true" />
                </div>
                <h3 className="text-sm font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted-foreground)]">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">
              {dict.sections.howItWorks}
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
              {dict.sections.howItWorks}
            </h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((step: { title: string; desc: string }, index: number) => (
              <div key={step.title} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary-subtle)] text-sm font-bold text-[var(--primary)]">
                  {index + 1}
                </div>
                <h3 className="text-sm font-semibold">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted-foreground)]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="border-t border-[var(--border)] bg-[var(--surface)] py-14 md:py-20">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">
              {dict.sections.faq}
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
              {dict.sections.faq}
            </h2>
          </div>
          <div className="mt-8 space-y-2.5">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group rounded-xl border border-[var(--border)] bg-[var(--background)]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 text-sm font-medium">
                  <span>{faq.q}</span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-lg leading-none text-[var(--muted-foreground)] transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <div className="border-t border-[var(--border)] px-4 pb-4 pt-3">
                  <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-14 md:py-24">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--elevated)] p-8 text-center md:p-12">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)]">
              <Sparkles size={22} aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{ui.getStarted}</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[var(--muted-foreground)] md:text-base">
              {ui.getStartedDesc.replace("{count}", String(totalTools))}
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
              <Link
                href={`/${l}/tools`}
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-[var(--primary-foreground)] transition-colors hover:bg-[var(--primary-hover)]"
              >
                {ui.browseAllTools}
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
              <Link
                href={`/${l}/categories`}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--surface-2)]"
              >
                <Layers size={14} aria-hidden="true" />
                {dict.sections.browseCategories}
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-[var(--muted-foreground)]">
              {[ui.noAccountNeeded, ui.browserProcessing, ui.freeToUse].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-[var(--success)]" aria-hidden="true" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
