import type { ToolDefinition } from "@/lib/tools/types";
import type { Locale } from "@/lib/i18n";

const L = (en: string, bn: string): Record<Locale, string> => ({ en, bn });
const LI = (en: string[], bn: string[]): Record<Locale, string[]> => ({ en, bn });

export const textTools: ToolDefinition[] = [
  {
    id: "word-counter", slug: "word-counter", category: "text", icon: "Hash",
    name: L("Word Counter", "ওয়ার্ড কাউন্টার"),
    description: L("Count words, sentences and paragraphs in your text.", "টেক্সটের শব্দ, বাক্য ও অনুচ্ছেদ গণনা করুন।"),
    inputSchema: [{ name: "text", label: L("Text", "টেক্সট"), type: "textarea", placeholder: L("Paste your text here...", "এখানে টেক্সট পেস্ট করুন..."), required: true }],
    run: (input) => {
      const t = String(input.text || "");
      const words = t.trim() ? t.trim().split(/\s+/).length : 0;
      const chars = t.length;
      const charsNoSpace = t.replace(/\s/g, "").length;
      const sentences = t.trim() ? (t.match(/[.!?]+/g) || []).length || 1 : 0;
      const paragraphs = t.trim() ? t.split(/\n\s*\n/).filter(Boolean).length : 0;
      const lines = t ? t.split(/\n/).length : 0;
      return { kind: "text", value: `Words: ${words}\nCharacters: ${chars}\nCharacters (no spaces): ${charsNoSpace}\nSentences: ${sentences}\nParagraphs: ${paragraphs}\nLines: ${lines}` };
    },
    seoTitle: L("Word Counter - Count Words, Characters & Sentences", "ওয়ার্ড কাউন্টার - শব্দ, অক্ষর ও বাক্য গণনা"),
    seoDescription: L("Free online word counter. Count words, characters, sentences, paragraphs and lines instantly.", "ফ্রি অনলাইন ওয়ার্ড কাউন্টার। তাৎক্ষণিক শব্দ, অক্ষর, বাক্য, অনুচ্ছেদ ও লাইন গণনা।"),
    keywords: ["word counter", "character count", "sentence count"],
    instructions: LI(["Paste your text in the box.", "Click Run to see counts."], ["বক্সে টেক্সট পেস্ট করুন।", "গণনা দেখতে Run চাপুন।"]),
    faqs: [{ q: L("Is it free?", "এটি কি ফ্রি?"), a: L("Yes, completely free.", "হ্যাঁ, সম্পূর্ণ ফ্রি।") }],
    related: ["character-counter", "reading-time-calculator"],
  },
  {
    id: "character-counter", slug: "character-counter", category: "text", icon: "Type",
    name: L("Character Counter", "ক্যারেক্টার কাউন্টার"),
    description: L("Count characters with and without spaces.", "স্পেসসহ ও স্পেসবিহীন অক্ষর গণনা।"),
    inputSchema: [{ name: "text", label: L("Text", "টেক্সট"), type: "textarea", required: true }],
    run: (input) => {
      const t = String(input.text || "");
      return { kind: "text", value: `Characters: ${t.length}\nCharacters (no spaces): ${t.replace(/\s/g, "").length}\nWords: ${t.trim() ? t.trim().split(/\s+/).length : 0}` };
    },
    seoTitle: L("Character Counter", "ক্যারেক্টার কাউন্টার"),
    seoDescription: L("Count characters instantly.", "তাৎক্ষণিক অক্ষর গণনা।"),
    keywords: ["character counter"],
    instructions: LI(["Paste text and run."], ["টেক্সট পেস্ট করে চালান।"]),
    faqs: [],
    related: ["word-counter"],
  },
];
