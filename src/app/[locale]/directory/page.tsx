import type { Metadata } from "next";
import { allTools } from "@/tools/registry";
import { buildToolIndex } from "@/lib/tool-discovery";
import type { Locale } from "@/lib/i18n";
import { DirectoryClient } from "./directory-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isBn = locale === "bn";
  const base = "https://tools.nasirdigitalhub.com";
  return {
    title: isBn ? "A–Z টুল ডিরেক্টরি — নাসির টুলস" : "A–Z Tool Directory — Nasir Tools",
    description: isBn
      ? `নাসির টুলসের ${allTools.length}টি ফ্রি অনলাইন টুলের সম্পূর্ণ বর্ণানুক্রমিক তালিকা।`
      : `Browse all ${allTools.length} free online tools on Nasir Tools alphabetically or by category.`,
    alternates: {
      canonical: `${base}/${locale}/directory`,
      languages: {
        en: `${base}/en/directory`,
        bn: `${base}/bn/directory`,
        "x-default": `${base}/en/directory`,
      },
    },
  };
}

export default async function DirectoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tools = buildToolIndex(allTools);
  return <DirectoryClient locale={locale as Locale} tools={tools} />;
}
