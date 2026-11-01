import { getDictionary } from "@/lib/dictionary";
import { getToolsByCategory } from "@/tools/registry";
import { ToolCard } from "@/components/tool-card";
import type { Locale } from "@/lib/i18n";
import Link from "next/link";

export default async function ImageStudioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale;
  const dict = await getDictionary(l);
  const imageTools = getToolsByCategory("image");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
      <h1 className="text-3xl font-bold tracking-tight">Image Studio</h1>
      <p className="mt-2 text-sm" style={{ color: "var(--muted-foreground)" }}>
        Professional browser-based image tools. Files stay in your browser.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {imageTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} locale={l} />
        ))}
      </div>
      <div className="mt-8">
        <Link href={`/${l}/tools?category=image`} className="text-sm font-medium hover:underline" style={{ color: "var(--primary)" }}>
          View all image tools →
        </Link>
      </div>
    </div>
  );
}
