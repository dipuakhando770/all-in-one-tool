import { imageTools } from "@/tools/image";
import { textTools } from "@/tools/text";
import { developerTools } from "@/tools/developer";
import { calculatorTools } from "@/tools/calculator";
import { seoTools } from "@/tools/seo";
import { socialTools } from "@/tools/social";
import { aiTools } from "@/tools/ai";
import type { ToolDefinition } from "@/lib/tools/types";

export const allTools: ToolDefinition[] = [
  ...imageTools,
  ...textTools,
  ...developerTools,
  ...calculatorTools,
  ...seoTools,
  ...socialTools,
  ...aiTools,
];

export function getToolBySlug(slug: string) {
  return allTools.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: string) {
  return allTools.filter((t) => t.category === category);
}

export function getPopularTools() {
  return allTools.filter((t) => t.popular).slice(0, 12);
}

export function getNewTools() {
  return allTools.filter((t) => t.new).slice(0, 12);
}

// Search index with synonyms (English + Bengali keywords)
const synonyms: Record<string, string[]> = {
  "image-compressor": ["ছবির সাইজ কমানো", "compress image", "reduce image size"],
  "merge-pdf": ["PDF একসাথে করা"],
  "json-formatter": ["JSON সুন্দর করা", "format json"],
  "age-calculator": ["কত বয়স হয়েছে", "calculate age"],
};

export function searchTools(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return allTools;
  return allTools.filter((t) => {
    const haystack = [
      t.slug,
      t.name.en,
      t.name.bn,
      t.description.en,
      t.description.bn,
      t.category,
      ...t.keywords,
      ...(synonyms[t.slug] || []),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}
