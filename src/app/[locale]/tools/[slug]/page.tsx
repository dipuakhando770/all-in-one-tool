import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { getToolBySlug } from "@/tools/registry";
import { ToolRunner } from "@/components/tool-runner";
import { BatchImageProcessor } from "@/components/batch-image-processor";
import { PdfPageSelector } from "@/components/pdf-page-selector";
import { PdfMerger } from "@/components/pdf-merger";
import { PdfSplitter } from "@/components/pdf-splitter";
import type { Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
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
  };
}

export default async function ToolPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const l = locale as Locale;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();
  const dict = await getDictionary(l);
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold">{tool.name[l]}</h1>
      <p className="mt-2 text-[var(--foreground)]/70">{tool.description[l]}</p>

      <div className="mt-6">
        {slug === "image-compressor" ? (
          <BatchImageProcessor mode="compress" />
        ) : slug === "image-format-converter" ? (
          <BatchImageProcessor mode="convert" />
        ) : slug === "pdf-merger" ? (
          <PdfMerger />
        ) : slug === "pdf-page-extractor" ? (
          <PdfSplitter />
        ) : slug === "pdf-to-image" ? (
          <PdfPageSelector />
        ) : (
          <ToolRunner slug={slug} locale={l} dict={dict} />
        )}
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">{dict.common.instructions}</h2>
        <ul className="mt-2 list-disc pl-6">
          {tool.instructions[l].map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </section>

      {tool.faqs.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">{dict.common.faqs}</h2>
          <div className="mt-2 space-y-3">
            {tool.faqs.map((f, i) => (
              <div key={i} className="rounded-lg border border-[var(--border)] p-4">
                <div className="font-semibold">{f.q[l]}</div>
                <div className="text-sm text-[var(--foreground)]/70">{f.a[l]}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
