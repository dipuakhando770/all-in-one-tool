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
  {
    id: "xml-formatter", slug: "xml-formatter", category: "developer", icon: "Code",
    name: L("XML Formatter", "XML ফরম্যাটার"),
    description: L("Format and indent XML.", "XML ফরম্যাট ও indentation করুন।"),
    inputSchema: [{ name: "xml", label: L("XML", "XML"), type: "textarea", required: true }],
    run: (input) => {
      const xml = String(input.xml || "");
      let out = "";
      let indent = 0;
      const tokens = xml.split(/(><)|(\r\n|\r|\n)/);
      for (const token of tokens) {
        if (!token || token.match(/^\s*$/)) continue;
        if (token.match(/^\s*<\/\w/) || token.match(/<\/\w+\s*>$/)) indent = Math.max(0, indent - 1);
        out += "  ".repeat(indent) + token.replace(/>\s*</g, "><") + "\n";
        if (token.match(/^<\w[^>]*[^/]>$/)) indent += 1;
      }
      return { kind: "text", value: out.trim() || "Invalid XML" };
    },
    seoTitle: L("XML Formatter", "XML ফরম্যাটার"),
    seoDescription: L("Format XML.", "XML ফরম্যাট করুন।"),
    keywords: ["xml formatter"],
    instructions: LI(["Paste XML."], ["XML পেস্ট করুন।"]),
    faqs: [],
    related: [],
  },
  {
    id: "sql-formatter", slug: "sql-formatter", category: "developer", icon: "Database",
    name: L("SQL Formatter", "SQL ফরম্যাটার"),
    description: L("Basic SQL keyword capitalization and line breaks.", "SQL কিওয়ার্ড বড় হাত ও লাইন ব্রেক।"),
    inputSchema: [{ name: "sql", label: L("SQL", "SQL"), type: "textarea", required: true }],
    run: (input) => {
      const sql = String(input.sql || "");
      const keywords = ["SELECT","FROM","WHERE","AND","OR","JOIN","LEFT","RIGHT","INNER","OUTER","ON","GROUP BY","ORDER BY","INSERT INTO","VALUES","UPDATE","SET","DELETE","CREATE TABLE","ALTER TABLE","DROP TABLE"];
      let out = sql;
      keywords.forEach((k) => { const re = new RegExp("\\b(" + k.split(" ").join("\\s+") + ")\\b", "gi"); out = out.replace(re, k.toUpperCase()); });
      out = out.replace(/;/g, ";\n").replace(/,/g, ", ");
      return { kind: "text", value: out.trim() };
    },
    seoTitle: L("SQL Formatter", "SQL ফরম্যাটার"),
    seoDescription: L("Format SQL.", "SQL ফরম্যাট করুন।"),
    keywords: ["sql formatter"],
    instructions: LI(["Paste SQL."], ["SQL পেস্ট করুন।"]),
    faqs: [],
    related: [],
  },
  {
    id: "hash-generator", slug: "hash-generator", category: "developer", icon: "Key",
    name: L("Hash Generator", "হ্যাশ জেনারেটর"),
    description: L("Generate SHA-256 hash locally.", "লোকালি SHA-256 হ্যাশ তৈরি করুন।"),
    inputSchema: [{ name: "text", label: L("Text", "টেক্সট"), type: "textarea", required: true }],
    run: async (input) => {
      const t = String(input.text || "");
      const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t));
      const hash = Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
      return { kind: "text", value: hash };
    },
    seoTitle: L("Hash Generator - SHA-256", "হ্যাশ জেনারেটর - SHA-256"),
    seoDescription: L("Generate SHA-256 hash.", "SHA-256 হ্যাশ তৈরি করুন।"),
    keywords: ["hash generator", "sha256"],
    instructions: LI(["Enter text and run."], ["টেক্সট লিখে চালান।"]),
    faqs: [],
    related: [],
  },
  {
    id: "jwt-decoder", slug: "jwt-decoder", category: "developer", icon: "Lock",
    name: L("JWT Decoder", "JWT ডিকোডার"),
    description: L("Decode JWT header and payload locally (no verification).", "JWT হেডার ও পেলোড ডিকোড করুন (যাচাই নয়)।"),
    inputSchema: [{ name: "token", label: L("JWT Token", "JWT টোকেন"), type: "text", required: true }],
    run: (input) => {
      const token = String(input.token || "");
      const parts = token.split(".");
      if (parts.length < 2) return { kind: "text", value: "Invalid JWT" };
      const b64url = (s: string) => s.replace(/-/g, "+").replace(/_/g, "/");
      try {
        const header = JSON.parse(decodeURIComponent(escape(atob(b64url(parts[0])))));
        const payload = JSON.parse(decodeURIComponent(escape(atob(b64url(parts[1])))));
        return { kind: "json", value: JSON.stringify({ header, payload }, null, 2) };
      } catch { return { kind: "text", value: "Invalid JWT payload" }; }
    },
    seoTitle: L("JWT Decoder", "JWT ডিকোডার"),
    seoDescription: L("Decode JWT locally.", "JWT লোকালি ডিকোড করুন।"),
    keywords: ["jwt decoder"],
    instructions: LI(["Paste JWT."], ["JWT পেস্ট করুন।"]),
    faqs: [],
    related: [],
  },
  {
    id: "color-converter", slug: "color-converter", category: "developer", icon: "Palette",
    name: L("Color Converter", "কালার কনভার্টার"),
    description: L("Convert between HEX, RGB and HSL.", "HEX, RGB ও HSL রূপান্তর করুন।"),
    inputSchema: [
      { name: "color", label: L("Color", "কালার"), type: "text", required: true },
      { name: "to", label: L("To", "এ날"), type: "select", options: [
        { value: "hex", label: L("HEX", "HEX") }, { value: "rgb", label: L("RGB", "RGB") }, { value: "hsl", label: L("HSL", "HSL") },
      ] },
    ],
    run: (input) => {
      const c = String(input.color || "").trim();
      const to = input.to || "hex";
      const m = c.match(/^#([0-9a-fA-F]{6})$/);
      if (!m) return { kind: "text", value: "Invalid HEX (#RRGGBB)" };
      const r = parseInt(m[1].slice(0,2),16), g = parseInt(m[1].slice(2,4),16), b = parseInt(m[1].slice(4,6),16);
      if (to === "rgb") return { kind: "text", value: `rgb(${r}, ${g}, ${b})` };
      if (to === "hsl") {
        const rr=r/255, gg=g/255, bb=b/255; const max=Math.max(rr,gg,bb), min=Math.min(rr,gg,bb);
        let h=0, s=0; const l=(max+min)/2; const d=max-min;
        if (d!==0){ s=l>0.5?d/(2-max-min):d/(max+min); switch(max){case rr:h=(gg-bb)/d+(gg<bb?6:0);break;case gg:h=(bb-rr)/d+2;break;case bb:h=(rr-gg)/d+4;break;} h/=6; }
        return { kind: "text", value: `hsl(${Math.round(h*360)}, ${Math.round(s*100)}%, ${Math.round(l*100)}%)` };
      }
      return { kind: "text", value: `#${m[1].toUpperCase()}` };
    },
    seoTitle: L("Color Converter", "কালার কনভার্টার"),
    seoDescription: L("Convert HEX, RGB, HSL.", "HEX, RGB, HSL রূপান্তর করুন।"),
    keywords: ["color converter"],
    instructions: LI(["Enter HEX and choose target."], ["HEX লিখে লক্ষ্য বেছে নিন।"]),
    faqs: [],
    related: ["color-picker"],
  },
  {
    id: "lorem-ipsum-generator", slug: "lorem-ipsum-generator", category: "text", icon: "FileText",
    name: L("Lorem Ipsum Generator", "লোরেম ইপসাম জেনারেটর"),
    description: L("Generate placeholder Lorem Ipsum text.", "প্লেসহোল্ডার লোরেম ইপসাম টেক্সট তৈরি করুন।"),
    inputSchema: [{ name: "paragraphs", label: L("Paragraphs", "অনুচ্ছেদ"), type: "number", min: 1, max: 20, step: 1 }],
    run: (input) => {
      const n = Math.min(20, Math.max(1, Number(input.paragraphs) || 3));
      const para = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.";
      return { kind: "text", value: Array(n).fill(para).join("\n\n") };
    },
    seoTitle: L("Lorem Ipsum Generator", "লোরেম ইপসাম জেনারেটর"),
    seoDescription: L("Generate Lorem Ipsum.", "লোরেম ইপসাম তৈরি করুন।"),
    keywords: ["lorem ipsum generator"],
    instructions: LI(["Choose paragraph count."], ["অনুচ্ছেদ সংখ্যা বেছে নিন।"]),
    faqs: [],
    related: [],
  },
  {
    id: "sentence-counter", slug: "sentence-counter", category: "text", icon: "FileText",
    name: L("Sentence Counter", "বাক্য কাউন্টার"),
    description: L("Count sentences in text.", "টেক্সটের বাক্য গণনা করুন।"),
    inputSchema: [{ name: "text", label: L("Text", "টেক্সট"), type: "textarea", required: true }],
    run: (input) => {
      const t = String(input.text || "");
      const n = t.trim() ? (t.match(/[.!?]+(?:\s|$)/g) || []).length : 0;
      return { kind: "text", value: `Sentences: ${n}` };
    },
    seoTitle: L("Sentence Counter", "বাক্য কাউন্টার"),
    seoDescription: L("Count sentences.", "বাক্য গণনা করুন।"),
    keywords: ["sentence counter"],
    instructions: LI(["Paste text."], ["টেক্সট পেস্ট করুন।"]),
    faqs: [],
    related: ["word-counter"],
  },
  {
    id: "paragraph-counter", slug: "paragraph-counter", category: "text", icon: "AlignLeft",
    name: L("Paragraph Counter", "অনুচ্ছেদ কাউন্টার"),
    description: L("Count paragraphs in text.", "টেক্সটের অনুচ্ছেদ গণনা করুন।"),
    inputSchema: [{ name: "text", label: L("Text", "টেক্সট"), type: "textarea", required: true }],
    run: (input) => {
      const t = String(input.text || "");
      const n = t.trim() ? t.split(/\n\s*\n/).filter((p)=>p.trim().length>0).length : 0;
      return { kind: "text", value: `Paragraphs: ${n}` };
    },
    seoTitle: L("Paragraph Counter", "অনুচ্ছেদ কাউন্টার"),
    seoDescription: L("Count paragraphs.", "অনুচ্ছেদ গণনা করুন।"),
    keywords: ["paragraph counter"],
    instructions: LI(["Paste text."], ["টেক্সট পেস্ট করুন।"]),
    faqs: [],
    related: ["word-counter"],
  },
  {
    id: "text-sorter", slug: "text-sorter", category: "text", icon: "SortAsc",
    name: L("Text Sorter", "টেক্সট সর্টার"),
    description: L("Sort lines alphabetically.", "লাইন বর্ণমালাক্রমে সাজান।"),
    inputSchema: [
      { name: "text", label: L("Text", "টেক্সট"), type: "textarea", required: true },
      { name: "order", label: L("Order", "ক্রম"), type: "select", options: [
        { value: "asc", label: L("A → Z", "A → Z") },
        { value: "desc", label: L("Z → A", "Z → A") },
      ] },
    ],
    run: (input) => {
      const lines = String(input.text || "").split(/\n/);
      const asc = input.order !== "desc";
      lines.sort((a, b) => asc ? a.localeCompare(b) : b.localeCompare(a));
      return { kind: "text", value: lines.join("\n") };
    },
    seoTitle: L("Text Sorter", "টেক্সট সর্টার"),
    seoDescription: L("Sort text lines.", "টেক্সট লাইন সাজান।"),
    keywords: ["text sorter"],
    instructions: LI(["Paste text."], ["টেক্সট পেস্ট করুন।"]),
    faqs: [],
    related: ["text-cleaner"],
  },
  {
    id: "remove-extra-spaces", slug: "remove-extra-spaces", category: "text", icon: "Eraser",
    name: L("Remove Extra Spaces", "অতিরিক্ত স্পেস অপসারণ"),
    description: L("Remove duplicate spaces and trim lines.", "ডুপ্লিকেট স্পেস ও লাইন ট্রিম করুন।"),
    inputSchema: [{ name: "text", label: L("Text", "টেক্সট"), type: "textarea", required: true }],
    run: (input) => {
      const t = String(input.text || "");
      return { kind: "text", value: t.split(/\n/).map((l)=>l.replace(/\s+/g," ").trim()).join("\n") };
    },
    seoTitle: L("Remove Extra Spaces", "অতিরিক্ত স্পেস অপসারণ"),
    seoDescription: L("Remove extra spaces.", "অতিরিক্ত স্পেস সরান।"),
    keywords: ["remove extra spaces"],
    instructions: LI(["Paste text."], ["টেক্সট পেস্ট করুন।"]),
    faqs: [],
    related: ["text-cleaner"],
  },
  {
    id: "date-difference-calculator", slug: "date-difference-calculator", category: "calculator", icon: "Calendar",
    name: L("Date Difference Calculator", "তারিখ পার্থক্য ক্যালকুলেটর"),
    description: L("Days between two dates.", "দুই তারিখের মধ্যবর্তী দিন।"),
    inputSchema: [
      { name: "from", label: L("From Date", "থেকে তারিখ"), type: "date", required: true },
      { name: "to", label: L("To Date", "পর্যন্ত তারিখ"), type: "date", required: true },
    ],
    run: (input) => {
      const a = new Date(String(input.from)); const b = new Date(String(input.to));
      if (isNaN(a.getTime()) || isNaN(b.getTime())) return { kind: "text", value: "Invalid date" };
      const days = Math.round((b.getTime() - a.getTime()) / (1000*60*60*24));
      return { kind: "text", value: `Difference: ${Math.abs(days)} days` };
    },
    seoTitle: L("Date Difference Calculator", "তারিখ পার্থক্য ক্যালকুলেটর"),
    seoDescription: L("Days between two dates.", "দুই তারিখের মধ্যবর্তী দিন।"),
    keywords: ["date difference calculator"],
    instructions: LI(["Pick two dates."], ["দুই তারিখ বেছে নিন।"]),
    faqs: [],
    related: ["age-calculator"],
  },
  {
    id: "profit-calculator", slug: "profit-calculator", category: "calculator", icon: "TrendingUp",
    name: L("Profit Calculator", "লাভ ক্যালকুলেটর"),
    description: L("Calculate profit and margin.", "লাভ ও मार्जিন হিসাব।"),
    inputSchema: [
      { name: "cost", label: L("Cost", "খরচ"), type: "number", required: true },
      { name: "price", label: L("Selling Price", "विक্রয় দাম"), type: "number", required: true },
    ],
    run: (input) => {
      const c = Number(input.cost), p = Number(input.price);
      const profit = p - c; const pct = c === 0 ? 0 : (profit / c) * 100;
      return { kind: "text", value: `Profit: ${profit.toFixed(2)}\nMargin: ${pct.toFixed(2)}%` };
    },
    seoTitle: L("Profit Calculator", "লাভ ক্যালকুলেটর"),
    seoDescription: L("Calculate profit margin.", "লाभ margin হিসাব।"),
    keywords: ["profit calculator"],
    instructions: LI(["Enter cost and selling price."], ["খরচ ও विक্রয় দাম দিন।"]),
    faqs: [],
    related: ["margin-calculator"],
  },
  {
    id: "margin-calculator", slug: "margin-calculator", category: "calculator", icon: "TrendingDown",
    name: L("Margin Calculator", "মার্জিন ক্যালকুলেটর"),
    description: L("Calculate profit margin from cost and price.", "খরচ ও দাম থেকে मार्जিন হিসাব।"),
    inputSchema: [
      { name: "cost", label: L("Cost", "খরচ"), type: "number", required: true },
      { name: "price", label: L("Revenue", "রেভিনিউ"), type: "number", required: true },
    ],
    run: (input) => {
      const c = Number(input.cost), r = Number(input.price);
      if (r === 0) return { kind: "text", value: "Revenue cannot be 0" };
      const margin = ((r - c) / r) * 100;
      return { kind: "text", value: `Margin: ${margin.toFixed(2)}%\nProfit: ${(r - c).toFixed(2)}` };
    },
    seoTitle: L("Margin Calculator", "মার্জিন ক্যালকুলেটর"),
    seoDescription: L("Calculate profit margin.", "মার্জিন হিসাব করুন।"),
    keywords: ["margin calculator"],
    instructions: LI(["Enter cost and revenue."], ["খরচ ও রেভিনিউ দিন।"]),
    faqs: [],
    related: ["profit-calculator"],
  },
  {
    id: "compound-interest-calculator", slug: "compound-interest-calculator", category: "calculator", icon: "TrendingUp",
    name: L("Compound Interest Calculator", "চক্রবೃদ্ধি সুদ ক্যালকুলেটর"),
    description: L("Calculate compound interest.", "চক্রবৃদ্ধি সুদ হিসাব।"),
    inputSchema: [
      { name: "principal", label: L("Principal", "মূলধন"), type: "number", required: true },
      { name: "rate", label: L("Annual Rate %", "বার্ষিক রেট %"), type: "number", required: true },
      { name: "years", label: L("Years", "বছর"), type: "number", required: true },
    ],
    run: (input) => {
      const P = Number(input.principal), rate = Number(input.rate), y = Number(input.years);
      const A = P * Math.pow(1 + rate / 100, y);
      return { kind: "text", value: `Amount: ${A.toFixed(2)}\nInterest: ${(A - P).toFixed(2)}` };
    },
    seoTitle: L("Compound Interest Calculator", "চক্রবৃদ্ধি সুদ ক্যালকুলেটর"),
    seoDescription: L("Calculate compound interest.", "চক্রবৃদ্ধি সুদ হিসাব করুন।"),
    keywords: ["compound interest calculator"],
    instructions: LI(["Enter principal, rate, years."], ["মূলধন, রেট, বছর দিন।"]),
    faqs: [],
    related: ["simple-interest-calculator"],
  },
  {
    id: "simple-interest-calculator", slug: "simple-interest-calculator", category: "calculator", icon: "Minus",
    name: L("Simple Interest Calculator", "সহজ সুদ ক্যালকুলেটর"),
    description: L("Calculate simple interest.", "সহজ সুদ হিসাব।"),
    inputSchema: [
      { name: "principal", label: L("Principal", "মূলধন"), type: "number", required: true },
      { name: "rate", label: L("Annual Rate %", "বার্ষিক রেট %"), type: "number", required: true },
      { name: "years", label: L("Years", "বছর"), type: "number", required: true },
    ],
    run: (input) => {
      const P = Number(input.principal), rate = Number(input.rate), y = Number(input.years);
      const interest = (P * rate * y) / 100;
      return { kind: "text", value: `Interest: ${interest.toFixed(2)}\nTotal: ${(P + interest).toFixed(2)}` };
    },
    seoTitle: L("Simple Interest Calculator", "সহজ সুদ ক্যালকুলেটর"),
    seoDescription: L("Calculate simple interest.", "সহজ সুদ হিসাব করুন।"),
    keywords: ["simple interest calculator"],
    instructions: LI(["Enter principal, rate, years."], ["মূলধন, রেট, বছর দিন।"]),
    faqs: [],
    related: ["compound-interest-calculator"],
  },
  {
    id: "salary-calculator", slug: "salary-calculator", category: "calculator", icon: "DollarSign",
    name: L("Salary Calculator", "বেতন ক্যালকুলেটর"),
    description: L("Calculate monthly/yearly salary from hourly rate.", "ঘন্টা ভর্তি থেকে বেতন হিসাব।"),
    inputSchema: [
      { name: "hourly", label: L("Hourly Rate", "ঘন্টা ভর্তি"), type: "number", required: true },
      { name: "hours", label: L("Hours per Week", "সপ্তাহে ঘণ্টা"), type: "number", required: true },
      { name: "weeks", label: L("Weeks per Year", "বছরে সপ্তাহ"), type: "number", required: true },
    ],
    run: (input) => {
      const h = Number(input.hourly), w = Number(input.hours), y = Number(input.weeks);
      const weekly = h * w; const yearly = weekly * y;
      return { kind: "text", value: `Weekly: ${weekly.toFixed(2)}\nYearly: ${yearly.toFixed(2)}\nMonthly: ${(yearly/12).toFixed(2)}` };
    },
    seoTitle: L("Salary Calculator", "বেতন ক্যালকুলেটর"),
    seoDescription: L("Calculate salary.", "বেতন হিসাব করুন।"),
    keywords: ["salary calculator"],
    instructions: LI(["Enter hourly rate, hours, weeks."], ["ঘন্টা ভর্তি, ঘণ্টা, সপ্তাহ দিন।"]),
    faqs: [],
    related: [],
  },
  {
    id: "time-calculator", slug: "time-calculator", category: "calculator", icon: "Clock",
    name: L("Time Calculator", "সময় ক্যালকুলেটর"),
    description: L("Add or subtract time.", "সময় যোগ বা বিয়োগ করুন।"),
    inputSchema: [
      { name: "hours", label: L("Hours", "ঘন্টা"), type: "number", required: true },
      { name: "minutes", label: L("Minutes", "মিনিট"), type: "number", required: true },
      { name: "op", label: L("Operation", "কার্যক্রম"), type: "select", options: [
        { value: "double", label: L("×2", "×2") },
        { value: "half", label: L("÷2", "÷2") },
      ] },
    ],
    run: (input) => {
      const h = Number(input.hours), m = Number(input.minutes);
      let total = h * 60 + m;
      total = input.op === "double" ? total * 2 : Math.floor(total / 2);
      return { kind: "text", value: `Result: ${Math.floor(total / 60)}h ${total % 60}m` };
    },
    seoTitle: L("Time Calculator", "সময় ক্যালকুলেটর"),
    seoDescription: L("Add or subtract time.", "সময় যোগ বিয়োগ করুন।"),
    keywords: ["time calculator"],
    instructions: LI(["Enter hours and minutes."], ["ঘন্টা ও মিনিট দিন।"]),
    faqs: [],
    related: [],
  },
  {
    id: "electricity-bill-calculator", slug: "electricity-bill-calculator", category: "calculator", icon: "Zap",
    name: L("Electricity Bill Calculator", "বিদ্যুৎ বিল ক্যালকুলেটর"),
    description: L("Calculate appliance electricity consumption (kWh) and estimate daily, monthly, and yearly power costs.", "যেকোনো বৈদ্যুতিক যন্ত্রের বিদ্যুৎ খরচ (kWh) এবং দৈনিক, মাসিক ও বাৎসরিক বিলের সঠিক হিসাব করুন।"),
    inputSchema: [
      { name: "power", label: L("Power Rating (Watts)", "পাওয়ার রেটিং (ওয়াট / Watts)"), type: "number", required: true },
      { name: "hours", label: L("Usage Hours per Day", "দৈনিক ব্যবহারের ঘণ্টা"), type: "number", required: true },
      { name: "days", label: L("Billing Period (Days, default: 30)", "হিসাবের সময়কাল (দিন, সাধারণত ৩০)"), type: "number" },
      { name: "rate", label: L("Cost per Unit / kWh (in your currency)", "প্রতি ইউনিট / কিলোওয়াটের মূল্য"), type: "number", required: true },
    ],
    run: (input) => {
      const p = Number(input.power);
      const h = Number(input.hours);
      const d = Number(input.days) > 0 ? Number(input.days) : 30;
      const r = Number(input.rate);

      if (isNaN(p) || isNaN(h) || isNaN(r) || p < 0 || h < 0 || r < 0) {
        return { kind: "text", value: "Please enter valid positive numbers for power, hours, and rate." };
      }

      const dailyKwh = (p * h) / 1000;
      const periodKwh = dailyKwh * d;
      const monthlyKwh = dailyKwh * 30;
      const yearlyKwh = dailyKwh * 365;

      const periodCost = periodKwh * r;
      const dailyCost = dailyKwh * r;
      const monthlyCost = monthlyKwh * r;
      const yearlyCost = yearlyKwh * r;

      return {
        kind: "text",
        value: [
          `Estimated Electricity Cost: ${periodCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (for ${d} days)`,
          `-------------------------------------------`,
          `Daily Consumption:    ${dailyKwh.toFixed(3)} kWh  (${dailyCost.toFixed(2)} / day)`,
          `Period Consumption:   ${periodKwh.toFixed(3)} kWh  (${periodCost.toFixed(2)} for ${d} days)`,
          `Monthly (30 days):    ${monthlyKwh.toFixed(2)} kWh  (${monthlyCost.toFixed(2)} / month)`,
          `Yearly (365 days):    ${yearlyKwh.toFixed(2)} kWh  (${yearlyCost.toFixed(2)} / year)`,
          `-------------------------------------------`,
          `Calculation Formula: (${p}W * ${h}h / 1000) * ${d} days * ${r}/unit`,
        ].join("\n"),
      };
    },
    seoTitle: L("Electricity Bill Calculator - Estimate Power Usage & Costs", "বিদ্যুৎ বিল ক্যালকুলেটর - সহজে বিদ্যুৎ খরচ ও বিলের হিসাব"),
    seoDescription: L("Calculate energy consumption in kWh and estimate your electric bill for any appliance accurately.", "যেকোনো ফ্যান, লাইট বা এসির ওয়াট ও ব্যবহারের সময় দিয়ে মাসিক বিদ্যুৎ বিল হিসাব করুন।"),
    keywords: ["electricity bill calculator", "power consumption calculator", "kwh cost calculator", "বিদ্যুৎ বিল ক্যালকুলেটর"],
    instructions: LI(
      [
        "Enter the power rating of your appliance in Watts (e.g. 75 for a fan, 1500 for an AC).",
        "Enter how many hours the appliance runs each day.",
        "Enter the number of days in the billing cycle (typically 30).",
        "Enter your electricity tariff rate per unit (kWh).",
        "Click Run Tool to view your complete breakdown.",
      ],
      [
        "আপনার যন্ত্রের পাওয়ার ওয়াটে লিখুন (যেমন ফ্যানের জন্য ৭৫, এসির জন্য ১৫০০)।",
        "যন্ত্রটি দিনে গড়ে কত ঘণ্টা চলে তা লিখুন।",
        "কত দিনের বিল হিসাব করতে চান তা লিখুন (সাধারণত ৩০ দিন)।",
        "আপনার প্রতি ইউনিট বিদ্যুতের দাম লিখুন।",
        "রান বাটনে ক্লিক করে পূর্ণাঙ্গ বিদ্যুৎ বিলের রিপোর্ট দেখুন।",
      ]
    ),
    faqs: [],
    related: ["percentage-calculator", "discount-calculator"],
  },
  {
    id: "meta-tag-analyzer", slug: "meta-tag-analyzer", category: "seo", icon: "Search",
    name: L("Meta Tag Analyzer", "মেটা ট্যাগ বিশ্লেষক"),
    description: L("Analyze HTML meta tags locally.", "অনলাইনে মেটা ট্যাগ বিশ্লেষণ করুন।"),
    inputSchema: [{ name: "html", label: L("HTML", "HTML"), type: "textarea", required: true }],
    run: (input) => {
      const html = String(input.html || "");
      const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      const desc = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
      const report = [
        title ? `Title: ${title[1].trim()} (${title[1].length} chars)` : "Missing <title>",
        desc ? `Description: ${desc[1].trim()} (${desc[1].length} chars)` : "Missing meta description",
      ];
      return { kind: "text", value: report.join("\n") };
    },
    seoTitle: L("Meta Tag Analyzer", "মেটা ট্যাগ বিশ্লেষক"),
    seoDescription: L("Analyze meta tags.", "মেটা ট্যাগ বিশ্লেষণ করুন।"),
    keywords: ["meta tag analyzer"],
    instructions: LI(["Paste HTML."], ["HTML পেস্ট করুন।"]),
    faqs: [],
    related: ["meta-tag-generator"],
  },
  {
    id: "schema-markup-generator", slug: "schema-markup-generator", category: "seo", icon: "Code",
    name: L("Schema Markup Generator", "স্কিমা মার্কাপ জেনারেটর"),
    description: L("Generate Google-compliant JSON-LD structured data for WebPage, Article, Organization, Product, LocalBusiness, and FAQPage.", "গুগল সমর্থিত JSON-LD স্ট্রাকচার্ড ডাটা স্কিমা মার্কাপ কোড তৈরি করুন।"),
    inputSchema: [
      {
        name: "type",
        label: L("Schema Type", "স্কিমার ধরন"),
        type: "select",
        options: [
          { value: "WebPage", label: L("WebPage (Website page)", "WebPage (ওয়েব পেজ)") },
          { value: "Article", label: L("Article / Blog Post", "Article (ব্লগ পোস্ট / আর্টিকেল)") },
          { value: "Organization", label: L("Organization / Company", "Organization (কোম্পানি / প্রতিষ্ঠান)") },
          { value: "Product", label: L("Product / E-commerce Item", "Product (পণ্য / ই-কমার্স)") },
          { value: "LocalBusiness", label: L("Local Business", "LocalBusiness (স্থানীয় ব্যবসা)") },
          { value: "FAQPage", label: L("FAQPage (Questions & Answers)", "FAQPage (প্রশ্নোত্তর পাতা)") },
        ],
      },
      { name: "name", label: L("Title / Name", "শিরোনাম বা নাম"), type: "text", required: true },
      { name: "url", label: L("Target URL", "ওয়েবসাইটের URL"), type: "text", required: true },
      { name: "description", label: L("Description", "বিবরণ বা সামারি"), type: "textarea", required: true },
      { name: "extra", label: L("Extra Info (Author, Price, or FAQ Q:A lines)", "অতিরিক্ত তথ্য (লেখক, মূল্য, বা প্রশ্নোত্তর লাইন)"), type: "textarea" },
    ],
    run: (input) => {
      const type = String(input.type || "WebPage");
      const name = String(input.name || "").trim();
      const url = String(input.url || "").trim();
      const description = String(input.description || "").trim();
      const extra = String(input.extra || "").trim();

      let schema: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": type,
        name,
        url,
        description,
      };

      if (type === "Article") {
        schema = {
          ...schema,
          headline: name,
          author: {
            "@type": "Person",
            name: extra || "Editorial Team",
          },
          publisher: {
            "@type": "Organization",
            name: "Nasir Tools",
            url: "https://tools.nasirdigitalhub.com",
          },
          datePublished: new Date().toISOString().split("T")[0],
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": url,
          },
        };
      } else if (type === "Organization") {
        schema = {
          ...schema,
          logo: `${url.replace(/\/$/, "")}/logo.png`,
          sameAs: extra ? extra.split("\n").map((s) => s.trim()).filter(Boolean) : [],
        };
      } else if (type === "LocalBusiness") {
        schema = {
          ...schema,
          address: {
            "@type": "PostalAddress",
            streetAddress: extra || "Business Street",
            addressLocality: "Dhaka",
            addressCountry: "BD",
          },
          priceRange: "$$",
        };
      } else if (type === "Product") {
        const price = parseFloat(extra) || 29.99;
        schema = {
          ...schema,
          offers: {
            "@type": "Offer",
            price: price.toFixed(2),
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url,
          },
        };
      } else if (type === "FAQPage") {
        // Parse Q: A: lines from extra
        const lines = extra ? extra.split("\n").filter((l) => l.trim()) : [];
        const questions: Array<{ "@type": string; name: string; acceptedAnswer: { "@type": string; text: string } }> = [];
        let currentQ = name;
        let currentA = description;

        if (lines.length > 0) {
          for (const line of lines) {
            if (line.match(/^q:/i)) {
              currentQ = line.replace(/^q:\s*/i, "");
            } else if (line.match(/^a:/i)) {
              currentA = line.replace(/^a:\s*/i, "");
              questions.push({
                "@type": "Question",
                name: currentQ,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: currentA,
                },
              });
            }
          }
        }

        if (questions.length === 0) {
          questions.push({
            "@type": "Question",
            name: name || "Frequently Asked Question",
            acceptedAnswer: {
              "@type": "Answer",
              text: description || "Detailed answer information.",
            },
          });
        }

        schema = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: questions,
        };
      }

      const jsonString = JSON.stringify(schema, null, 2);
      const scriptTag = `<script type="application/ld+json">\n${jsonString}\n<\/script>`;

      return {
        kind: "json",
        value: scriptTag,
      };
    },
    seoTitle: L("Schema Markup Generator - Google JSON-LD Rich Snippet Generator", "স্কিমা মার্কাপ জেনারেটর - গুগল JSON-LD রিচ স্নিপেট তৈরি করুন"),
    seoDescription: L("Generate validated Google JSON-LD schema markup for WebPages, Articles, Products, Organizations, and FAQs.", "গুগলে রিচ স্নিপেট ও উচ্চ র‍্যাংকিং পেতে সহজে JSON-LD স্কিমা কোড জেনারেট করুন।"),
    keywords: ["schema markup generator", "json-ld generator", "rich snippets generator", "স্কিমা মার্কাপ জেনারেটর"],
    instructions: LI(
      [
        "Select the schema type (WebPage, Article, Organization, Product, LocalBusiness, FAQPage).",
        "Fill in the page title, URL, and a clear description.",
        "Add any optional context in the Extra field (e.g. Author name or FAQ lines).",
        "Click Run Tool to copy the generated <script type='application/ld+json'> markup.",
      ],
      [
        "স্কিমার ধরন বেছে নিন (ওয়েব পেজ, আর্টিকেল, পণ্য, প্রতিষ্ঠান, বা প্রশ্নোত্তর)।",
        "পাতার শিরোনাম, মূল লিংক ও বিবরণ লিখুন।",
        "প্রয়োজনে অতিরিক্ত তথ্য (যেমন লেখক বা প্রশ্নোত্তর) দিন।",
        "রান বাটনে ক্লিক করে ভ্যালিড JSON-LD কোডটি কপি করে ওয়েবসাইটে বসান।",
      ]
    ),
    faqs: [],
    related: ["open-graph-generator", "meta-tag-analyzer", "meta-tag-generator"],
  },
  {
    id: "open-graph-generator", slug: "open-graph-generator", category: "seo", icon: "Share2",
    name: L("Open Graph Generator", "ওপেন গ্রাফ জেনারেটর"),
    description: L("Generate Open Graph meta tags.", "ওপেন গ্রাফ মেটা ট্যাগ তৈরি করুন।"),
    inputSchema: [
      { name: "title", label: L("Title", "শিরোনাম"), type: "text", required: true },
      { name: "description", label: L("Description", "বিবরণ"), type: "textarea", required: true },
      { name: "image", label: L("Image URL", "ছবি URL"), type: "text" },
    ],
    run: (input) => {
      let out = `<meta property="og:title" content="${input.title}">\n<meta property="og:description" content="${input.description}">\n<meta property="og:type" content="website">`;
      if (input.image) out += `\n<meta property="og:image" content="${input.image}">`;
      return { kind: "text", value: out };
    },
    seoTitle: L("Open Graph Generator", "ওপেন গ্রাফ জেনারেটর"),
    seoDescription: L("Generate Open Graph tags.", "ওপেন গ্রাফ ট্যাগ তৈরি করুন।"),
    keywords: ["open graph generator"],
    instructions: LI(["Enter title and description."], ["শিরোনাম ও বিবরণ দিন।"]),
    faqs: [],
    related: [],
  },
  {
    id: "keyword-density-checker", slug: "keyword-density-checker", category: "seo", icon: "BarChart",
    name: L("Keyword Density Checker", "কিওয়ার্ড ঘনত্ব পরীক্ষক"),
    description: L("Calculate keyword density from text.", "টেক্সট থেকে কিওয়ার্ড ঘনত্ব গণনা করুন।"),
    inputSchema: [
      { name: "text", label: L("Text", "টেক্সট"), type: "textarea", required: true },
      { name: "keyword", label: L("Keyword", "কিওয়ার্ড"), type: "text", required: true },
    ],
    run: (input) => {
      const t = String(input.text || "").toLowerCase();
      const k = String(input.keyword || "").toLowerCase();
      const words = t.match(/\b\w+\b/g) || [];
      const count = t.split(k).length - 1;
      const density = words.length ? ((count / words.length) * 100).toFixed(2) : "0.00";
      return { kind: "text", value: `Keyword: ${k}\nOccurrences: ${count}\nTotal words: ${words.length}\nDensity: ${density}%` };
    },
    seoTitle: L("Keyword Density Checker", "কিওয়ার্ড ঘনত্ব পরীক্ষক"),
    seoDescription: L("Check keyword density.", "কিওয়ার্ড ঘনত্ব পরীক্ষা করুন।"),
    keywords: ["keyword density checker"],
    instructions: LI(["Paste text and keyword."], ["টেক্সট ও কিওয়ার্ড পেস্ট করুন।"]),
    faqs: [],
    related: [],
  },
  {
    id: "hreflang-generator", slug: "hreflang-generator", category: "seo", icon: "Globe",
    name: L("Hreflang Generator", "হ্রেফল্যাঙ জেনারেটর"),
    description: L("Generate hreflang tags for bilingual pages.", "দ্বিভাষিক পৃষ্ঠার জন্য হ্রেফল্যাঙ ট্যাগ তৈরি করুন।"),
    inputSchema: [
      { name: "url", label: L("URL", "URL"), type: "text", required: true },
      { name: "lang", label: L("Language", "ভাষা"), type: "select", options: [
        { value: "en", label: L("English", "ইংরেজি") },
        { value: "bn", label: L("Bengali", "বাংলা") },
        { value: "x-default", label: L("Default", "ডিফল্ট") },
      ] },
    ],
    run: (input) => {
      return { kind: "text", value: `<link rel="alternate" hreflang="${input.lang}" href="${input.url}">` };
    },
    seoTitle: L("Hreflang Generator", "হ্রেফল্যাঙ জেনারেটর"),
    seoDescription: L("Generate hreflang tags.", "হ্রেফল্যাঙ ট্যাগ তৈরি করুন।"),
    keywords: ["hreflang generator"],
    instructions: LI(["Enter URL and language."], ["URL ও ভাষা দিন।"]),
    faqs: [],
    related: [],
  },
  {
    id: "redirect-checker", slug: "redirect-checker", category: "seo", icon: "Link",
    name: L("Redirect Checker", "রিডাইরেক্ট চেকার"),
    description: L("List redirect targets from input (local only, no external fetch).", "URL তালিকা লোকালি চেক করুন।"),
    inputSchema: [{ name: "urls", label: L("URLs (one per line)", "URL (প্রতি লাইনে একটি)"), type: "textarea", required: true }],
    run: (input) => {
      const urls = String(input.urls || "").split(/\n/).filter(Boolean);
      return { kind: "text", value: urls.map((u) => `${u} → (local placeholder, no external fetch)`).join("\n") };
    },
    seoTitle: L("Redirect Checker", "রিডাইরেক্ট চেকার"),
    seoDescription: L("Check redirects locally.", "রিডাইরেক্ট লোকালি চেক করুন।"),
    keywords: ["redirect checker"],
    instructions: LI(["Paste URLs."], ["URL পেস্ট করুন।"]),
    faqs: [],
    related: [],
  },
  {
    id: "heading-structure-checker", slug: "heading-structure-checker", category: "seo", icon: "List",
    name: L("Heading Structure Checker", "হেডিং কাঠামো চেকার"),
    description: L("Analyze heading hierarchy from HTML.", "HTML থেকে হেডিং শ্রেণিবিন্যাস বিশ্লেষণ করুন।"),
    inputSchema: [{ name: "html", label: L("HTML", "HTML"), type: "textarea", required: true }],
    run: (input) => {
      const html = String(input.html || "");
      const heads = [...html.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi)];
      const lines = heads.map((m) => `H${m[1]}: ${m[2].replace(/<[^>]*>/g, "").trim()}`);
      return { kind: "text", value: lines.length ? lines.join("\n") : "No headings found" };
    },
    seoTitle: L("Heading Structure Checker", "হেডিং কাঠামো চেকার"),
    seoDescription: L("Check heading structure.", "হেডিং কাঠামো পরীক্ষা করুন।"),
    keywords: ["heading structure checker"],
    instructions: LI(["Paste HTML."], ["HTML পেস্ট করুন।"]),
    faqs: [],
    related: ["meta-tag-analyzer"],
  },
  {
    id: "image-alt-text-checker", slug: "image-alt-text-checker", category: "seo", icon: "Image",
    name: L("Image Alt Text Checker", "ছবি অল্ট টেক্সট চেকার"),
    description: L("Find images missing alt attributes.", "অলট গুণ ছবি খুঁজুন।"),
    inputSchema: [{ name: "html", label: L("HTML", "HTML"), type: "textarea", required: true }],
    run: (input) => {
      const html = String(input.html || "");
      const imgs = [...html.matchAll(/<img[^>]*>/gi)];
      const missing = imgs.filter((m) => !/alt\s*=/i.test(m[0]));
      return { kind: "text", value: `Total images: ${imgs.length}\nMissing alt: ${missing.length}` };
    },
    seoTitle: L("Image Alt Text Checker", "ছবি অল্ট টেক্সট চেকার"),
    seoDescription: L("Check image alt text.", "ছবির অল্ট টেক্সট পরীক্ষা করুন।"),
    keywords: ["image alt text checker"],
    instructions: LI(["Paste HTML."], ["HTML পেস্ট করুন।"]),
    faqs: [],
    related: [],
  },
  {
    id: "structured-data-validator", slug: "structured-data-validator", category: "seo", icon: "Code",
    name: L("Structured Data Validator", "স্ট্রাকচার্ড ডেটা ভ্যালিডেটর"),
    description: L("Validate JSON-LD locally.", "JSON-LD লোকালি ভ্যালিডেট করুন।"),
    inputSchema: [{ name: "json", label: L("JSON-LD", "JSON-LD"), type: "textarea", required: true }],
    run: (input) => {
      try {
        const parsed = JSON.parse(String(input.json || ""));
        if (!parsed["@context"] || !parsed["@type"]) return { kind: "text", value: "Valid JSON, but missing @context or @type" };
        return { kind: "text", value: `Valid schema: ${parsed["@type"]}` };
      } catch { return { kind: "text", value: "Invalid JSON" }; }
    },
    seoTitle: L("Structured Data Validator", "স্ট্রাকচার্ড ডেটা ভ্যালিডেটর"),
    seoDescription: L("Validate structured data.", "স্ট্রাকচার্ড ডেটা ভ্যালিডেট করুন।"),
    keywords: ["structured data validator"],
    instructions: LI(["Paste JSON-LD."], ["JSON-LD পেস্ট করুন।"]),
    faqs: [],
    related: ["schema-markup-generator"],
  },
  {
    id: "youtube-title-generator", slug: "youtube-title-generator", category: "social", icon: "Play",
    name: L("YouTube Title Generator", "ইউটিউব শিরোনাম জেনারেটর"),
    description: L("Generate YouTube title ideas from a topic.", "বিষয় থেকে ইউটিউব শিরোনাম আইডিয়া তৈরি করুন।"),
    inputSchema: [{ name: "topic", label: L("Topic", "বিষয়"), type: "text", required: true }],
    run: (input) => {
      const t = String(input.topic || "");
      const ideas = [
        `${t}: Complete Guide for Beginners`,
        `How to ${t} - Step by Step`,
        `${t} Explained in 10 Minutes`,
        `Top 10 ${t} Tips You Need to Know`,
      ];
      return { kind: "text", value: ideas.join("\n") };
    },
    seoTitle: L("YouTube Title Generator", "ইউটিউব শিরোনাম জেনারেটর"),
    seoDescription: L("Generate YouTube titles.", "ইউটিউব শিরোনাম তৈরি করুন।"),
    keywords: ["youtube title generator"],
    instructions: LI(["Enter a topic."], ["বিষয় লিখুন।"]),
    faqs: [],
    related: [],
  },
  {
    id: "youtube-hashtag-generator", slug: "youtube-hashtag-generator", category: "social", icon: "Hash",
    name: L("YouTube Hashtag Generator", "ইউটিউব হ্যাশট্যাগ জেনারেটর"),
    description: L("Generate YouTube hashtags from keywords.", "কিওয়ার্ড থেকে ইউটিউব হ্যাশট্যাগ তৈরি করুন।"),
    inputSchema: [{ name: "keywords", label: L("Keywords", "কিওয়ার্ড"), type: "text", required: true }],
    run: (input) => {
      const tags = String(input.keywords || "").split(/[\s,]+/).filter(Boolean).map((w) => "#" + w.replace(/[^a-zA-Z0-9]/g, ""));
      return { kind: "text", value: tags.join(" ") };
    },
    seoTitle: L("YouTube Hashtag Generator", "ইউটিউব হ্যাশট্যাগ জেনারেটর"),
    seoDescription: L("Generate YouTube hashtags.", "ইউটিউব হ্যাশট্যাগ তৈরি করুন।"),
    keywords: ["youtube hashtag generator"],
    instructions: LI(["Enter keywords."], ["কিওয়ার্ড লিখুন।"]),
    faqs: [],
    related: ["hashtag-generator"],
  },
  {
    id: "social-caption-generator", slug: "social-caption-generator", category: "social", icon: "Edit",
    name: L("Social Caption Generator", "সোশ্যাল ক্যাপশন জেনারেটর"),
    description: L("Generate social media captions.", "সোশ্যাল মিডিয়া ক্যাপশন তৈরি করুন।"),
    inputSchema: [
      { name: "topic", label: L("Topic", "বিষয়"), type: "text", required: true },
      { name: "platform", label: L("Platform", "প্ল্যাটফর্ম"), type: "select", options: [
        { value: "instagram", label: L("Instagram", "ইনস্টাগ্রাম") },
        { value: "twitter", label: L("Twitter", "টুইটার") },
        { value: "facebook", label: L("Facebook", "ফেসবুক") },
      ] },
    ],
    run: (input) => {
      const t = String(input.topic || "");
      const p = input.platform || "instagram";
      const base = `Check out ${t} 🔥`;
      const tags = p === "twitter" ? "" : " #social #content #creator";
      return { kind: "text", value: base + tags };
    },
    seoTitle: L("Social Caption Generator", "সোশ্যাল ক্যাপশন জেনারেটর"),
    seoDescription: L("Generate social captions.", "সোশ্যাল ক্যাপশন তৈরি করুন।"),
    keywords: ["social caption generator"],
    instructions: LI(["Enter topic and platform."], ["বিষয় ও প্ল্যাটফর্ম দিন।"]),
    faqs: [],
    related: [],
  },
  {
    id: "instagram-bio-generator", slug: "instagram-bio-generator", category: "social", icon: "User",
    name: L("Instagram Bio Generator", "ইনস্টাগ্রাম বায়ো জেনারেটর"),
    description: L("Generate Instagram bio ideas.", "ইনস্টাগ্রাম বায়ো আইডিয়া তৈরি করুন।"),
    inputSchema: [{ name: "role", label: L("Role / Profession", "পদ / পেশা"), type: "text", required: true }],
    run: (input) => {
      const r = String(input.role || "");
      return { kind: "text", value: `${r} ✨ | Creating content daily | DM for collabs` };
    },
    seoTitle: L("Instagram Bio Generator", "ইনস্টাগ্রাম বায়ো জেনারেটর"),
    seoDescription: L("Generate Instagram bio.", "ইনস্টাগ্রাম বায়ো তৈরি করুন।"),
    keywords: ["instagram bio generator"],
    instructions: LI(["Enter role or profession."], ["পদ বা পেশা লিখুন।"]),
    faqs: [],
    related: ["bio-generator"],
  },
  {
    id: "facebook-post-formatter", slug: "facebook-post-formatter", category: "social", icon: "Facebook",
    name: L("Facebook Post Formatter", "ফেসবুক পোস্ট ফরম্যাটার"),
    description: L("Format text for a Facebook post.", "ফেসবুক পোস্টের জন্য টেক্সট ফরম্যাট করুন।"),
    inputSchema: [{ name: "text", label: L("Text", "টেক্সট"), type: "textarea", required: true }],
    run: (input) => {
      const t = String(input.text || "");
      return { kind: "text", value: `📢 ${t.trim()}\n\n#Facebook #Post #Share` };
    },
    seoTitle: L("Facebook Post Formatter", "ফেসবুক পোস্ট ফরম্যাটার"),
    seoDescription: L("Format Facebook posts.", "ফেসবুক পোস্ট ফরম্যাট করুন।"),
    keywords: ["facebook post formatter"],
    instructions: LI(["Paste text."], ["টেক্সট পেস্ট করুন।"]),
    faqs: [],
    related: [],
  },
  {
    id: "social-character-counter", slug: "social-character-counter", category: "social", icon: "Type",
    name: L("Social Character Counter", "সোশ্যাল ক্যারেক্টার কাউন্টার"),
    description: L("Count characters for social platforms.", "সোশ্যাল প্ল্যাটফর্মের ক্যারেক্টার গণনা করুন।"),
    inputSchema: [
      { name: "text", label: L("Text", "টেক্সট"), type: "textarea", required: true },
      { name: "platform", label: L("Platform", "প্ল্যাটফর্ম"), type: "select", options: [
        { value: "twitter", label: L("Twitter (280)", "টুইটার (280)") },
        { value: "instagram", label: L("Instagram (2200)", "ইনস্টাগ্রাম (2200)") },
        { value: "facebook", label: L("Facebook (63206)", "ফেসবুক (63206)") },
      ] },
    ],
    run: (input) => {
      const t = String(input.text || "");
      const len = t.length;
      const limits: Record<string, number> = { twitter: 280, instagram: 2200, facebook: 63206 };
      const limit = limits[input.platform] || 280;
      return { kind: "text", value: `Characters: ${len}/${limit}\nRemaining: ${Math.max(0, limit - len)}` };
    },
    seoTitle: L("Social Character Counter", "সোশ্যাল ক্যারেক্টার কাউন্টার"),
    seoDescription: L("Count social characters.", "সোশ্যাল ক্যারেক্টার গণনা করুন।"),
    keywords: ["social character counter"],
    instructions: LI(["Paste text."], ["টেক্সট পেস্ট করুন।"]),
    faqs: [],
    related: ["character-counter"],
  },
  {
    id: "video-aspect-ratio-calculator", slug: "video-aspect-ratio-calculator", category: "social", icon: "Maximize2",
    name: L("Video Aspect Ratio Calculator", "ভিডিও অ্যাসপেক্ট রেশন ক্যালকুলেটর"),
    description: L("Calculate video dimensions from aspect ratio.", "অ্যাসপেক্ট রেশন থেকে ভিডিও মাপ হিসাব করুন।"),
    inputSchema: [
      { name: "width", label: L("Width", "প্রস্থ"), type: "number", required: true },
      { name: "ratio", label: L("Aspect Ratio", "অ্যাসপেক্ট রেশন"), type: "select", options: [
        { value: "16:9", label: L("16:9", "16:9") }, { value: "9:16", label: L("9:16", "9:16") }, { value: "1:1", label: L("1:1", "1:1") }, { value: "4:3", label: L("4:3", "4:3") },
      ] },
    ],
    run: (input) => {
      const w = Number(input.width);
      const [a, b] = String(input.ratio).split(":").map(Number);
      const h = (w * b) / a;
      return { kind: "text", value: `Width: ${w}\nHeight: ${h.toFixed(2)}\nRatio: ${a}:${b}` };
    },
    seoTitle: L("Video Aspect Ratio Calculator", "ভিডিও অ্যাসপেক্ট রেশন ক্যালকুলেটর"),
    seoDescription: L("Calculate video aspect ratio.", "ভিডিও অ্যাসপেক্ট রেশন হিসাব করুন।"),
    keywords: ["video aspect ratio calculator"],
    instructions: LI(["Enter width and ratio."], ["প্রস্থ ও রেশন দিন।"]),
    faqs: [],
    related: ["thumbnail-dimension-guide"],
  },
  {
    id: "ai-text-rewriter", slug: "ai-text-rewriter", category: "ai", icon: "Edit",
    name: L("AI Text Rewriter", "AI টেক্সট রাইটার"),
    description: L("Rewrite and polish text with tone options. Uses AI when configured, with instant local smart rewriting fallback.", "AI ও স্মার্ট রুলস ব্যবহার করে টেক্সটকে প্রফেশনাল, স্পষ্ট ও প্রাঞ্জল ভাষায় রূপান্তর করুন।"),
    inputSchema: [
      { name: "text", label: L("Original Text", "মূল টেক্সট"), type: "textarea", required: true },
      {
        name: "tone",
        label: L("Rewriting Tone", "লেখার ধরণ বা টোন"),
        type: "select",
        options: [
          { value: "professional", label: L("Professional & Crisp", "প্রফেশনাল ও স্পষ্ট") },
          { value: "casual", label: L("Casual & Friendly", "বন্ধুত্বপূর্ণ ও সহজ") },
          { value: "concise", label: L("Concise & Punchy", "সংক্ষিপ্ত ও পয়েন্টভিত্তিক") },
        ],
      },
    ],
    run: async (input) => {
      const text = String(input.text || "").trim();
      const tone = String(input.tone || "professional");
      if (!text) return { kind: "text", value: "Please enter text to rewrite." };

      try {
        const res = await fetch("/api/ai/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: `Rewrite this text in a ${tone} tone with high clarity and natural flow:\n\n${text}` }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.result && !String(data.result).toLowerCase().includes("not configured")) {
            return { kind: "text", value: data.result };
          }
        }
      } catch {
        // Fall through to deterministic local rewriter
      }

      // Deterministic high-quality smart rewriter fallback
      const cleaned = text.replace(/\s+/g, " ");
      const sentences = cleaned.split(/(?<=[.!?])\s+/).filter(Boolean);

      const professionalVersion = sentences
        .map((s) => {
          let str = s.trim();
          str = str
            .replace(/\bin order to\b/gi, "to")
            .replace(/\bdue to the fact that\b/gi, "because")
            .replace(/\bat this point in time\b/gi, "currently")
            .replace(/\ba lot of\b/gi, "numerous")
            .replace(/\bvery\s+/gi, "")
            .replace(/\breally\s+/gi, "");
          return str.charAt(0).toUpperCase() + str.slice(1);
        })
        .join(" ");

      return {
        kind: "text",
        value: [
          `--- Option 1 (Professional & Direct) ---`,
          professionalVersion || text,
          ``,
          `--- Option 2 (Casual & Friendly) ---`,
          `Here is a fresh, natural way to express this: ${professionalVersion || text}`,
          ``,
          `--- Option 3 (Key Takeaways / Bullets) ---`,
          sentences.map((s) => `• ${s.trim()}`).join("\n"),
        ].join("\n"),
      };
    },
    seoTitle: L("AI Text Rewriter - Rewrite & Paraphrase Text Online", "AI টেক্সট রাইটার - বাক্য পরিবর্তন ও প্রফেশনাল প্যারাফ্রেজিং"),
    seoDescription: L("Rewrite articles, essays, and emails to enhance clarity, eliminate fluff, and adapt tone instantly.", "যেকোনো লেখা বা বাক্যকে প্রফেশনাল, প্রাঞ্জল ও সুন্দর ভাষায় রিরাইট ও প্যারাফ্রেজ করুন।"),
    keywords: ["ai text rewriter", "paraphrasing tool", "rewrite text", "sentence rewriter", "টেক্সট রাইটার"],
    instructions: LI(
      [
        "Paste or type your text into the Original Text box.",
        "Choose your desired tone (Professional, Casual, or Concise).",
        "Click Run Tool to view rewritten variations instantly.",
      ],
      [
        "আপনার মূল টেক্সট বা প্যারাগ্রাফটি পেস্ট করুন।",
        "লেখার ধরণ বা টোন নির্বাচন করুন (প্রফেশনাল, বন্ধুত্বপূর্ণ বা সংক্ষিপ্ত)।",
        "রান বাটনে ক্লিক করে সাথে সাথে নতুন রূপান্তরটি দেখুন।",
      ]
    ),
    faqs: [],
    related: ["ai-caption-generator", "case-converter", "text-cleaner"],
  },
  {
    id: "ai-caption-generator", slug: "ai-caption-generator", category: "ai", icon: "Edit",
    name: L("AI Caption Generator", "AI ক্যাপশন জেনারেটর"),
    description: L("Generate viral social captions with hooks and hashtags in English and Bengali.", "সোশ্যাল মিডিয়ার জন্য আকর্ষণীয় ক্যাপশন, হুক ও হ্যাশট্যাগ তৈরি করুন।"),
    inputSchema: [
      { name: "topic", label: L("Topic / Focus", "টপিক বা মূল বিষয়"), type: "text", required: true },
      {
        name: "platform",
        label: L("Target Platform", "প্ল্যাটফর্ম"),
        type: "select",
        options: [
          { value: "general", label: L("All Platforms (Universal)", "সকল প্ল্যাটফর্ম") },
          { value: "instagram", label: L("Instagram (Emojis + Hashtags)", "ইনস্টাগ্রাম") },
          { value: "linkedin", label: L("LinkedIn (Thought Leadership)", "লিঙ্কডইন") },
          { value: "facebook", label: L("Facebook (Community & Conversational)", "ফেসবুক") },
        ],
      },
    ],
    run: async (input) => {
      const topic = String(input.topic || "").trim();
      const platform = String(input.platform || "general");
      if (!topic) return { kind: "text", value: "Please enter a topic or theme." };

      try {
        const res = await fetch("/api/ai/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: `Generate 4 viral social captions for ${platform} about: ${topic}. Include hashtags and call to action.` }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.result && !String(data.result).toLowerCase().includes("not configured")) {
            return { kind: "text", value: data.result };
          }
        }
      } catch {
        // Fall through to deterministic template engine
      }

      const words = topic.toLowerCase().replace(/[^a-z0-9\s]/gi, "").split(/\s+/).filter(Boolean);
      const hashtags = words.slice(0, 4).map((w) => `#${w}`).join(" ") + " #viral #content #daily";

      return {
        kind: "text",
        value: [
          `🔥 Option 1 — Hook & Question (High Engagement):`,
          `Did you know this about ${topic}? Most people miss the simplest step! What's your secret approach? Drop your thoughts below! 👇`,
          `${hashtags}`,
          ``,
          `💡 Option 2 — Value & Inspiration (Clean & Modern):`,
          `Mastering ${topic} is all about consistency. Save this post for your daily reminder! ✨`,
          `${hashtags} #growth`,
          ``,
          `⚡ Option 3 — Short & Punchy:`,
          `${topic} in one sentence: Simplicity always wins. Double tap if you agree! ❤️`,
          `${hashtags}`,
          ``,
          `🇧🇩 Option 4 — বাংলা ক্যাপশন (Bengali):`,
          `${topic} নিয়ে আপনার সবচেয়ে বড় অভিজ্ঞতা কী? শেয়ার করুন কমেন্টে! 🚀`,
          `#বাংলাদেশ #ক্যাপশন #টিপস`,
        ].join("\n"),
      };
    },
    seoTitle: L("AI Caption Generator - Viral Social Media Captions & Hashtags", "AI ক্যাপশন জেনারেটর - সোশ্যাল মিডিয়ার সেরা ক্যাপশন ও হ্যাশট্যাগ"),
    seoDescription: L("Create catchy, viral captions with hashtags for Instagram, Facebook, and LinkedIn in English and Bengali.", "ইনস্টাগ্রাম, ফেসবুক ও লিঙ্কডইনের জন্য আকর্ষণীয় বাংলা ও ইংরেজি ক্যাপশন তৈরি করুন বিনামূল্যে।"),
    keywords: ["ai caption generator", "social media caption generator", "instagram caption generator", "ক্যাপশন জেনারেটর"],
    instructions: LI(
      [
        "Enter the topic, event, or mood of your post.",
        "Select your target social platform.",
        "Click Run Tool to copy high-engagement captions with hashtags.",
      ],
      [
        "আপনার পোস্টের টপিক বা বিষয়বস্তু লিখুন।",
        "কোন সোশ্যাল প্ল্যাটফর্মের জন্য ক্যাপশন চান তা বেছে নিন।",
        "রান বাটনে ক্লিক করে সাথে সাথে একাধিক ক্যাপশন ও হ্যাশট্যাগ পান।",
      ]
    ),
    faqs: [],
    related: ["social-media-caption-generator", "ai-text-rewriter", "hashtag-generator"],
  },
  {
    id: "ai-product-description-generator", slug: "ai-product-description-generator", category: "ai", icon: "Package",
    name: L("AI Product Description Generator", "AI প্রোডাক্ট ডেসক্রিপশন জেনারেটর"),
    description: L("Generate product descriptions using AI provider.", "AI প্রোভাইডার দিয়ে প্রোডাক্ট ডেসক্রিপশন তৈরি করুন।"),
    inputSchema: [{ name: "product", label: L("Product", "প্রোডাক্ট"), type: "text", required: true }],
    run: async (input) => {
      const res = await fetch("/api/ai/complete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: `Product description: ${input.product}` }) });
      if (!res.ok) return { kind: "text", value: await res.text() || "AI provider not configured" };
      const data = await res.json();
      return { kind: "text", value: data.result || "No result" };
    },
    seoTitle: L("AI Product Description Generator", "AI প্রোডাক্ট ডেসক্রিপশন জেনারেটর"),
    seoDescription: L("Generate product descriptions with AI.", "AI দিয়ে প্রোডাক্ট ডেসক্রিপশন তৈরি করুন।"),
    keywords: ["ai product description generator"],
    instructions: LI(["Enter product name."], ["প্রোডাক্টের নাম লিখুন।"]),
    faqs: [],
    related: [],
  },
  {
    id: "ai-blog-outline-generator", slug: "ai-blog-outline-generator", category: "ai", icon: "FileText",
    name: L("AI Blog Outline Generator", "AI ব্লগ আউটলাইন জেনারেটর"),
    description: L("Generate blog outlines using AI provider.", "AI প্রোভাইডার দিয়ে ব্লগ আউটলাইন তৈরি করুন।"),
    inputSchema: [{ name: "topic", label: L("Topic", "বিষয়"), type: "text", required: true }],
    run: async (input) => {
      const res = await fetch("/api/ai/complete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: `Blog outline: ${input.topic}` }) });
      if (!res.ok) return { kind: "text", value: await res.text() || "AI provider not configured" };
      const data = await res.json();
      return { kind: "text", value: data.result || "No result" };
    },
    seoTitle: L("AI Blog Outline Generator", "AI ব্লগ আউটলাইন জেনারেটর"),
    seoDescription: L("Generate blog outlines with AI.", "AI দিয়ে ব্লগ আউটলাইন তৈরি করুন।"),
    keywords: ["ai blog outline generator"],
    instructions: LI(["Enter topic."], ["বিষয় লিখুন।"]),
    faqs: [],
    related: [],
  },
  {
    id: "ai-email-draft-generator", slug: "ai-email-draft-generator", category: "ai", icon: "Mail",
    name: L("AI Email Draft Generator", "AI ইমেইল ড্রাফট জেনারেটর"),
    description: L("Generate email drafts using AI provider.", "AI প্রোভাইডার দিয়ে ইমেইল ড্রাফট তৈরি করুন।"),
    inputSchema: [{ name: "topic", label: L("Topic", "বিষয়"), type: "text", required: true }],
    run: async (input) => {
      const res = await fetch("/api/ai/complete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: `Email draft: ${input.topic}` }) });
      if (!res.ok) return { kind: "text", value: await res.text() || "AI provider not configured" };
      const data = await res.json();
      return { kind: "text", value: data.result || "No result" };
    },
    seoTitle: L("AI Email Draft Generator", "AI ইমেইল ড্রাফট জেনারেটর"),
    seoDescription: L("Generate email drafts with AI.", "AI দিয়ে ইমেইল ড্রাফট তৈরি করুন।"),
    keywords: ["ai email draft generator"],
    instructions: LI(["Enter topic."], ["বিষয় লিখুন।"]),
    faqs: [],
    related: [],
  },
  {
    id: "ai-title-generator", slug: "ai-title-generator", category: "ai", icon: "Type",
    name: L("AI Title Generator", "AI টাইটেল জেনারেটর"),
    description: L("Generate titles using AI provider.", "AI প্রোভাইডার দিয়ে টাইটেল তৈরি করুন।"),
    inputSchema: [{ name: "topic", label: L("Topic", "বিষয়"), type: "text", required: true }],
    run: async (input) => {
      const res = await fetch("/api/ai/complete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: `Titles: ${input.topic}` }) });
      if (!res.ok) return { kind: "text", value: await res.text() || "AI provider not configured" };
      const data = await res.json();
      return { kind: "text", value: data.result || "No result" };
    },
    seoTitle: L("AI Title Generator", "AI টাইটেল জেনারেটর"),
    seoDescription: L("Generate titles with AI.", "AI দিয়ে টাইটেল তৈরি করুন।"),
    keywords: ["ai title generator"],
    instructions: LI(["Enter topic."], ["বিষয় লিখুন।"]),
    faqs: [],
    related: [],
  },
  {
    id: "ai-hashtag-assistant", slug: "ai-hashtag-assistant", category: "ai", icon: "Hash",
    name: L("AI Hashtag Assistant", "AI হ্যাশট্যাগ অ্যাসিস্ট্যান্ট"),
    description: L("Generate hashtags using AI provider.", "AI প্রোভাইডার দিয়ে হ্যাশট্যাগ তৈরি করুন।"),
    inputSchema: [{ name: "topic", label: L("Topic", "বিষয়"), type: "text", required: true }],
    run: async (input) => {
      const res = await fetch("/api/ai/complete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: `Hashtags: ${input.topic}` }) });
      if (!res.ok) return { kind: "text", value: await res.text() || "AI provider not configured" };
      const data = await res.json();
      return { kind: "text", value: data.result || "No result" };
    },
    seoTitle: L("AI Hashtag Assistant", "AI হ্যাশট্যাগ অ্যাসিস্ট্যান্ট"),
    seoDescription: L("Generate hashtags with AI.", "AI দিয়ে হ্যাশট্যাগ তৈরি করুন।"),
    keywords: ["ai hashtag assistant"],
    instructions: LI(["Enter topic."], ["বিষয় লিখুন।"]),
    faqs: [],
    related: [],
  },
  {
    id: "ai-summary-generator", slug: "ai-summary-generator", category: "ai", icon: "Sparkles",
    name: L("AI Summary Generator", "AI সামারি জেনারেটর"),
    description: L("Generate summaries using AI provider.", "AI প্রোভাইডার দিয়ে সামারি তৈরি করুন।"),
    inputSchema: [{ name: "text", label: L("Text", "টেক্সট"), type: "textarea", required: true }],
    run: async (input) => {
      const res = await fetch("/api/ai/complete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: `Summarize: ${input.text}` }) });
      if (!res.ok) return { kind: "text", value: await res.text() || "AI provider not configured" };
      const data = await res.json();
      return { kind: "text", value: data.result || "No result" };
    },
    seoTitle: L("AI Summary Generator", "AI সামারি জেনারেটর"),
    seoDescription: L("Generate summaries with AI.", "AI দিয়ে সামারি তৈরি করুন।"),
    keywords: ["ai summary generator"],
    instructions: LI(["Enter text."], ["টেক্সট লিখুন।"]),
    faqs: [],
    related: [],
  },
  {
    id: "image-rotator", slug: "image-rotator", category: "image", icon: "RotateCw",
    name: L("Image Rotator", "ইমেজ রোটেটর"),
    description: L("Rotate image by degrees.", "ডিগ্রি অনুযায়ী ছবি ঘোরান।"),
    inputSchema: [
      { name: "file", label: L("Image", "ছবি"), type: "file", accept: "image/*", required: true },
      { name: "deg", label: L("Degrees", "ডিগ্রি"), type: "number", min: -360, max: 360, step: 1 },
    ],
    run: async (input) => {
      const file = input.file as File;
      if (!file) return { kind: "text", value: "No file" };
      const img = await (async () => { const i = new Image(); const u = URL.createObjectURL(file); return new Promise<HTMLImageElement>((res) => { i.onload = () => { URL.revokeObjectURL(u); res(i); }; i.src = u; }); })();
      const deg = Number(input.deg) || 90;
      const rad = (deg * Math.PI) / 180;
      const canvas = document.createElement("canvas");
      const cos = Math.abs(Math.cos(rad)), sin = Math.abs(Math.sin(rad));
      canvas.width = Math.round(img.width * cos + img.height * sin);
      canvas.height = Math.round(img.width * sin + img.height * cos);
      const ctx = canvas.getContext("2d")!;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(rad);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      const du = await new Promise<string>((resolve) => { canvas.toBlob((b) => { if (!b) return resolve(""); const r = new FileReader(); r.onload = () => resolve(String(r.result)); r.readAsDataURL(b); }, file.type || "image/png"); });
      return { kind: "image", value: du, filename: "rotated.png" };
    },
    seoTitle: L("Image Rotator", "ইমেজ রোটেটর"),
    seoDescription: L("Rotate images.", "ছবি ঘোরান।"),
    keywords: ["image rotator"],
    instructions: LI(["Upload image, enter degrees."], ["ছবি আপলোড, ডিগ্রি দিন।"]),
    faqs: [],
    related: ["image-resizer"],
  },
  {
    id: "image-flipper", slug: "image-flipper", category: "image", icon: "FlipHorizontal",
    name: L("Image Flipper", "ইমেজ ফ্লিপার"),
    description: L("Flip image horizontally or vertically.", "छবি অনুভূমিক বা উল্লম্বভাবে ফ্লিপ করুন।"),
    inputSchema: [
      { name: "file", label: L("Image", "ছবি"), type: "file", accept: "image/*", required: true },
      { name: "dir", label: L("Direction", "দিক"), type: "select", options: [
        { value: "h", label: L("Horizontal", "অনুভূমিক") },
        { value: "v", label: L("Vertical", "উল্লম্ব") },
      ] },
    ],
    run: async (input) => {
      const file = input.file as File;
      if (!file) return { kind: "text", value: "No file" };
      const img = await (async () => { const i = new Image(); const u = URL.createObjectURL(file); return new Promise<HTMLImageElement>((res) => { i.onload = () => { URL.revokeObjectURL(u); res(i); }; i.src = u; }); })();
      const canvas = document.createElement("canvas");
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      if (input.dir === "v") { ctx.translate(0, canvas.height); ctx.scale(1, -1); }
      else { ctx.translate(canvas.width, 0); ctx.scale(-1, 1); }
      ctx.drawImage(img, 0, 0);
      const du = await new Promise<string>((resolve) => { canvas.toBlob((b) => { if (!b) return resolve(""); const r = new FileReader(); r.onload = () => resolve(String(r.result)); r.readAsDataURL(b); }, file.type || "image/png"); });
      return { kind: "image", value: du, filename: "flipped.png" };
    },
    seoTitle: L("Image Flipper", "ইমেজ ফ্লিপার"),
    seoDescription: L("Flip images.", "ছবি ফ্লিপ করুন।"),
    keywords: ["image flipper"],
    instructions: LI(["Upload image and choose direction."], ["ছবি আপলোড ও দিক বেছে নিন।"]),
    faqs: [],
    related: ["image-rotator"],
  },
  {
    id: "image-blur-tool", slug: "image-blur-tool", category: "image", icon: "Droplet",
    name: L("Image Blur Tool", "ইমেজ ব্লার টুল"),
    description: L("Apply blur to an image.", "ছবিতে ব্লার প্রয়োগ করুন।"),
    inputSchema: [
      { name: "file", label: L("Image", "ছবি"), type: "file", accept: "image/*", required: true },
      { name: "amount", label: L("Blur (px)", "ব্লার (px)"), type: "number", min: 0, max: 20, step: 1 },
    ],
    run: async (input) => {
      const file = input.file as File;
      if (!file) return { kind: "text", value: "No file" };
      const img = await (async () => { const i = new Image(); const u = URL.createObjectURL(file); return new Promise<HTMLImageElement>((res) => { i.onload = () => { URL.revokeObjectURL(u); res(i); }; i.src = u; }); })();
      const canvas = document.createElement("canvas");
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.filter = `blur(${Number(input.amount) || 4}px)`;
      ctx.drawImage(img, 0, 0);
      const du = await new Promise<string>((resolve) => { canvas.toBlob((b) => { if (!b) return resolve(""); const r = new FileReader(); r.onload = () => resolve(String(r.result)); r.readAsDataURL(b); }, file.type || "image/png"); });
      return { kind: "image", value: du, filename: "blurred.png" };
    },
    seoTitle: L("Image Blur Tool", "ইমেজ ব্লার টুল"),
    seoDescription: L("Blur images.", "ছবি ব্লার করুন।"),
    keywords: ["image blur tool"],
    instructions: LI(["Upload image, set blur."], ["ছবি আপলোড, ব্লার সেট করুন।"]),
    faqs: [],
    related: ["image-pixelate-tool"],
  },
  {
    id: "image-pixelate-tool", slug: "image-pixelate-tool", category: "image", icon: "Grid",
    name: L("Image Pixelate Tool", "ইমেজ পিক্সেলেট টুল"),
    description: L("Pixelate an image.", "ছবি পিক্সেলেট করুন।"),
    inputSchema: [
      { name: "file", label: L("Image", "ছবি"), type: "file", accept: "image/*", required: true },
      { name: "block", label: L("Block Size", "ব্লক সাইজ"), type: "number", min: 2, max: 40, step: 1 },
    ],
    run: async (input) => {
      const file = input.file as File;
      if (!file) return { kind: "text", value: "No file" };
      const img = await (async () => { const i = new Image(); const u = URL.createObjectURL(file); return new Promise<HTMLImageElement>((res) => { i.onload = () => { URL.revokeObjectURL(u); res(i); }; i.src = u; }); })();
      const block = Math.max(2, Number(input.block) || 8);
      const w = Math.floor(img.width / block), h = Math.floor(img.height / block);
      const canvas = document.createElement("canvas");
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      const tmp = document.createElement("canvas"); tmp.width = w; tmp.height = h;
      const tctx = tmp.getContext("2d")!;
      tctx.drawImage(img, 0, 0, w, h);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(tmp, 0, 0, w, h, 0, 0, canvas.width, canvas.height);
      const du = await new Promise<string>((resolve) => { canvas.toBlob((b) => { if (!b) return resolve(""); const r = new FileReader(); r.onload = () => resolve(String(r.result)); r.readAsDataURL(b); }, file.type || "image/png"); });
      return { kind: "image", value: du, filename: "pixelated.png" };
    },
    seoTitle: L("Image Pixelate Tool", "ইমেজ পিক্সেলেট টুল"),
    seoDescription: L("Pixelate images.", "ছবি পিক্সেলেট করুন।"),
    keywords: ["image pixelate tool"],
    instructions: LI(["Upload image, set block size."], ["ছবি আপলোড, ব্লক সাইজ সেট করুন।"]),
    faqs: [],
    related: ["image-blur-tool"],
  },
  {
    id: "image-dimensions-checker", slug: "image-dimensions-checker", category: "image", icon: "Ruler",
    name: L("Image Dimensions Checker", "ইমেজ ডাইমেনশন চেকার"),
    description: L("Check image width, height and size.", "ছবির প্রস্থ, উচ্চতা ও সাইজ চেক করুন।"),
    inputSchema: [{ name: "file", label: L("Image", "ছবি"), type: "file", accept: "image/*", required: true }],
    run: async (input) => {
      const file = input.file as File;
      if (!file) return { kind: "text", value: "No file" };
      const img = await (async () => { const i = new Image(); const u = URL.createObjectURL(file); return new Promise<HTMLImageElement>((res) => { i.onload = () => { URL.revokeObjectURL(u); res(i); }; i.src = u; }); })();
      return { kind: "text", value: `Width: ${img.width}px\nHeight: ${img.height}px\nAspect ratio: ${(img.width/img.height).toFixed(2)}\nFile size: ${(file.size/1024).toFixed(2)} KB\nType: ${file.type}` };
    },
    seoTitle: L("Image Dimensions Checker", "ইমেজ ডাইমেনশন চেকার"),
    seoDescription: L("Check image dimensions.", "ছবির মাপ চেক করুন।"),
    keywords: ["image dimensions checker"],
    instructions: LI(["Upload image."], ["ছবি আপলোড করুন।"]),
    faqs: [],
    related: ["image-resizer"],
  },
  {
    id: "text-diff-checker", slug: "text-diff-checker", category: "text", icon: "GitCompare",
    name: L("Text Diff Checker", "টেক্সট ডিফ চেকার"),
    description: L("Compare two texts line by line.", "দুটি টেক্সট লাইন বাই লাইন তুলনা করুন।"),
    inputSchema: [
      { name: "a", label: L("Text A", "টেক্সট A"), type: "textarea", required: true },
      { name: "b", label: L("Text B", "টেক্সট B"), type: "textarea", required: true },
    ],
    run: (input) => {
      const a = String(input.a || "").split(/\n/);
      const b = String(input.b || "").split(/\n/);
      const n = Math.max(a.length, b.length);
      const out: string[] = [];
      for (let i = 0; i < n; i++) {
        const la = a[i] ?? ""; const lb = b[i] ?? "";
        if (la === lb) out.push(`  ${la}`);
        else { if (la) out.push(`- ${la}`); if (lb) out.push(`+ ${lb}`); }
      }
      return { kind: "text", value: out.join("\n") };
    },
    seoTitle: L("Text Diff Checker", "টেক্সট ডিফ চেকার"),
    seoDescription: L("Compare two texts.", "দুটি টেক্সট তুলনা করুন।"),
    keywords: ["text diff checker"],
    instructions: LI(["Paste both texts."], ["দুই টেক্সট পেস্ট করুন।"]),
    faqs: [],
    related: [],
  },
  {
    id: "find-and-replace", slug: "find-and-replace", category: "text", icon: "Search",
    name: L("Find and Replace", "ফাইন্ড অ্যান্ড রিপ্লেস"),
    description: L("Find and replace text.", "টেক্সট খুঁজুন ও প্রতিস্থাপন করুন।"),
    inputSchema: [
      { name: "text", label: L("Text", "টেক্সট"), type: "textarea", required: true },
      { name: "find", label: L("Find", "খুঁজুন"), type: "text", required: true },
      { name: "replace", label: L("Replace", "প্রতিস্থাপন"), type: "text" },
      { name: "all", label: L("Replace All", "সব প্রতিস্থাপন"), type: "checkbox" },
    ],
    run: (input) => {
      const t = String(input.text || "");
      const f = String(input.find || "");
      const r = String(input.replace || "");
      if (!f) return { kind: "text", value: t };
      if (input.all) return { kind: "text", value: t.split(f).join(r) };
      return { kind: "text", value: t.replace(f, r) };
    },
    seoTitle: L("Find and Replace", "ফাইন্ড অ্যান্ড রিপ্লেস"),
    seoDescription: L("Find and replace text.", "টেক্সট খুঁজুন ও প্রতিস্থাপন করুন।"),
    keywords: ["find and replace"],
    instructions: LI(["Paste text, enter find/replace."], ["টেক্সট পেস্ট করে find/replace দিন।"]),
    faqs: [],
    related: ["text-cleaner"],
  },
  {
    id: "text-to-slug", slug: "text-to-slug", category: "text", icon: "Link",
    name: L("Text to Slug", "টেক্সট টু স্লাগ"),
    description: L("Convert text to a URL slug.", "টেক্সটকে URL স্লাগে রূপান্তর করুন।"),
    inputSchema: [{ name: "text", label: L("Text", "টেক্সট"), type: "text", required: true }],
    run: (input) => {
      const t = String(input.text || "");
      const slug = t.toLowerCase().trim().replace(/[^a-z0-9\u0980-\u09ff]+/g, "-").replace(/^-+|-+$/g, "");
      return { kind: "text", value: slug };
    },
    seoTitle: L("Text to Slug", "টেক্সট টু স্লাগ"),
    seoDescription: L("Convert text to slug.", "টেক্সট স্লাগে রূপান্তর করুন।"),
    keywords: ["text to slug"],
    instructions: LI(["Enter text."], ["টেক্সট লিখুন।"]),
    faqs: [],
    related: ["url-slug-generator"],
  },
  {
    id: "readability-checker", slug: "readability-checker", category: "text", icon: "BookOpen",
    name: L("Readability Checker", "রিডেবিলিটি চেকার"),
    description: L("Basic readability metrics for text.", "টেক্সটের বেসিক রিডেবিলিটি মেট্রিক্স।"),
    inputSchema: [{ name: "text", label: L("Text", "টেক্সট"), type: "textarea", required: true }],
    run: (input) => {
      const t = String(input.text || "");
      const words = t.trim() ? t.trim().split(/\s+/).length : 0;
      const sentences = t.trim() ? (t.match(/[.!?]+/g) || []).length || 1 : 0;
      const avg = sentences ? (words / sentences).toFixed(1) : "0";
      return { kind: "text", value: `Words: ${words}\nSentences: ${sentences}\nAvg words/sentence: ${avg}` };
    },
    seoTitle: L("Readability Checker", "রিডেবিলিটি চেকার"),
    seoDescription: L("Check readability.", "রিডেবিলিটি পরীক্ষা করুন।"),
    keywords: ["readability checker"],
    instructions: LI(["Paste text."], ["টেক্সট পেস্ট করুন।"]),
    faqs: [],
    related: ["word-counter"],
  },
  {
    id: "text-reverser", slug: "text-reverser", category: "text", icon: "ArrowLeftRight",
    name: L("Text Reverser", "টেক্সট রিভার্সার"),
    description: L("Reverse text, words or lines.", "টেক্সট, শব্দ বা লাইন উল্টে দিন।"),
    inputSchema: [
      { name: "text", label: L("Text", "টেক্সট"), type: "textarea", required: true },
      { name: "mode", label: L("Mode", "মোড"), type: "select", options: [
        { value: "chars", label: L("Characters", "অক্ষর") },
        { value: "words", label: L("Words", "শব্দ") },
        { value: "lines", label: L("Lines", "লাইন") },
      ] },
    ],
    run: (input) => {
      const t = String(input.text || "");
      const mode = input.mode || "chars";
      if (mode === "words") return { kind: "text", value: t.split(/\s+/).reverse().join(" ") };
      if (mode === "lines") return { kind: "text", value: t.split(/\n/).reverse().join("\n") };
      return { kind: "text", value: t.split("").reverse().join("") };
    },
    seoTitle: L("Text Reverser", "টেক্সট রিভার্সার"),
    seoDescription: L("Reverse text.", "টেক্সট উল্টান।"),
    keywords: ["text reverser"],
    instructions: LI(["Paste text and choose mode."], ["টেক্সট পেস্ট করে মোড বেছে নিন।"]),
    faqs: [],
    related: [],
  },
  {
    id: "html-minifier", slug: "html-minifier", category: "developer", icon: "Minimize2",
    name: L("HTML Minifier", "HTML মিনিফায়ার"),
    description: L("Minify HTML code.", "HTML কোড মিনিফাই করুন।"),
    inputSchema: [{ name: "html", label: L("HTML", "HTML"), type: "textarea", required: true }],
    run: (input) => {
      const html = String(input.html || "");
      const min = html.replace(/<!--[\s\S]*?-->/g, "").replace(/\s+/g, " ").replace(/>\s+</g, "><").trim();
      return { kind: "text", value: min };
    },
    seoTitle: L("HTML Minifier", "HTML মিনিফায়ার"),
    seoDescription: L("Minify HTML.", "HTML মিনিফাই করুন।"),
    keywords: ["html minifier"],
    instructions: LI(["Paste HTML."], ["HTML পেস্ট করুন।"]),
    faqs: [],
    related: ["css-minifier", "js-minifier"],
  },
  {
    id: "css-formatter", slug: "css-formatter", category: "developer", icon: "Code",
    name: L("CSS Formatter", "CSS ফরম্যাটার"),
    description: L("Format CSS code.", "CSS কোড ফরম্যাট করুন।"),
    inputSchema: [{ name: "css", label: L("CSS", "CSS"), type: "textarea", required: true }],
    run: (input) => {
      const css = String(input.css || "");
      const out = css.replace(/\s*\{\s*/g, " {\n  ").replace(/;\s*/g, ";\n  ").replace(/\s*\}\s*/g, "\n}\n");
      return { kind: "text", value: out.trim() };
    },
    seoTitle: L("CSS Formatter", "CSS ফরম্যাটার"),
    seoDescription: L("Format CSS.", "CSS ফরম্যাট করুন।"),
    keywords: ["css formatter"],
    instructions: LI(["Paste CSS."], ["CSS পেস্ট করুন।"]),
    faqs: [],
    related: ["css-minifier"],
  },
  {
    id: "js-formatter", slug: "js-formatter", category: "developer", icon: "Code",
    name: L("JavaScript Formatter", "JavaScript ফরম্যাটার"),
    description: L("Basic JavaScript formatting.", "বেসিক JavaScript ফরম্যাটিং।"),
    inputSchema: [{ name: "js", label: L("JavaScript", "JavaScript"), type: "textarea", required: true }],
    run: (input) => {
      const js = String(input.js || "");
      const out = js.replace(/;/g, ";\n").replace(/\{/g, " {\n").replace(/\}/g, "\n}\n");
      return { kind: "text", value: out.trim() };
    },
    seoTitle: L("JavaScript Formatter", "JavaScript ফরম্যাটার"),
    seoDescription: L("Format JavaScript.", "JavaScript ফরম্যাট করুন।"),
    keywords: ["javascript formatter"],
    instructions: LI(["Paste JS."], ["JS পেস্ট করুন।"]),
    faqs: [],
    related: ["js-minifier"],
  },
  {
    id: "markdown-preview", slug: "markdown-preview", category: "developer", icon: "FileText",
    name: L("Markdown Preview", "মার্কডাউন প্রিভিউ"),
    description: L("Preview Markdown as HTML (basic).", "মার্কডাউন বেসিক HTML প্রিভিউ।"),
    inputSchema: [{ name: "md", label: L("Markdown", "মার্কডাউন"), type: "textarea", required: true }],
    run: (input) => {
      const md = String(input.md || "");
      const html = md
        .replace(/^### (.*)$/gm, "<h3>$1</h3>")
        .replace(/^## (.*)$/gm, "<h2>$1</h2>")
        .replace(/^# (.*)$/gm, "<h1>$1</h1>")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/\n/g, "<br>");
      return { kind: "html", value: html };
    },
    seoTitle: L("Markdown Preview", "মার্কডাউন প্রিভিউ"),
    seoDescription: L("Preview Markdown.", "মার্কডাউন প্রিভিউ করুন।"),
    keywords: ["markdown preview"],
    instructions: LI(["Paste Markdown."], ["মার্কডাউন পেস্ট করুন।"]),
    faqs: [],
    related: [],
  },
  {
    id: "user-agent-parser", slug: "user-agent-parser", category: "developer", icon: "Monitor",
    name: L("User Agent Parser", "ইউজার এজেন্ট পার্সার"),
    description: L("Parse user agent string.", "ইউজার এজেন্ট স্ট্রিং পার্স করুন।"),
    inputSchema: [{ name: "ua", label: L("User Agent", "ইউজার এজেন্ট"), type: "textarea", required: true }],
    run: (input) => {
      const ua = String(input.ua || "");
      const browser = ua.match(/(Chrome|Firefox|Safari|Edge|Opera)\/[\d.]+/i)?.[0] || "Unknown";
      const os = ua.match(/(Windows|Macintosh|Linux|Android|iPhone|iPad)/i)?.[0] || "Unknown";
      return { kind: "text", value: `Browser: ${browser}\nOS: ${os}` };
    },
    seoTitle: L("User Agent Parser", "ইউজার এজেন্ট পার্সার"),
    seoDescription: L("Parse user agent.", "ইউজার এজেন্ট পার্স করুন।"),
    keywords: ["user agent parser"],
    instructions: LI(["Paste user agent."], ["ইউজার এজেন্ট পেস্ট করুন।"]),
    faqs: [],
    related: [],
  },
  {
    id: "http-status-reference", slug: "http-status-reference", category: "developer", icon: "Globe",
    name: L("HTTP Status Code Reference", "HTTP স্ট্যাটাস কোড রেফারেন্স"),
    description: L("Look up HTTP status code meaning.", "HTTP স্ট্যাটাস কোডের অর্থ খুঁজুন।"),
    inputSchema: [{ name: "code", label: L("Status Code", "স্ট্যাটাস কোড"), type: "number", required: true }],
    run: (input) => {
      const map: Record<number, string> = { 200: "OK", 201: "Created", 301: "Moved Permanently", 302: "Found", 400: "Bad Request", 401: "Unauthorized", 403: "Forbidden", 404: "Not Found", 500: "Internal Server Error", 503: "Service Unavailable" };
      const c = Number(input.code);
      return { kind: "text", value: map[c] || "Unknown status code" };
    },
    seoTitle: L("HTTP Status Code Reference", "HTTP স্ট্যাটাস কোড রেফারেন্স"),
    seoDescription: L("HTTP status codes.", "HTTP স্ট্যাটাস কোড।"),
    keywords: ["http status code"],
    instructions: LI(["Enter a status code."], ["স্ট্যাটাস কোড লিখুন।"]),
    faqs: [],
    related: [],
  },
  {
    id: "serp-snippet-preview", slug: "serp-snippet-preview", category: "seo", icon: "Search",
    name: L("SERP Snippet Preview", "SERP স্নিপেট প্রিভিউ"),
    description: L("Preview a search result snippet.", "সার্চ রিজাল্ট স্নিপেট প্রিভিউ করুন।"),
    inputSchema: [
      { name: "title", label: L("Title", "শিরোনাম"), type: "text", required: true },
      { name: "url", label: L("URL", "URL"), type: "text", required: true },
      { name: "description", label: L("Description", "বিবরণ"), type: "textarea" },
    ],
    run: (input) => {
      const html = `<div style="font-family:Arial;max-width:600px"><div style="color:#1a0dab;font-size:18px">${input.title}</div><div style="color:#006621;font-size:14px">${input.url}</div><div style="color:#545454;font-size:14px">${input.description || ""}</div></div>`;
      return { kind: "html", value: html };
    },
    seoTitle: L("SERP Snippet Preview", "SERP স্নিপেট প্রিভিউ"),
    seoDescription: L("Preview SERP snippet.", "SERP স্নিপেট প্রিভিউ করুন।"),
    keywords: ["serp snippet preview"],
    instructions: LI(["Enter title, url, description."], ["শিরোনাম, URL, বিবরণ দিন।"]),
    faqs: [],
    related: [],
  },
  {
    id: "canonical-url-checker", slug: "canonical-url-checker", category: "seo", icon: "Link",
    name: L("Canonical URL Checker", "ক্যানোনিকাল URL চেকার"),
    description: L("Extract canonical tag from HTML.", "HTML থেকে ক্যানোনিকাল ট্যাগ বের করুন।"),
    inputSchema: [{ name: "html", label: L("HTML", "HTML"), type: "textarea", required: true }],
    run: (input) => {
      const html = String(input.html || "");
      const m = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
      return { kind: "text", value: m ? `Canonical: ${m[1]}` : "No canonical tag found" };
    },
    seoTitle: L("Canonical URL Checker", "ক্যানোনিকাল URL চেকার"),
    seoDescription: L("Check canonical URL.", "ক্যানোনিকাল URL পরীক্ষা করুন।"),
    keywords: ["canonical url checker"],
    instructions: LI(["Paste HTML."], ["HTML পেস্ট করুন।"]),
    faqs: [],
    related: ["canonical-url-generator"],
  },
  {
    id: "random-number-generator", slug: "random-number-generator", category: "developer", icon: "Dices",
    name: L("Random Number Generator", "র‍্যান্ডম নাম্বার জেনারেটর"),
    description: L("Generate random numbers.", "র‍্যান্ডম নাম্বার তৈরি করুন।"),
    inputSchema: [
      { name: "min", label: L("Min", "সর্বনিম্ন"), type: "number", required: true },
      { name: "max", label: L("Max", "সর্বোচ্চ"), type: "number", required: true },
      { name: "count", label: L("Count", "সংখ্যা"), type: "number", min: 1, max: 50, step: 1 },
    ],
    run: (input) => {
      const min = Number(input.min), max = Number(input.max), n = Math.min(50, Math.max(1, Number(input.count) || 1));
      const out: string[] = [];
      for (let i = 0; i < n; i++) out.push(String(Math.floor(Math.random() * (max - min + 1)) + min));
      return { kind: "text", value: out.join("\n") };
    },
    seoTitle: L("Random Number Generator", "র‍্যান্ডম নাম্বার জেনারেটর"),
    seoDescription: L("Generate random numbers.", "র‍্যান্ডম নাম্বার তৈরি করুন।"),
    keywords: ["random number generator"],
    instructions: LI(["Enter min, max, count."], ["সর্বনিম্ন, সর্বোচ্চ, সংখ্যা দিন।"]),
    faqs: [],
    related: [],
  },
  {
    id: "word-frequency-counter", slug: "word-frequency-counter", category: "text", icon: "BarChart",
    name: L("Word Frequency Counter", "শব্দ ফ্রিকোয়েন্সি কাউন্টার"),
    description: L("Count word frequency in text.", "টেক্সটের শব্দ ফ্রিকোয়েন্সি গণনা করুন।"),
    inputSchema: [{ name: "text", label: L("Text", "টেক্সট"), type: "textarea", required: true }],
    run: (input) => {
      const t = String(input.text || "");
      const words = t.toLowerCase().match(/\b\w+\b/g) || [];
      const freq: Record<string, number> = {};
      words.forEach((w) => { freq[w] = (freq[w] || 0) + 1; });
      const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
      return { kind: "text", value: sorted.map(([w, c]) => `${w}: ${c}`).join("\n") };
    },
    seoTitle: L("Word Frequency Counter", "শব্দ ফ্রিকোয়েন্সি কাউন্টার"),
    seoDescription: L("Count word frequency.", "শব্দ ফ্রিকোয়েন্সি গণনা করুন।"),
    keywords: ["word frequency counter"],
    instructions: LI(["Paste text."], ["টেক্সট পেস্ট করুন।"]),
    faqs: [],
    related: ["word-counter"],
  },
  {
    id: "password-strength-checker", slug: "password-strength-checker", category: "developer", icon: "Shield",
    name: L("Password Strength Checker", "পাসওয়ার্ড স্ট্রেংথ চেকার"),
    description: L("Check password strength locally.", "পাসওয়ার্ডের শক্তি লোকালি চেক করুন।"),
    inputSchema: [{ name: "password", label: L("Password", "পাসওয়ার্ড"), type: "text", required: true }],
    run: (input) => {
      const p = String(input.password || "");
      let score = 0;
      if (p.length >= 8) score++;
      if (/[A-Z]/.test(p)) score++;
      if (/[a-z]/.test(p)) score++;
      if (/[0-9]/.test(p)) score++;
      if (/[^A-Za-z0-9]/.test(p)) score++;
      const levels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
      return { kind: "text", value: `Score: ${score}/5\nStrength: ${levels[Math.min(score, 4)]}` };
    },
    seoTitle: L("Password Strength Checker", "পাসওয়ার্ড স্ট্রেংথ চেকার"),
    seoDescription: L("Check password strength.", "পাসওয়ার্ডের শক্তি চেক করুন।"),
    keywords: ["password strength checker"],
    instructions: LI(["Enter password."], ["পাসওয়ার্ড লিখুন।"]),
    faqs: [],
    related: ["password-generator"],
  },
  {
    id: "uppercase-converter", slug: "uppercase-converter", category: "text", icon: "Type",
    name: L("Uppercase Converter", "বড় হাত কনভার্টার"),
    description: L("Convert text to uppercase.", "টেক্সট বড় হাতে রূপান্তর করুন।"),
    inputSchema: [{ name: "text", label: L("Text", "টেক্সট"), type: "textarea", required: true }],
    run: (input) => ({ kind: "text", value: String(input.text || "").toUpperCase() }),
    seoTitle: L("Uppercase Converter", "বড় হাত কনভার্টার"),
    seoDescription: L("Convert text to uppercase.", "টেক্সট বড় হাতে রূপান্তর করুন।"),
    keywords: ["uppercase converter"],
    instructions: LI(["Paste text."], ["টেক্সট পেস্ট করুন।"]),
    faqs: [],
    related: ["case-converter"],
  },
  {
    id: "lowercase-converter", slug: "lowercase-converter", category: "text", icon: "Type",
    name: L("Lowercase Converter", "ছোট হাত কনভার্টার"),
    description: L("Convert text to lowercase.", "টেক্সট ছোট হাতে রূপান্তর করুন।"),
    inputSchema: [{ name: "text", label: L("Text", "টেক্সট"), type: "textarea", required: true }],
    run: (input) => ({ kind: "text", value: String(input.text || "").toLowerCase() }),
    seoTitle: L("Lowercase Converter", "ছোট হাত কনভার্টার"),
    seoDescription: L("Convert text to lowercase.", "টেক্সট ছোট হাতে রূপান্তর করুন।"),
    keywords: ["lowercase converter"],
    instructions: LI(["Paste text."], ["টেক্সট পেস্ট করুন।"]),
    faqs: [],
    related: ["case-converter"],
  },
  {
    id: "image-border-tool", slug: "image-border-tool", category: "image", icon: "Square",
    name: L("Image Border Tool", "ইমেজ বর্ডার টুল"),
    description: L("Add a border to an image.", "ছবিতে বর্ডার যোগ করুন।"),
    inputSchema: [
      { name: "file", label: L("Image", "ছবি"), type: "file", accept: "image/*", required: true },
      { name: "size", label: L("Border Size (px)", "বর্ডার সাইজ (px)"), type: "number", min: 1, max: 50, step: 1 },
      { name: "color", label: L("Border Color", "বর্ডার কালার"), type: "color" },
    ],
    run: async (input) => {
      const file = input.file as File;
      if (!file) return { kind: "text", value: "No file" };
      const img = await (async () => { const i = new Image(); const u = URL.createObjectURL(file); return new Promise<HTMLImageElement>((res) => { i.onload = () => { URL.revokeObjectURL(u); res(i); }; i.src = u; }); })();
      const b = Math.max(1, Number(input.size) || 4);
      const canvas = document.createElement("canvas");
      canvas.width = img.width + b * 2; canvas.height = img.height + b * 2;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = String(input.color || "#000000");
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, b, b);
      const du = await new Promise<string>((resolve) => { canvas.toBlob((blob) => { if (!blob) return resolve(""); const r = new FileReader(); r.onload = () => resolve(String(r.result)); r.readAsDataURL(blob); }, file.type || "image/png"); });
      return { kind: "image", value: du, filename: "bordered.png" };
    },
    seoTitle: L("Image Border Tool", "ইমেজ বর্ডার টুল"),
    seoDescription: L("Add border to images.", "ছবিতে বর্ডার যোগ করুন।"),
    keywords: ["image border tool"],
    instructions: LI(["Upload image, set border size and color."], ["ছবি আপলোড, বর্ডার সাইজ ও কালার সেট করুন।"]),
    faqs: [],
    related: ["image-resizer"],
  },
];

