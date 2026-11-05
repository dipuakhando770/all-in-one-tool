import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { getToolBySlug, allTools } from "@/tools/registry";
import { ToolRunner } from "@/components/tool-runner";
import { BatchImageProcessor } from "@/components/batch-image-processor";
import { PdfPageSelector } from "@/components/pdf-page-selector";
import { PdfMerger } from "@/components/pdf-merger";
import { PdfSplitter } from "@/components/pdf-splitter";
import { CodeEditorUI } from "@/components/code-editor-ui";
import { ToolCard } from "@/components/tool-card";
import type { Locale } from "@/lib/i18n";
import Link from "next/link";
import { CheckCircle2, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import * as Icons from "lucide-react";
import { getToolIcon } from "@/lib/icons";

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
    alternates: {
      canonical: `https://tools.nasirdigitalhub.com/${locale}/tools/${slug}`,
      languages: {
        en: `https://tools.nasirdigitalhub.com/en/tools/${slug}`,
        bn: `https://tools.nasirdigitalhub.com/bn/tools/${slug}`,
      },
    },
    openGraph: {
      title: tool.seoTitle[l],
      description: tool.seoDescription[l],
      url: `https://tools.nasirdigitalhub.com/${locale}/tools/${slug}`,
      siteName: "Nasir Tools",
      locale: locale === "bn" ? "bn_BD" : "en_US",
      type: "website",
    },
  };
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

  // Related tools
  const related = tool.related
    .map((s) => getToolBySlug(s))
    .filter(Boolean)
    .slice(0, 4) as typeof allTools;

  // If no explicit related, get from same category
  const relatedFallback =
    related.length === 0
      ? allTools
          .filter((t) => t.category === tool.category && t.slug !== tool.slug)
          .slice(0, 4)
      : related;

  const iconName = getToolIcon(tool.slug, tool.icon);
  const IconsRecord = Icons as unknown as Record<string, React.ComponentType<{size?: number}>>;
  const Icon = IconsRecord[iconName] || Icons.Wrench;

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
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: `https://tools.nasirdigitalhub.com/${l}`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Tools",
                item: `https://tools.nasirdigitalhub.com/${l}/tools`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: tool.name[l],
                item: `https://tools.nasirdigitalhub.com/${l}/tools/${tool.slug}`,
              },
            ],
          }),
        }}
      />

      {/* SoftwareApplication JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: tool.name[l],
            description: tool.seoDescription[l],
            url: `https://tools.nasirdigitalhub.com/${l}/tools/${tool.slug}`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Web Browser",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            browserRequirements: "Requires JavaScript. Works on Chrome, Firefox, Safari, Edge.",
            permissions: tool.slug.includes("image") || tool.slug.includes("pdf") ? "File upload (processed locally)" : "None",
          }),
        }}
      />

      {/* FAQ JSON-LD */}
      {tool.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: tool.faqs.map((f) => ({
                "@type": "Question",
                name: f.q[l],
                acceptedAnswer: {
                  "@type": "Answer",
                  text: f.a[l],
                },
              })),
            }),
          }}
        />
      )}

      {/* Breadcrumb */}
      <nav
        className="mb-6 flex items-center gap-1.5 text-xs"
        style={{ color: "var(--muted-foreground)" }}
        aria-label="Breadcrumb"
      >
        <Link href={`/${l}`} className="hover:text-[var(--primary)] transition-colors">
          Home
        </Link>
        <ChevronRight size={12} />
        <Link href={`/${l}/tools`} className="hover:text-[var(--primary)] transition-colors">
          All Tools
        </Link>
        <ChevronRight size={12} />
        <Link
          href={`/${l}/tools?category=${tool.category}`}
          className="hover:text-[var(--primary)] transition-colors capitalize"
        >
          {tool.category}
        </Link>
        <ChevronRight size={12} />
        <span style={{ color: "var(--foreground)" }}>{tool.name[l]}</span>
      </nav>

      {/* Tool header */}
      <div className="mb-8 flex items-start gap-4">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
          style={{ background: "var(--primary-subtle)", color: "var(--primary)" }}
        >
          <Icon size={24} />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              {tool.name[l]}
            </h1>
            {tool.popular && (
              <span
                className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                style={{ background: "var(--warning-subtle)", color: "var(--warning)" }}
              >
                Popular
              </span>
            )}
            {tool.new && (
              <span
                className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                style={{ background: "var(--success-subtle)", color: "var(--success)" }}
              >
                New
              </span>
            )}
          </div>
          <p className="mt-2 text-sm leading-relaxed md:text-base" style={{ color: "var(--muted-foreground)" }}>
            {tool.description[l]}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span
              className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-xs capitalize"
              style={{ color: "var(--muted-foreground)" }}
            >
              {tool.category}
            </span>
            {tool.keywords.slice(0, 3).map((kw) => (
              <span
                key={kw}
                className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-xs"
                style={{ color: "var(--muted-foreground)" }}
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tool workspace */}
      <div
        className="rounded-2xl border border-[var(--border)] p-5 md:p-8"
        style={{ background: "var(--surface)" }}
      >
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

      <div className="mt-12 grid gap-10 md:grid-cols-5">
        {/* Instructions */}
        <div className="md:col-span-3">
          <h2 className="text-lg font-semibold">{dict.common.instructions}</h2>
          <ol className="mt-4 space-y-3">
            {tool.instructions[l].map((step, i) => (
              <li key={i} className="flex gap-3">
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                  style={{ background: "var(--primary-subtle)", color: "var(--primary)" }}
                >
                  {i + 1}
                </span>
                <span className="text-sm leading-relaxed pt-0.5" style={{ color: "var(--muted-foreground)" }}>
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Quick facts sidebar */}
        <div className="md:col-span-2">
          <div
            className="rounded-xl border border-[var(--border)] p-5"
            style={{ background: "var(--surface)" }}
          >
            <h3 className="text-sm font-semibold mb-3">Quick Info</h3>
            <ul className="space-y-2">
              {[
                "Free to use",
                "No account required",
                "Browser-based processing",
                "Fast results",
              ].map((fact) => (
                <li key={fact} className="flex items-center gap-2 text-sm" style={{ color: "var(--muted-foreground)" }}>
                  <CheckCircle2 size={14} style={{ color: "var(--success)" }} className="shrink-0" />
                  {fact}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* FAQs */}
      {tool.faqs.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-semibold">{dict.common.faqs}</h2>
          <div className="mt-4 space-y-3">
            {tool.faqs.map((f, i) => (
              <details
                key={i}
                className="group rounded-xl border border-[var(--border)] bg-[var(--surface)]"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 p-4 font-medium text-sm list-none">
                  <span>{f.q[l]}</span>
                  <span
                    className="shrink-0 text-xl leading-none transition-transform group-open:rotate-45"
                    style={{ color: "var(--muted-foreground)" }}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <div className="border-t border-[var(--border)] px-4 pb-4 pt-3">
                  <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                    {f.a[l]}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Related tools */}
      {relatedFallback.length > 0 && (
        <section className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{dict.common.relatedTools}</h2>
            <Link
              href={`/${l}/tools?category=${tool.category}`}
              className="text-sm font-medium hover:underline"
              style={{ color: "var(--primary)" }}
            >
              See all →
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
