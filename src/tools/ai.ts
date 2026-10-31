import type { ToolDefinition } from "@/lib/tools/types";
import type { Locale } from "@/lib/i18n";

const L = (en: string, bn: string): Record<Locale, string> => ({ en, bn });
const LI = (en: string[], bn: string[]): Record<Locale, string[]> => ({ en, bn });

export const aiTools: ToolDefinition[] = [
  {
    id: "text-summarizer", slug: "text-summarizer", category: "ai", icon: "Sparkles",
    name: L("Text Summarizer", "টেক্সট সামারাইজার"),
    description: L("Summarize text locally (extractive).", "লোকালি টেক্সট সারসংক্ষেপ (এক্সট্রাক্টিভ)।"),
    inputSchema: [
      { name: "text", label: L("Text", "টেক্সট"), type: "textarea", required: true },
      { name: "sentences", label: L("Sentences", "বাক্য"), type: "number", min: 1, max: 10 },
    ],
    run: (input) => {
      const text = String(input.text || "");
      const n = Math.max(1, Math.min(10, Number(input.sentences) || 3));
      const sents = text.match(/[^.!?]+[.!?]+/g) || [text];
      const words = text.toLowerCase().split(/\W+/);
      const freq: Record<string, number> = {};
      words.forEach((w) => { if (w.length > 3) freq[w] = (freq[w] || 0) + 1; });
      const scored = sents.map((s) => {
        const ws = s.toLowerCase().split(/\W+/);
        const score = ws.reduce((a, w) => a + (freq[w] || 0), 0);
        return { s, score };
      });
      scored.sort((a, b) => b.score - a.score);
      const top = scored.slice(0, n).map((x) => x.s.trim()).join(" ");
      return { kind: "text", value: top };
    },
    seoTitle: L("Text Summarizer", "টেক্সট সামারাইজার"),
    seoDescription: L("Summarize text.", "টেক্সট সারসংক্ষেপ।"),
    keywords: ["text summarizer"],
    instructions: LI(["Paste text and choose sentence count."], ["টেক্সট পেস্ট ও বাক্য সংখ্যা বেছে নিন।"]),
    faqs: [],
    related: [],
  },
  {
    id: "ai-text-assistant", slug: "ai-text-assistant", category: "ai", icon: "Bot",
    name: L("AI Text Assistant", "AI টেক্সট অ্যাসিস্ট্যান্ট"),
    description: L("AI-assisted writing (requires provider config).", "AI-সহায়তা লেখা (প্রোভাইডার কনফিগ প্রয়োজন)।"),
    inputSchema: [{ name: "prompt", label: L("Prompt", "প্রম্পট"), type: "textarea", required: true }],
    run: () => ({ kind: "text", value: "AI provider is not configured. Set AI_API_KEY in environment to enable. See DEPLOYMENT.md." }),
    seoTitle: L("AI Text Assistant", "AI টেক্সট অ্যাসিস্ট্যান্ট"),
    seoDescription: L("AI writing assistant.", "AI লেখা সহায়ক।"),
    keywords: ["ai text assistant"],
    instructions: LI(["Configure AI provider in env."], ["env-এ AI প্রোভাইডার কনফিগার করুন।"]),
    faqs: [],
    related: [],
  },
];
