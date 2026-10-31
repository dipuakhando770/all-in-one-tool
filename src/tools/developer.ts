import type { ToolDefinition } from "@/lib/tools/types";
import type { Locale } from "@/lib/i18n";

const L = (en: string, bn: string): Record<Locale, string> => ({ en, bn });
const LI = (en: string[], bn: string[]): Record<Locale, string[]> => ({ en, bn });

export const developerTools: ToolDefinition[] = [
  {
    id: "json-formatter", slug: "json-formatter", category: "developer", icon: "Braces",
    name: L("JSON Formatter", "JSON ফরম্যাটার"),
    description: L("Format and prettify JSON data.", "JSON ডেটা ফরম্যাট ও প্রিটিফাই।"),
    inputSchema: [{ name: "json", label: L("JSON", "JSON"), type: "textarea", required: true }],
    run: (input) => {
      try {
        const obj = JSON.parse(String(input.json || ""));
        return { kind: "text", value: JSON.stringify(obj, null, 2) };
      } catch (e) {
        return { kind: "text", value: "Invalid JSON: " + (e as Error).message };
      }
    },
    seoTitle: L("JSON Formatter", "JSON ফরম্যাটার"),
    seoDescription: L("Format JSON online.", "অনলাইনে JSON ফরম্যাট।"),
    keywords: ["json formatter"],
    instructions: LI(["Paste JSON and run."], ["JSON পেস্ট করে চালান।"]),
    faqs: [],
    related: ["json-validator"],
  },
  {
    id: "json-validator", slug: "json-validator", category: "developer", icon: "CheckCircle",
    name: L("JSON Validator", "JSON ভ্যালিডেটর"),
    description: L("Validate JSON syntax.", "JSON সিনট্যাক্স ভ্যালিডেট।"),
    inputSchema: [{ name: "json", label: L("JSON", "JSON"), type: "textarea", required: true }],
    run: (input) => {
      try {
        JSON.parse(String(input.json || ""));
        return { kind: "text", value: "Valid JSON ✅" };
      } catch (e) {
        return { kind: "text", value: "Invalid JSON ❌\n" + (e as Error).message };
      }
    },
    seoTitle: L("JSON Validator", "JSON ভ্যালিডেটর"),
    seoDescription: L("Validate JSON.", "JSON ভ্যালিডেট।"),
    keywords: ["json validator"],
    instructions: LI(["Paste JSON and run."], ["JSON পেস্ট করে চালান।"]),
    faqs: [],
    related: ["json-formatter"],
  },
  {
    id: "base64-encode-decode", slug: "base64-encode-decode", category: "developer", icon: "Binary",
    name: L("Base64 Encoder/Decoder", "Base64 এনকোডার/ডিকোডার"),
    description: L("Encode or decode Base64 strings.", "Base64 স্ট্রিং এনকোড/ডিকোড।"),
    inputSchema: [
      { name: "text", label: L("Text", "টেক্সট"), type: "textarea", required: true },
      { name: "mode", label: L("Mode", "মোড"), type: "select", options: [
        { value: "encode", label: L("Encode", "এনকোড") },
        { value: "decode", label: L("Decode", "ডিকোড") },
      ] },
    ],
    run: (input) => {
      try {
        if (input.mode === "decode") return { kind: "text", value: atob(String(input.text || "")) };
        return { kind: "text", value: btoa(String(input.text || "")) };
      } catch (e) {
        return { kind: "text", value: "Error: " + (e as Error).message };
      }
    },
    seoTitle: L("Base64 Encoder Decoder", "Base64 এনকোডার ডিকোডার"),
    seoDescription: L("Encode/decode Base64.", "Base64 এনকোড/ডিকোড।"),
    keywords: ["base64"],
    instructions: LI(["Enter text and choose mode."], ["টেক্সট ও মোড বেছে নিন।"]),
    faqs: [],
    related: [],
  },
  {
    id: "url-encode-decode", slug: "url-encode-decode", category: "developer", icon: "Link",
    name: L("URL Encoder/Decoder", "URL এনকোডার/ডিকোডার"),
    description: L("Encode or decode URLs.", "URL এনকোড/ডিকোড।"),
    inputSchema: [
      { name: "text", label: L("Text", "টেক্সট"), type: "textarea", required: true },
      { name: "mode", label: L("Mode", "মোড"), type: "select", options: [
        { value: "encode", label: L("Encode", "এনকোড") },
        { value: "decode", label: L("Decode", "ডিকোড") },
      ] },
    ],
    run: (input) => {
      try {
        if (input.mode === "decode") return { kind: "text", value: decodeURIComponent(String(input.text || "")) };
        return { kind: "text", value: encodeURIComponent(String(input.text || "")) };
      } catch (e) {
        return { kind: "text", value: "Error: " + (e as Error).message };
      }
    },
    seoTitle: L("URL Encoder Decoder", "URL এনকোডার ডিকোডার"),
    seoDescription: L("Encode/decode URLs.", "URL এনকোড/ডিকোড।"),
    keywords: ["url encode"],
    instructions: LI(["Enter text and choose mode."], ["টেক্সট ও মোড বেছে নিন।"]),
    faqs: [],
    related: [],
  },
  {
    id: "html-formatter", slug: "html-formatter", category: "developer", icon: "Code",
    name: L("HTML Formatter", "HTML ফরম্যাটার"),
    description: L("Basic HTML formatting.", "বেসিক HTML ফরম্যাটিং।"),
    inputSchema: [{ name: "html", label: L("HTML", "HTML"), type: "textarea", required: true }],
    run: (input) => {
      const html = String(input.html || "");
      let out = "";
      let indent = 0;
      html.split(/>\s*</).forEach((part, i) => {
        if (i === 0) { out += part + ">"; return; }
        if (part.startsWith("/")) indent = Math.max(0, indent - 1);
        out += "\n" + "  ".repeat(indent) + "<" + part + ">";
        if (!part.startsWith("/") && !part.endsWith("/")) {
          // heuristic: increase indent for opening tags without closing
          if (/<[a-zA-Z]/.test(part) && !/<.*\/>$/.test(part)) indent += 1;
        }
      });
      return { kind: "text", value: out.trim() };
    },
    seoTitle: L("HTML Formatter", "HTML ফরম্যাটার"),
    seoDescription: L("Format HTML.", "HTML ফরম্যাট।"),
    keywords: ["html formatter"],
    instructions: LI(["Paste HTML."], ["HTML পেস্ট করুন।"]),
    faqs: [],
    related: [],
  },
  {
    id: "css-minifier", slug: "css-minifier", category: "developer", icon: "Minimize2",
    name: L("CSS Minifier", "CSS মিনিফায়ার"),
    description: L("Minify CSS code.", "CSS কোড মিনিফাই।"),
    inputSchema: [{ name: "css", label: L("CSS", "CSS"), type: "textarea", required: true }],
    run: (input) => {
      const css = String(input.css || "");
      const min = css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{}:;,])\s*/g, "$1").trim();
      return { kind: "text", value: min };
    },
    seoTitle: L("CSS Minifier", "CSS মিনিফায়ার"),
    seoDescription: L("Minify CSS.", "CSS মিনিফাই।"),
    keywords: ["css minifier"],
    instructions: LI(["Paste CSS."], ["CSS পেস্ট করুন।"]),
    faqs: [],
    related: ["js-minifier"],
  },
  {
    id: "js-minifier", slug: "js-minifier", category: "developer", icon: "Minimize2",
    name: L("JavaScript Minifier", "JavaScript মিনিফায়ার"),
    description: L("Minify JavaScript code (basic).", "JavaScript কোড মিনিফাই (বেসিক)।"),
    inputSchema: [{ name: "js", label: L("JavaScript", "JavaScript"), type: "textarea", required: true }],
    run: (input) => {
      const js = String(input.js || "");
      const min = js.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").trim();
      return { kind: "text", value: min };
    },
    seoTitle: L("JavaScript Minifier", "JavaScript মিনিফায়ার"),
    seoDescription: L("Minify JS.", "JS মিনিফাই।"),
    keywords: ["js minifier"],
    instructions: LI(["Paste JS."], ["JS পেস্ট করুন।"]),
    faqs: [],
    related: ["css-minifier"],
  },
];
