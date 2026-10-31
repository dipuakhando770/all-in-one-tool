import type { MetadataRoute } from "next";
import { allTools } from "@/tools/registry";
import { locales } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://tools.nasirdigitalhub.com";
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    entries.push({ url: `${base}/${locale}`, changeFrequency: "weekly", priority: 1 });
    entries.push({ url: `${base}/${locale}/tools`, changeFrequency: "weekly", priority: 0.9 });
    entries.push({ url: `${base}/${locale}/categories`, changeFrequency: "weekly", priority: 0.8 });
    for (const t of allTools) {
      entries.push({ url: `${base}/${locale}/tools/${t.slug}`, changeFrequency: "monthly", priority: 0.7 });
    }
  }
  return entries;
}
