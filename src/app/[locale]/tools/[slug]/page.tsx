import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { getToolBySlug, allTools } from "@/tools/registry";
import { categories } from "@/lib/categories";
import { ToolRunner } from "@/components/tool-runner";
import { BatchImageProcessor } from "@/components/batch-image-processor";
import { PdfPageSelector } from "@/components/pdf-page-selector";
import { PdfMerger } from "@/components/pdf-merger";
import { PdfSplitter } from "@/components/pdf-splitter";
import { CodeEditorUI } from "@/components/code-editor-ui";
import { ToolCard } from "@/components/tool-card";
import type { Locale } from "@/lib/i18n";
import Link from "next/link";
import {
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Info,
  AlertCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  Check,
} from "lucide-react";
import type { Metadata } from "next";
import * as Icons from "lucide-react";
import { getToolIcon } from "@/lib/icons";
import { SITE_URL, pageAlternates, pageOpenGraph, pick } from "@/lib/seo";
import { getToolSeoContent } from "@/lib/seo-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};
  const l = locale as Locale;

  return {
    title: tool.seoTitle[l],
    description: tool.seoDescription[l],
    keywords: tool.keywords,
    alternates: pageAlternates(l, `/tools/${slug}`),
    openGraph: pageOpenGraph({
      locale: l,
      path: `/tools/${slug}`,
      title: tool.seoTitle[l],
      description: tool.seoDescription[l],
    }),
  };
}

export function generateStaticParams() {
  return allTools.map((tool) => ({ slug: tool.slug }));
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const l = locale as Locale;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();
  const dict = await getDictionary(l);
  const seo = getToolSeoContent(slug);

  const category = categories.find((c) => c.slug === tool.category);
  const categoryName = category ? category.name[l] || category.name.en : tool.category;

  // Related tools: explicit first, then same category
  const related = tool.related
    .map((s) => getToolBySlug(s))
    .filter((t): t is NonNullable<typeof t> => Boolean(t) && t!.slug !== tool.slug)
    .slice(0, 4);

  const relatedFallback =
    related.length > 0
      ? related
      : allTools.filter((t) => t.category === tool.category && t.slug !== tool.slug).slice(0, 4);

  const iconName = getToolIcon(tool.slug, tool.icon);
  const IconsRecord = Icons as unknown as Record<
    string,
    React.ComponentType<{ size?: number; "aria-hidden"?: boolean; className?: string }>
  >;
  const Icon = IconsRecord[iconName] || Icons.Wrench;

  const url = `${SITE_URL}/${l}/tools/${tool.slug}`;

  // How-to structured data steps
  const howToSteps = seo
    ? seo.howToSteps[l].map((st, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: st.title,
        text: st.description,
      }))
    : tool.instructions[l].map((step, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        text: step,
      }));

  // FAQ structured data entities
  const faqEntities = seo
    ? seo.faq[l].map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      }))
    : tool.faqs.map((f) => ({
        "@type": "Question",
        name: f.q[l],
        acceptedAnswer: { "@type": "Answer", text: f.a[l] },
      }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
      {/* BreadcrumbList JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: dict.ui.home, item: `${SITE_URL}/${l}` },
              {
                "@type": "ListItem",
                position: 2,
                name: dict.nav.allTools,
                item: `${SITE_URL}/${l}/tools`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: categoryName,
                item: `${SITE_URL}/${l}/categories/${tool.category}`,
              },
              { "@type": "ListItem", position: 4, name: tool.name[l], item: url },
            ],
          }),
        }}
      />

      {/* WebApplication JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: tool.name[l],
            description: tool.seoDescription[l],
            url,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Web Browser",
            inLanguage: l,
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            browserRequirements: "Requires JavaScript. Works on Chrome, Firefox, Safari, Edge.",
          }),
        }}
      />

      {/* HowTo JSON-LD */}
      {howToSteps.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: pick(l, `How to use ${tool.name.en}`, `${tool.name.bn} কীভাবে ব্যবহার করবেন`),
              step: howToSteps,
            }),
          }}
        />
      )}

      {/* FAQ JSON-LD */}
      {faqEntities.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqEntities,
            }),
          }}
        />
      )}

      {/* Breadcrumb */}
      <nav
        className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-[var(--muted-foreground)]"
        aria-label={pick(l, "Breadcrumb", "ব্রেডক্রাম্ব")}
      >
        <Link href={`/${l}`} className="transition-colors hover:text-[var(--primary)]">
          {dict.ui.home}
        </Link>
        <ChevronRight size={12} aria-hidden="true" />
        <Link href={`/${l}/tools`} className="transition-colors hover:text-[var(--primary)]">
          {dict.nav.allTools}
        </Link>
        <ChevronRight size={12} aria-hidden="true" />
        <Link
          href={`/${l}/categories/${tool.category}`}
          className="transition-colors hover:text-[var(--primary)]"
        >
          {categoryName}
        </Link>
        <ChevronRight size={12} aria-hidden="true" />
        <span className="text-[var(--foreground)]">{tool.name[l]}</span>
      </nav>

      {/* Tool header */}
      <header className="mb-8 flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-subtle)] text-[var(--primary)]">
          <Icon size={24} aria-hidden />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] md:text-3xl">
              {tool.name[l]}
            </h1>
            {tool.popular && (
              <span className="rounded-full bg-[var(--warning-subtle)] px-2.5 py-0.5 text-xs font-semibold text-[var(--warning)]">
                {dict.ui.popularBadge}
              </span>
            )}
            {tool.new && (
              <span className="rounded-full bg-[var(--success-subtle)] px-2.5 py-0.5 text-xs font-semibold text-[var(--success)]">
                {dict.ui.newBadge}
              </span>
            )}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)] md:text-base">
            {tool.description[l]}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href={`/${l}/categories/${tool.category}`}
              className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-xs text-[var(--muted-foreground)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
            >
              {categoryName}
            </Link>
            {tool.keywords.slice(0, 3).map((kw) => (
              <span
                key={kw}
                className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-xs text-[var(--muted-foreground)]"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Tool workspace */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 md:p-8">
        {slug === "image-compressor" ? (
          <BatchImageProcessor mode="compress" />
        ) : slug === "image-format-converter" ? (
          <BatchImageProcessor mode="convert" />
        ) : slug === "pdf-merger" ? (
          <PdfMerger />
        ) : slug === "pdf-split-to-zip" ? (
          <PdfSplitter />
        ) : slug === "pdf-to-image" ? (
          <PdfPageSelector />
        ) : slug === "online-code-editor" ? (
          <CodeEditorUI locale={l} />
        ) : (
          <ToolRunner slug={slug} locale={l} dict={dict} />
        )}
      </div>

      {/* If specialized SEO content is available, display comprehensive deep sections */}
      {seo ? (
        <div className="mt-12 space-y-12">
          {/* Detailed Overview & Use Case */}
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">
              <Sparkles className="h-4 w-4" />
              <span>{l === "bn" ? "ব্যবহার ও পরিচিতি" : "Overview & Primary Use Case"}</span>
            </div>
            <h2 className="mt-2 text-xl font-bold tracking-tight text-[var(--foreground)] md:text-2xl">
              {l === "bn" ? `কেন ${tool.name.bn} ব্যবহার করবেন?` : `Why use ${tool.name.en}?`}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[var(--muted-foreground)] md:text-base">
              {seo.introduction[l]}
            </p>
            <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 shrink-0 text-[var(--primary)] mt-0.5" />
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]">
                    {l === "bn" ? "প্রধান ব্যবহারের ক্ষেত্র" : "Primary Use Case"}
                  </div>
                  <div className="mt-1 text-sm text-[var(--muted-foreground)]">
                    {seo.primaryUseCase[l]}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Key Features Grid */}
          <section>
            <h2 className="text-lg font-bold tracking-tight text-[var(--foreground)] md:text-xl">
              {l === "bn" ? "বিশেষ সুবিধাসমূহ" : "Key Features & Capabilities"}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {seo.features[l].map((feat, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition hover:border-[var(--border-strong)]"
                >
                  <div className="flex items-center gap-2 font-semibold text-[var(--foreground)] text-sm">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>{feat}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Step-by-Step Instructions */}
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8">
            <h2 className="text-lg font-bold tracking-tight text-[var(--foreground)] md:text-xl">
              {l === "bn" ? "ধাপে ধাপে ব্যবহারের নিয়ম" : "Step-by-Step Instructions"}
            </h2>
            <div className="mt-6 space-y-4">
              {seo.howToSteps[l].map((st, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="text-sm font-semibold text-[var(--foreground)]">
                      {st.title}
                    </div>
                    <div className="text-xs leading-relaxed text-[var(--muted-foreground)] md:text-sm">
                      {st.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Practical Real-World Examples */}
          {seo.examples[l].length > 0 && (
            <section>
              <h2 className="text-lg font-bold tracking-tight text-[var(--foreground)] md:text-xl">
                {l === "bn" ? "বাস্তবধর্মী ব্যবহারের উদাহরণ" : "Practical Real-World Examples"}
              </h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {seo.examples[l].map((ex, i) => (
                  <div
                    key={i}
                    className="flex flex-col justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"
                  >
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">
                        {ex.title}
                      </div>
                      <div className="mt-3 space-y-2 text-xs">
                        <div className="rounded-lg bg-[var(--surface-elevated)] p-2.5">
                          <span className="font-semibold text-[var(--foreground)]">
                            {l === "bn" ? "ইনপুট:" : "Input:"}{" "}
                          </span>
                          <span className="font-mono text-[var(--muted-foreground)]">{ex.input}</span>
                        </div>
                        <div className="rounded-lg bg-[var(--surface-elevated)] p-2.5">
                          <span className="font-semibold text-[var(--foreground)]">
                            {l === "bn" ? "আউটপুট:" : "Output:"}{" "}
                          </span>
                          <span className="font-mono text-[var(--foreground)]">{ex.output}</span>
                        </div>
                      </div>
                    </div>
                    {ex.explanation && (
                      <p className="mt-3 text-xs leading-relaxed text-[var(--muted-foreground)]">
                        {ex.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Limitations and Best Practices */}
          {seo.limitations[l].length > 0 && (
            <section className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400">
                <AlertCircle className="h-4 w-4" />
                <span>{l === "bn" ? "সীমাবদ্ধতা ও বিবেচ্য বিষয়" : "Technical Limitations & Best Practices"}</span>
              </div>
              <ul className="mt-3 space-y-2">
                {seo.limitations[l].map((lim, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[var(--muted-foreground)] md:text-sm">
                    <span className="text-amber-500 font-bold">&bull;</span>
                    <span>{lim}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Deep FAQs */}
          {seo.faq[l].length > 0 && (
            <section aria-labelledby="deep-faqs">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[var(--primary)]" />
                <h2 id="deep-faqs" className="text-lg font-bold tracking-tight text-[var(--foreground)] md:text-xl">
                  {dict.common.faqs}
                </h2>
              </div>
              <div className="mt-4 space-y-3">
                {seo.faq[l].map((f, i) => (
                  <details
                    key={i}
                    className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] transition hover:border-[var(--border-strong)]"
                  >
                    <summary className="flex list-none cursor-pointer items-center justify-between gap-4 p-4 text-sm font-medium">
                      <span>{f.q}</span>
                      <span
                        className="shrink-0 text-xl leading-none text-[var(--muted-foreground)] transition-transform group-open:rotate-45"
                        aria-hidden="true"
                      >
                        +
                      </span>
                    </summary>
                    <div className="border-t border-[var(--border)] px-4 pb-4 pt-3">
                      <p className="text-xs leading-relaxed text-[var(--muted-foreground)] md:text-sm">
                        {f.a}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Recommended Internal Guides */}
          {seo.relatedGuides && seo.relatedGuides[l] && seo.relatedGuides[l].length > 0 && (
            <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[var(--primary)]" />
                <h2 className="text-base font-bold text-[var(--foreground)]">
                  {l === "bn" ? "প্রাসঙ্গিক টুলস ও নির্দেশিকা" : "Related Workflows & Guides"}
                </h2>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {seo.relatedGuides[l].map((guide, i) => (
                  <Link
                    key={i}
                    href={guide.href}
                    className="flex flex-col justify-between rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] p-3.5 transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  >
                    <div className="text-xs font-semibold text-[var(--foreground)]">
                      {guide.title}
                    </div>
                    <div className="mt-1 text-[11px] text-[var(--muted-foreground)]">
                      {guide.snippet}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        /* Standard Fallback for tools without rich SEO content */
        <div className="mt-12 grid gap-10 md:grid-cols-5">
          <section className="md:col-span-3" aria-labelledby="how-to-use">
            <h2 id="how-to-use" className="text-lg font-semibold text-[var(--foreground)]">
              {dict.common.instructions}
            </h2>
            <ol className="mt-4 space-y-3">
              {tool.instructions[l].map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--primary-subtle)] text-xs font-bold text-[var(--primary)]">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 text-sm leading-relaxed text-[var(--muted-foreground)]">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <aside className="md:col-span-2">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <h2 className="mb-3 text-sm font-semibold text-[var(--foreground)]">
                {dict.ui.quickInfo}
              </h2>
              <ul className="space-y-2">
                {[
                  dict.ui.freeToUse,
                  dict.ui.noAccount,
                  dict.ui.browserBased,
                  dict.ui.fastResults,
                ].map((fact) => (
                  <li
                    key={fact}
                    className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]"
                  >
                    <CheckCircle2 size={14} className="shrink-0 text-[var(--success)]" aria-hidden="true" />
                    {fact}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      )}

      {/* Standard FAQs if no specialized SEO section */}
      {!seo && tool.faqs.length > 0 && (
        <section className="mt-12" aria-labelledby="tool-faqs">
          <h2 id="tool-faqs" className="text-lg font-semibold text-[var(--foreground)]">
            {dict.common.faqs}
          </h2>
          <div className="mt-4 space-y-3">
            {tool.faqs.map((f, i) => (
              <details
                key={i}
                className="group rounded-xl border border-[var(--border)] bg-[var(--surface)]"
              >
                <summary className="flex list-none cursor-pointer items-center justify-between gap-4 p-4 text-sm font-medium">
                  <span>{f.q[l]}</span>
                  <span
                    className="shrink-0 text-xl leading-none text-[var(--muted-foreground)] transition-transform group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <div className="border-t border-[var(--border)] px-4 pb-4 pt-3">
                  <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">{f.a[l]}</p>
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Related tools */}
      {relatedFallback.length > 0 && (
        <section className="mt-12" aria-labelledby="related-tools">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="related-tools" className="text-lg font-semibold text-[var(--foreground)]">
              {dict.common.relatedTools}
            </h2>
            <Link
              href={`/${l}/categories/${tool.category}`}
              className="inline-flex items-center gap-1 text-sm font-medium text-[var(--primary)] hover:underline"
            >
              {dict.ui.seeAll}
              <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {relatedFallback.map((t) => (
              <ToolCard key={t.id} tool={t} locale={l} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
