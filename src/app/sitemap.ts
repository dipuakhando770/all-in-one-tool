import type { MetadataRoute } from "next";
import { allTools } from "@/tools/registry";
import { categories } from "@/lib/categories";
import { locales } from "@/lib/i18n";

const BASE = "https://tools.nasirdigitalhub.com";
const LAST_MODIFIED = new Date();

function languageAlternates(path: string) {
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = `${BASE}/${l}${path}`;
  }
  languages["x-default"] = `${BASE}/en${path}`;
  return { languages };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  const staticPages: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }> = [
    { path: "", changeFrequency: "daily", priority: 1.0 },
    { path: "/tools", changeFrequency: "daily", priority: 0.9 },
    { path: "/popular", changeFrequency: "daily", priority: 0.9 },
    { path: "/categories", changeFrequency: "weekly", priority: 0.8 },
    { path: "/directory", changeFrequency: "weekly", priority: 0.8 },
    { path: "/pricing", changeFrequency: "monthly", priority: 0.7 },
    { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  ];

  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${BASE}/${locale}${page.path}`,
        lastModified: LAST_MODIFIED,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: languageAlternates(page.path),
      });
    }

    for (const cat of categories) {
      const path = `/categories/${cat.slug}`;
      entries.push({
        url: `${BASE}/${locale}${path}`,
        lastModified: LAST_MODIFIED,
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: languageAlternates(path),
      });
    }

    for (const tool of allTools) {
      const path = `/tools/${tool.slug}`;
      entries.push({
        url: `${BASE}/${locale}${path}`,
        lastModified: LAST_MODIFIED,
        changeFrequency: "weekly",
        priority: tool.popular ? 0.9 : 0.7,
        alternates: languageAlternates(path),
      });
    }
  }

  return entries;
}
