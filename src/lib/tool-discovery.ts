import type { Locale } from "@/lib/i18n";
import type { ToolDefinition } from "@/lib/tools/types";

/**
 * Lightweight, serializable representation of a tool.
 *
 * Client components (command palette, search, directory) must only receive
 * this shape instead of the full registry. The registry pulls in heavy
 * browser libraries (pdf-lib, jszip, pdfjs) and must stay on the server.
 */
export type ToolIndexEntry = {
  slug: string;
  name: Record<Locale, string>;
  description: Record<Locale, string>;
  category: string;
  icon: string;
  keywords: string[];
  popular?: boolean;
  new?: boolean;
};

/** Structural subset of a tool used by tool cards and discovery UI. */
export type ToolCardData = Pick<
  ToolIndexEntry,
  "slug" | "name" | "description" | "category" | "icon" | "popular" | "new"
>;

export function buildToolIndex(tools: ToolDefinition[]): ToolIndexEntry[] {
  return tools.map((t) => ({
    slug: t.slug,
    name: t.name,
    description: t.description,
    category: t.category,
    icon: t.icon,
    keywords: t.keywords,
    popular: t.popular,
    new: t.new,
  }));
}

/**
 * Bilingual intent synonyms.
 *
 * These map natural phrasing (English and Bengali) onto the tool that
 * actually performs the task. Only real, registered tools are referenced.
 */
export const TOOL_SYNONYMS: Record<string, string[]> = {
  "image-compressor": [
    "compress image",
    "reduce image size",
    "image size kam",
    "ছবি কম্প্রেস",
    "ছবির সাইজ কমানো",
    "ছবি ছোট করা",
    "ইমেজ কমপ্রেস",
  ],
  "image-resizer": ["resize image", "change image size", "ছবি রিসাইজ", "ছবির মাপ"],
  "image-format-converter": [
    "convert image",
    "jpg to png",
    "png to jpg",
    "webp converter",
    "ছবি কনভার্ট",
    "জেপিজি থেকে পিএনজি",
  ],
  "image-cropper": ["crop image", "ছবি ক্রপ", "ছবি কাটা"],
  "background-remover": [
    "remove background",
    "transparent background",
    "ব্যাকগ্রাউন্ড রিমুভ",
    "পটভূমি সরানো",
  ],
  "image-rotator": ["rotate image", "ছবি ঘোরানো"],
  "image-flipper": ["flip image", "mirror image", "ছবি উল্টানো"],
  "pdf-merger": ["merge pdf", "combine pdf", "pdf jod", "পিডিএফ একসাথে", "পিডিএফ জোড়া", "pdf মার্জ"],
  "pdf-split-to-zip": ["split pdf", "pdf ভাগ", "পিডিএফ আলাদা"],
  "pdf-page-extractor": ["extract pdf pages", "pdf পেজ বের করা"],
  "pdf-page-deleter": ["delete pdf pages", "pdf পেজ মুছুন"],
  "pdf-rotator": ["rotate pdf", "pdf ঘোরানো"],
  "pdf-to-image": ["pdf to jpg", "pdf to png", "pdf থেকে ছবি"],
  "pdf-to-text": ["pdf to text", "extract text from pdf", "pdf থেকে টেক্সট", "পিডিএফ থেকে লেখা"],
  "pdf-watermark": ["watermark pdf", "pdf watermark", "পিডিএফ ওয়াটারমার্ক"],
  "image-to-pdf": ["jpg to pdf", "image to pdf", "ছবি থেকে পিডিএফ"],
  "pdf-page-count": ["pdf page count", "পিডিএফ পেজ সংখ্যা"],
  "pdf-add-page-numbers": ["add page numbers", "পেজ নম্বর"],
  "word-counter": ["word count", "শব্দ গণনা", "কত শব্দ"],
  "character-counter": ["character count", "letter count", "অক্ষর গণনা"],
  "case-converter": ["uppercase", "lowercase", "capitalize", "বড় হাতের", "ছোট হাতের"],
  "json-formatter": ["format json", "prettify json", "json সুন্দর", "json ফরম্যাট"],
  "json-validator": ["validate json", "json check", "json ভ্যালিডেট"],
  "json-to-csv": ["json to csv", "json থেকে csv", "json to excel"],
  "csv-to-json": ["csv to json", "csv থেকে json"],
  "base64-encode-decode": ["base64 encode", "base64 decode", "বেস৬৪"],
  "url-encode-decode": ["url encode", "url decode", "ইউআরএল এনকোড"],
  "jwt-decoder": ["decode jwt", "jwt token", "জেডব্লিউটি"],
  "qr-code-generator": ["qr code", "কিউআর কোড", "কিউআর"],
  "password-generator": ["password generator", "strong password", "পাসওয়ার্ড তৈরি", "পাসওয়ার্ড জেনারেটর"],
  "hash-generator": ["md5", "sha256", "hash", "হ্যাশ"],
  "regex-tester": ["regex", "regular expression", "রেজেক্স"],
  "uuid-generator": ["uuid", "guid", "ইউইউআইডি"],
  "cron-expression-generator": ["cron", "cron expression", "ক্রন"],
  "color-contrast-checker": ["contrast checker", "wcag contrast", "কালার কনট্রাস্ট"],
  "age-calculator": ["age", "how old am i", "কত বয়স", "বয়স নির্ণয়"],
  "percentage-calculator": ["percentage", "শতকরা", "পার্সেন্টেজ"],
  "loan-calculator": ["loan", "emi", "ঋণ", "লোন"],
  "vat-calculator": ["vat", "ভ্যাট"],
  "unit-converter": ["unit converter", "একক রূপান্তর"],
  "word-frequency-counter": ["word frequency", "শব্দের পুনরাবৃত্তি"],
  "lorem-ipsum-generator": ["lorem ipsum", "dummy text", "লরেম ইপসাম"],
  "password-strength-checker": ["password strength", "পাসওয়ার্ড শক্তি"],
  "meta-tag-generator": ["meta tags", "মেটা ট্যাগ"],
  "robots-txt-generator": ["robots.txt", "রোবট টেক্সট"],
  "sitemap-xml-generator": ["sitemap", "সাইটম্যাপ"],
  "schema-markup-generator": ["schema markup", "structured data", "স্কিমা"],
  "serp-snippet-preview": ["serp preview", "google preview", "গুগল প্রিভিউ"],
  "youtube-title-generator": ["youtube title", "ইউটিউব টাইটেল"],
  "hashtag-generator": ["hashtag", "হ্যাশট্যাগ"],
  "ai-text-rewriter": ["rewrite text", "paraphrase", "লেখা পরিবর্তন"],
  "text-summarizer": ["summarize", "summary", "সারাংশ", "সারমর্ম"],
  "text-diff-checker": ["diff", "compare text", "তুলনা"],
  "markdown-editor": ["markdown", "মার্কডাউন"],
  "online-code-editor": ["code editor", "html editor", "কোড এডিটর"],
  "favicon-generator": ["favicon", "site icon", "ফ্যাভিকন"],
  "image-watermark": ["watermark image", "ছবিতে ওয়াটারমার্ক"],
  "image-dimensions-checker": ["image size", "dimensions", "ছবির মাপ"],
  "color-picker": ["color picker", "eye dropper", "রং বাছাই"],
  "color-converter": ["hex to rgb", "rgb to hex", "কালার কনভার্টার"],
  "user-agent-parser": ["user agent", "ইউজার এজেন্ট"],
  "unix-timestamp-converter": ["unix timestamp", "epoch", "টাইমস্ট্যাম্প"],
  "emi-calculator": ["emi", "ইএমআই"],
  "electricity-bill-calculator": ["electricity bill", "বিদ্যুৎ বিল"],
};

/**
 * Research-backed, editorial ordering of high-demand workflows.
 * This is a curated list of popular *task categories*, not fabricated usage
 * counts. No imaginary popularity numbers are displayed anywhere in the UI.
 */
export const TRENDING_SLUGS: string[] = [
  "image-compressor",
  "pdf-merger",
  "background-remover",
  "pdf-to-text",
  "image-format-converter",
  "word-counter",
  "pdf-split-to-zip",
  "json-formatter",
  "image-to-pdf",
  "qr-code-generator",
  "pdf-watermark",
  "json-to-csv",
];

export const FEATURED_SLUGS: string[] = [
  "image-compressor",
  "image-resizer",
  "image-cropper",
  "background-remover",
  "pdf-merger",
  "pdf-split-to-zip",
  "pdf-to-image",
  "image-to-pdf",
  "json-formatter",
  "base64-encode-decode",
  "regex-tester",
  "qr-code-generator",
  "word-counter",
  "age-calculator",
  "percentage-calculator",
  "ai-text-rewriter",
];

/** Normalize a query: lowercase, strip punctuation, collapse whitespace. */
function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()"'?[\]<>|\\+]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function haystack(entry: ToolIndexEntry): string {
  return normalize(
    [
      entry.slug,
      entry.name.en,
      entry.name.bn,
      entry.description.en,
      entry.description.bn,
      entry.category,
      ...entry.keywords,
      ...(TOOL_SYNONYMS[entry.slug] || []),
    ].join(" ")
  );
}

function scoreEntry(entry: ToolIndexEntry, normalizedQuery: string, tokens: string[]): number {
  const nameEn = normalize(entry.name.en);
  const nameBn = normalize(entry.name.bn);
  const slug = normalize(entry.slug.replace(/-/g, " "));
  const synonyms = (TOOL_SYNONYMS[entry.slug] || []).map(normalize);

  let score = 0;
  if (nameEn === normalizedQuery || nameBn === normalizedQuery || slug === normalizedQuery) {
    score += 120;
  }
  if (nameEn.startsWith(normalizedQuery) || nameBn.startsWith(normalizedQuery)) score += 80;
  if (slug.startsWith(normalizedQuery)) score += 60;
  if (nameEn.includes(normalizedQuery) || nameBn.includes(normalizedQuery)) score += 50;
  if (synonyms.some((s) => s === normalizedQuery)) score += 70;
  else if (synonyms.some((s) => s.includes(normalizedQuery))) score += 40;
  if (entry.keywords.some((k) => normalize(k).includes(normalizedQuery))) score += 35;
  if (normalize(entry.category).includes(normalizedQuery)) score += 20;

  const hay = haystack(entry);
  if (hay.includes(normalizedQuery)) score += 10;

  const matchedTokens = tokens.filter((t) => t.length > 1 && hay.includes(t)).length;
  if (tokens.length > 0) {
    score += (matchedTokens / tokens.length) * 25;
    if (matchedTokens === tokens.length) score += 15;
  }

  if (entry.popular) score += 3;
  return score;
}

/** Ranked search across names, descriptions, keywords and bilingual synonyms. */
export function searchToolIndex(index: ToolIndexEntry[], query: string): ToolIndexEntry[] {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return index;

  const tokens = normalizedQuery.split(" ").filter(Boolean);
  const ranked = index
    .map((entry) => ({ entry, score: scoreEntry(entry, normalizedQuery, tokens) }))
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score || a.entry.name.en.localeCompare(b.entry.name.en));

  return ranked.map((row) => row.entry);
}

/** Autocomplete-style suggestions (deduplicated, ranked). */
export function suggestTools(
  index: ToolIndexEntry[],
  query: string,
  limit = 6
): ToolIndexEntry[] {
  if (!query.trim()) return [];
  return searchToolIndex(index, query).slice(0, limit);
}

/** Resolve slugs to index entries, preserving the requested order. */
export function pickTools(index: ToolIndexEntry[], slugs: string[]): ToolIndexEntry[] {
  const bySlug = new Map(index.map((entry) => [entry.slug, entry]));
  return slugs.map((slug) => bySlug.get(slug)).filter((t): t is ToolIndexEntry => Boolean(t));
}
