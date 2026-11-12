import { imageTools } from "@/tools/image";
import { textTools } from "@/tools/text";
import { developerTools } from "@/tools/developer";
import { calculatorTools } from "@/tools/calculator";
import { seoTools } from "@/tools/seo";
import { socialTools } from "@/tools/social";
import { aiTools } from "@/tools/ai";
import { extraTools } from "@/tools/extra";
import { moreTools } from "@/tools/more";
import { pdfTools } from "@/tools/pdf";
import { codeEditorTools } from "@/tools/code-editor";
import { trendingTools } from "@/tools/trending";
import { buildToolIndex, pickTools, searchToolIndex, TRENDING_SLUGS, FEATURED_SLUGS } from "@/lib/tool-discovery";
import type { ToolDefinition } from "@/lib/tools/types";

export const allTools: ToolDefinition[] = [
  ...imageTools,
  ...textTools,
  ...developerTools,
  ...calculatorTools,
  ...seoTools,
  ...socialTools,
  ...aiTools,
  ...extraTools,
  ...moreTools,
  ...pdfTools,
  ...codeEditorTools,
  ...trendingTools,
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

/** Server-side tool index. Never import this into a client component. */
export const toolIndex = buildToolIndex(allTools);

/** Ranked search with bilingual synonyms. */
export function searchTools(query: string) {
  return searchToolIndex(toolIndex, query)
    .map((entry) => getToolBySlug(entry.slug))
    .filter((t): t is ToolDefinition => Boolean(t));
}

/** Curated high-demand workflows, resolved against the live registry. */
export function getTrendingTools(limit = 8) {
  return pickTools(toolIndex, TRENDING_SLUGS)
    .map((entry) => getToolBySlug(entry.slug))
    .filter((t): t is ToolDefinition => Boolean(t))
    .slice(0, limit);
}

/** Editorially featured tools, resolved against the live registry. */
export function getFeaturedTools(limit = 8) {
  return pickTools(toolIndex, FEATURED_SLUGS)
    .map((entry) => getToolBySlug(entry.slug))
    .filter((t): t is ToolDefinition => Boolean(t))
    .slice(0, limit);
}
