import type { ToolDefinition } from "@/lib/tools/types";
import type { Locale } from "@/lib/i18n";

const L = (en: string, bn: string): Record<Locale, string> => ({ en, bn });
const LI = (en: string[], bn: string[]): Record<Locale, string[]> => ({ en, bn });

export const extraTools: ToolDefinition[] = [
  {
    id: "case-converter", slug: "case-converter", category: "text", icon: "Type",
    name: L("Case Converter", "কেস কনভার্টার"),
    description: L("Convert text to upper, lower, title or sentence case.", "টেক্সট বড়/ছোট/টাইটেল/বাক্য কেসে রূপান্তর।"),
    inputSchema: [
      { name: "text", label: L("Text", "টেক্সট"), type: "textarea", required: true },
      { name: "mode", label: L("Mode", "মোড"), type: "select", options: [
        { value: "upper", label: L("UPPERCASE", "বড় হাত") },
        { value: "lower", label: L("lowercase", "ছোট হাত") },
        { value: "title", label: L("Title Case", "টাইটেল কেস") },
        { value: "sentence", label: L("Sentence case", "বাক্য কেস") },
      ] },
    ],
    run: (input) => {
      const t = String(input.text || "");
      const mode = input.mode || "upper";
      let out = t;
      if (mode === "upper") out = t.toUpperCase();
      else if (mode === "lower") out = t.toLowerCase();
      else if (mode === "title") out = t.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
      else if (mode === "sentence") out = t.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
      return { kind: "text", value: out };
    },
    seoTitle: L("Case Converter", "কেস কনভার্টার"),
    seoDescription: L("Convert text case online.", "অনলাইনে টেক্সট কেস রূপান্তর।"),
    keywords: ["case converter", "uppercase", "lowercase"],
    instructions: LI(["Paste text and choose mode."], ["টেক্সট পেস্ট করে মোড বেছে নিন।"]),
    faqs: [],
    related: ["word-counter"],
  },
  {
    id: "text-cleaner", slug: "text-cleaner", category: "text", icon: "Eraser",
    name: L("Text Cleaner", "টেক্সট ক্লিনার"),
    description: L("Remove extra spaces, line breaks and trim text.", "অতিরিক্ত স্পেস, লাইন ব্রেক সরান ও ট্রিম করুন।"),
    inputSchema: [{ name: "text", label: L("Text", "টেক্সট"), type: "textarea", required: true }],
    run: (input) => {
      const t = String(input.text || "");
      const out = t.replace(/\s+/g, " ").trim();
      return { kind: "text", value: out };
    },
    seoTitle: L("Text Cleaner", "টেক্সট ক্লিনার"),
    seoDescription: L("Clean and normalize text.", "টেক্সট পরিষ্কার ও স্বাভাবিক করুন।"),
    keywords: ["text cleaner", "remove spaces"],
    instructions: LI(["Paste text and run."], ["টেক্সট পেস্ট করে চালান।"]),
    faqs: [],
    related: ["word-counter"],
  },
  {
    id: "duplicate-line-remover", slug: "duplicate-line-remover", category: "text", icon: "ListFilter",
    name: L("Duplicate Line Remover", "ডুপ্লিকেট লাইন রিমুভার"),
    description: L("Remove duplicate lines from text.", "টেক্সট থেকে ডুপ্লিকেট লাইন সরান।"),
    inputSchema: [{ name: "text", label: L("Text", "টেক্সট"), type: "textarea", required: true }],
    run: (input) => {
      const lines = String(input.text || "").split(/\n/);
      const seen = new Set<string>();
      const out: string[] = [];
      for (const l of lines) {
        if (!seen.has(l)) { seen.add(l); out.push(l); }
      }
      return { kind: "text", value: out.join("\n") };
    },
    seoTitle: L("Duplicate Line Remover", "ডুপ্লিকেট লাইন রিমুভার"),
    seoDescription: L("Remove duplicate lines.", "ডুপ্লিকেট লাইন সরান।"),
    keywords: ["duplicate line remover"],
    instructions: LI(["Paste text and run."], ["টেক্সট পেস্ট করে চালান।"]),
    faqs: [],
    related: ["text-cleaner"],
  },
];

