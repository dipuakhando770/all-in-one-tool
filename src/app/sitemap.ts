import type { MetadataRoute } from "next";
import { allTools } from "@/tools/registry";
import { categories } from "@/lib/categories";
import { locales } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://tools.nasirdigitalhub.com";
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    // Primary landing pages
    entries.push({ url: `${base}/${locale}`, changeFrequency: "daily", priority: 1.0 });
    entries.push({ url: `${base}/${locale}/tools`, changeFrequency: "daily", priority: 0.9 });
    entries.push({ url: `${base}/${locale}/popular`, changeFrequency: "daily", priority: 0.9 });
    entries.push({ url: `${base}/${locale}/categories`, changeFrequency: "weekly", priority: 0.8 });
    entries.push({ url: `${base}/${locale}/directory`, changeFrequency: "weekly", priority: 0.8 });
    entries.push({ url: `${base}/${locale}/pricing`, changeFrequency: "monthly", priority: 0.7 });
    entries.push({ url: `${base}/${locale}/blog`, changeFrequency: "weekly", priority: 0.7 });
    entries.push({ url: `${base}/${locale}/privacy`, changeFrequency: "yearly", priority: 0.3 });
    entries.push({ url: `${base}/${locale}/terms`, changeFrequency: "yearly", priority: 0.3 });

    // Category hubs
    for (const cat of categories) {
      entries.push({
        url: `${base}/${locale}/categories/${cat.slug}`,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }

    // All individual tools (157+)
    for (const t of allTools) {
      entries.push({
        url: `${base}/${locale}/tools/${t.slug}`,
        changeFrequency: "weekly",
        priority: t.popular ? 0.9 : 0.7,
      });
    }
  }

  return entries;
}
