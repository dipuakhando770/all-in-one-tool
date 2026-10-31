import type { ToolDefinition } from "@/lib/tools/types";
import type { Locale } from "@/lib/i18n";

const L = (en: string, bn: string): Record<Locale, string> => ({ en, bn });
const LI = (en: string[], bn: string[]): Record<Locale, string[]> => ({ en, bn });

export const moreTools: ToolDefinition[] = [
  {
    id: "csv-to-json", slug: "csv-to-json", category: "data", icon: "FileJson",
    name: L("CSV to JSON", "CSV টু JSON"),
    description: L("Convert CSV text to JSON array.", "CSV টেক্সটকে JSON অ্যারেতে রূপান্তর।"),
    inputSchema: [{ name: "text", label: L("CSV", "CSV"), type: "textarea", required: true }],
    run: (input) => {
      const lines = String(input.text || "").trim().split(/\n/).filter(Boolean);
      if (lines.length === 0) return { kind: "text", value: "[]" };
      const headers = lines[0].split(",").map((h) => h.trim());
      const rows = lines.slice(1).map((line) => {
        const cols = line.split(",");
        const obj: Record<string, string> = {};
        headers.forEach((h, i) => { obj[h] = (cols[i] || "").trim(); });
        return obj;
      });
      return { kind: "json", value: JSON.stringify(rows, null, 2) };
    },
    seoTitle: L("CSV to JSON", "CSV টু JSON"),
    seoDescription: L("Convert CSV to JSON.", "CSV কে JSON এ রূপান্তর।"),
    keywords: ["csv to json"],
    instructions: LI(["Paste CSV with header row."], ["হেডার সহ CSV পেস্ট করুন।"]),
    faqs: [], related: ["json-to-csv"],
  },
  {
    id: "url-parser", slug: "url-parser", category: "web", icon: "Link",
    name: L("URL Parser", "URL পার্সার"),
    description: L("Parse URL into components.", "URL কে উপাদানে ভাগ করুন।"),
    inputSchema: [{ name: "url", label: L("URL", "URL"), type: "text", required: true }],
    run: (input) => {
      try {
        const u = new URL(String(input.url));
        return { kind: "text", value: `Protocol: ${u.protocol}\nHost: ${u.hostname}\nPort: ${u.port}\nPath: ${u.pathname}\nQuery: ${u.search}\nHash: ${u.hash}` };
      } catch { return { kind: "text", value: "Invalid URL" }; }
    },
    seoTitle: L("URL Parser", "URL পার্সার"),
    seoDescription: L("Parse URLs.", "URL পার্স।"),
    keywords: ["url parser"],
    instructions: LI(["Enter a URL."], ["একটি URL দিন।"]),
    faqs: [], related: [],
  },
  {
    id: "html-entity-encoder", slug: "html-entity-encoder", category: "web", icon: "Code",
    name: L("HTML Entity Encoder", "HTML এনটিটি এনকোডার"),
    description: L("Encode/decode HTML entities.", "HTML এনটিটি এনকোড/ডিকোড।"),
    inputSchema: [
      { name: "text", label: L("Text", "টেক্সট"), type: "textarea", required: true },
      { name: "mode", label: L("Mode", "মোড"), type: "select", options: [
        { value: "encode", label: L("Encode", "এনকোড") }, { value: "decode", label: L("Decode", "ডিকোড") },
      ] },
    ],
    run: (input) => {
      const t = String(input.text || "");
      if (input.mode === "decode") {
        const el = document.createElement("textarea");
        el.innerHTML = t;
        return { kind: "text", value: el.value };
      }
      return { kind: "text", value: t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;") };
    },
    seoTitle: L("HTML Entity Encoder", "HTML এনটিটি এনকোডার"),
    seoDescription: L("Encode HTML entities.", "HTML এনটিটি এনকোড।"),
    keywords: ["html entity encoder"],
    instructions: LI(["Paste text and choose mode."], ["টেক্সট পেস্ট করে মোড বেছে নিন।"]),
    faqs: [], related: [],
  },
  {
    id: "mime-type-lookup", slug: "mime-type-lookup", category: "web", icon: "File",
    name: L("MIME Type Lookup", "MIME টাইপ লুকআপ"),
    description: L("Lookup MIME type by extension.", "এক্সটেনশন দিয়ে MIME টাইপ খুঁজুন।"),
    inputSchema: [{ name: "ext", label: L("Extension", "এক্সটেনশন"), type: "text", required: true }],
    run: (input) => {
      const map: Record<string, string> = { html: "text/html", css: "text/css", js: "application/javascript", json: "application/json", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif", svg: "image/svg+xml", pdf: "application/pdf", txt: "text/plain", csv: "text/csv", xml: "application/xml" };
      const ext = String(input.ext || "").toLowerCase().replace(/^\./, "");
      return { kind: "text", value: map[ext] || "Unknown" };
    },
    seoTitle: L("MIME Type Lookup", "MIME টাইপ লুকআপ"),
    seoDescription: L("Lookup MIME types.", "MIME টাইপ খুঁজুন।"),
    keywords: ["mime type lookup"],
    instructions: LI(["Enter file extension."], ["ফাইল এক্সটেনশন দিন।"]),
    faqs: [], related: [],
  },
  {
    id: "browser-info-viewer", slug: "browser-info-viewer", category: "web", icon: "Monitor",
    name: L("Browser Information Viewer", "ব্রাউজার ইনফো ভিউয়ার"),
    description: L("Show current browser info.", "বর্তমান ব্রাউজার তথ্য দেখান।"),
    inputSchema: [],
    run: () => {
      return { kind: "text", value: `User Agent: ${navigator.userAgent}\nLanguage: ${navigator.language}\nPlatform: ${navigator.platform}\nOnline: ${navigator.onLine}` };
    },
    seoTitle: L("Browser Information Viewer", "ব্রাউজার ইনফো ভিউয়ার"),
    seoDescription: L("View browser info.", "ব্রাউজার তথ্য দেখুন।"),
    keywords: ["browser info"],
    instructions: LI(["Click run."], ["রান ক্লিক করুন।"]),
    faqs: [], related: [],
  },
  {
    id: "file-size-converter", slug: "file-size-converter", category: "file", icon: "HardDrive",
    name: L("File Size Converter", "ফাইল সাইজ কনভার্টার"),
    description: L("Convert bytes to KB/MB/GB.", "বাইটকে KB/MB/GB এ রূপান্তর।"),
    inputSchema: [
      { name: "value", label: L("Value", "ভ্যালু"), type: "number", required: true },
      { name: "unit", label: L("Unit", "ইউনিট"), type: "select", options: [
        { value: "B", label: L("Bytes", "বাইট") }, { value: "KB", label: L("KB", "KB") },
        { value: "MB", label: L("MB", "MB") }, { value: "GB", label: L("GB", "GB") },
      ] },
    ],
    run: (input) => {
      const v = Number(input.value);
      const units = ["B", "KB", "MB", "GB", "TB"];
      const idx = units.indexOf(String(input.unit || "B"));
      const bytes = v * Math.pow(1024, idx);
      const lines = units.map((u, i) => `${(bytes / Math.pow(1024, i)).toFixed(4)} ${u}`);
      return { kind: "text", value: lines.join("\n") };
    },
    seoTitle: L("File Size Converter", "ফাইল সাইজ কনভার্টার"),
    seoDescription: L("Convert file sizes.", "ফাইল সাইজ রূপান্তর।"),
    keywords: ["file size converter"],
    instructions: LI(["Enter value and unit."], ["ভ্যালু ও ইউনিট দিন।"]),
    faqs: [], related: [],
  },
  {
    id: "file-extension-checker", slug: "file-extension-checker", category: "file", icon: "File",
    name: L("File Extension Checker", "ফাইল এক্সটেনশন চেকার"),
    description: L("Extract extension from filename.", "ফাইলনাম থেকে এক্সটেনশন বের করুন।"),
    inputSchema: [{ name: "filename", label: L("Filename", "ফাইলনাম"), type: "text", required: true }],
    run: (input) => {
      const name = String(input.filename || "");
      const ext = name.includes(".") ? name.split(".").pop() : "";
      return { kind: "text", value: ext ? `Extension: .${ext}` : "No extension" };
    },
    seoTitle: L("File Extension Checker", "ফাইল এক্সটেনশন চেকার"),
    seoDescription: L("Check file extension.", "ফাইল এক্সটেনশন চেক।"),
    keywords: ["file extension checker"],
    instructions: LI(["Enter filename."], ["ফাইলনাম দিন।"]),
    faqs: [], related: [],
  },
  {
    id: "line-break-remover", slug: "line-break-remover", category: "text", icon: "AlignLeft",
    name: L("Line Break Remover", "লাইন ব্রেক রিমুভার"),
    description: L("Remove line breaks from text.", "টেক্সট থেকে লাইন ব্রেক সরান।"),
    inputSchema: [{ name: "text", label: L("Text", "টেক্সট"), type: "textarea", required: true }],
    run: (input) => ({ kind: "text", value: String(input.text || "").replace(/\n+/g, " ") }),
    seoTitle: L("Line Break Remover", "লাইন ব্রেক রিমুভার"),
    seoDescription: L("Remove line breaks.", "লাইন ব্রেক সরান।"),
    keywords: ["line break remover"],
    instructions: LI(["Paste text."], ["টেক্সট পেস্ট করুন।"]),
    faqs: [], related: [],
  },
  {
    id: "duplicate-word-finder", slug: "duplicate-word-finder", category: "text", icon: "Search",
    name: L("Duplicate Word Finder", "ডুপ্লিকেট ওয়ার্ড ফাইন্ডার"),
    description: L("Find duplicate words in text.", "টেক্সটে ডুপ্লিকেট শব্দ খুঁজুন।"),
    inputSchema: [{ name: "text", label: L("Text", "টেক্সট"), type: "textarea", required: true }],
    run: (input) => {
      const words = String(input.text || "").toLowerCase().match(/\b\w+\b/g) || [];
      const counts: Record<string, number> = {};
      for (const w of words) counts[w] = (counts[w] || 0) + 1;
      const dups = Object.entries(counts).filter(([, c]) => c > 1).map(([w, c]) => `${w}: ${c}`);
      return { kind: "text", value: dups.length ? dups.join("\n") : "No duplicates" };
    },
    seoTitle: L("Duplicate Word Finder", "ডুপ্লিকেট ওয়ার্ড ফাইন্ডার"),
    seoDescription: L("Find duplicate words.", "ডুপ্লিকেট শব্দ খুঁজুন।"),
    keywords: ["duplicate word finder"],
    instructions: LI(["Paste text."], ["টেক্সট পেস্ট করুন।"]),
    faqs: [], related: [],
  },
  {
    id: "text-extractor", slug: "text-extractor", category: "text", icon: "FileText",
    name: L("Text Extractor", "টেক্সট এক্সট্র্যাক্টর"),
    description: L("Extract emails/URLs/numbers from text.", "টেক্সট থেকে ইমেইল/URL/নাম্বার বের করুন।"),
    inputSchema: [
      { name: "text", label: L("Text", "টেক্সট"), type: "textarea", required: true },
      { name: "type", label: L("Extract", "এক্সট্র্যাক্ট"), type: "select", options: [
        { value: "email", label: L("Emails", "ইমেইল") }, { value: "url", label: L("URLs", "URL") },
        { value: "number", label: L("Numbers", "নাম্বার") },
      ] },
    ],
    run: (input) => {
      const t = String(input.text || "");
      let m: string[] = [];
      if (input.type === "email") m = t.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
      else if (input.type === "url") m = t.match(/https?:\/\/[^\s]+/g) || [];
      else m = t.match(/\b\d+(\.\d+)?\b/g) || [];
      return { kind: "text", value: m.length ? m.join("\n") : "None found" };
    },
    seoTitle: L("Text Extractor", "টেক্সট এক্সট্র্যাক্টর"),
    seoDescription: L("Extract data from text.", "টেক্সট থেকে ডেটা বের করুন।"),
    keywords: ["text extractor"],
    instructions: LI(["Paste text and choose type."], ["টেক্সট পেস্ট করে টাইপ বেছে নিন।"]),
    faqs: [], related: [],
  },
  {
    id: "text-formatter", slug: "text-formatter", category: "text", icon: "AlignLeft",
    name: L("Text Formatter", "টেক্সট ফরম্যাটার"),
    description: L("Trim lines and remove blanks.", "লাইন ট্রিম ও খালি লাইন সরান।"),
    inputSchema: [{ name: "text", label: L("Text", "টেক্সট"), type: "textarea", required: true }],
    run: (input) => {
      const lines = String(input.text || "").split(/\n/).map((l) => l.trim()).filter(Boolean);
      return { kind: "text", value: lines.join("\n") };
    },
    seoTitle: L("Text Formatter", "টেক্সট ফরম্যাটার"),
    seoDescription: L("Format text.", "টেক্সট ফরম্যাট।"),
    keywords: ["text formatter"],
    instructions: LI(["Paste text."], ["টেক্সট পেস্ট করুন।"]),
    faqs: [], related: [],
  },
  {
    id: "remove-extra-line-breaks", slug: "remove-extra-line-breaks", category: "text", icon: "AlignLeft",
    name: L("Remove Extra Line Breaks", "অতিরিক্ত লাইন ব্রেক সরান"),
    description: L("Collapse multiple line breaks.", "একাধিক লাইন ব্রেক সংকুচিত করুন।"),
    inputSchema: [{ name: "text", label: L("Text", "টেক্সট"), type: "textarea", required: true }],
    run: (input) => ({ kind: "text", value: String(input.text || "").replace(/\n{3,}/g, "\n\n") }),
    seoTitle: L("Remove Extra Line Breaks", "অতিরিক্ত লাইন ব্রেক সরান"),
    seoDescription: L("Remove extra line breaks.", "অতিরিক্ত লাইন ব্রেক সরান।"),
    keywords: ["remove extra line breaks"],
    instructions: LI(["Paste text."], ["টেক্সট পেস্ট করুন।"]),
    faqs: [], related: [],
  },
  {
    id: "text-cleaner-extra", slug: "text-cleaner-extra", category: "text", icon: "Eraser",
    name: L("Advanced Text Cleaner", "অ্যাডভান্সড টেক্সট ক্লিনার"),
    description: L("Remove punctuation and normalize.", "পাংচুয়েশন সরান ও স্বাভাবিক করুন।"),
    inputSchema: [{ name: "text", label: L("Text", "টেক্সট"), type: "textarea", required: true }],
    run: (input) => ({ kind: "text", value: String(input.text || "").replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim() }),
    seoTitle: L("Advanced Text Cleaner", "অ্যাডভান্সড টেক্সট ক্লিনার"),
    seoDescription: L("Clean text advanced.", "টেক্সট অ্যাডভান্সড ক্লিন।"),
    keywords: ["advanced text cleaner"],
    instructions: LI(["Paste text."], ["টেক্সট পেস্ট করুন।"]),
    faqs: [], related: [],
  },
  {
    id: "json-minifier", slug: "json-minifier", category: "developer", icon: "Minimize2",
    name: L("JSON Minifier", "JSON মিনিফায়ার"),
    description: L("Minify JSON.", "JSON মিনিফাই।"),
    inputSchema: [{ name: "text", label: L("JSON", "JSON"), type: "textarea", required: true }],
    run: (input) => {
      try { return { kind: "text", value: JSON.stringify(JSON.parse(String(input.text))) }; }
      catch { return { kind: "text", value: "Invalid JSON" }; }
    },
    seoTitle: L("JSON Minifier", "JSON মিনিফায়ার"),
    seoDescription: L("Minify JSON.", "JSON মিনিফাই।"),
    keywords: ["json minifier"],
    instructions: LI(["Paste JSON."], ["JSON পেস্ট করুন।"]),
    faqs: [], related: ["json-formatter"],
  },
  {
    id: "xml-validator", slug: "xml-validator", category: "developer", icon: "CheckCircle",
    name: L("XML Validator", "XML ভ্যালিডেটর"),
    description: L("Validate XML well-formedness.", "XML সুগঠিত কিনা ভ্যালিডেট।"),
    inputSchema: [{ name: "text", label: L("XML", "XML"), type: "textarea", required: true }],
    run: (input) => {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(String(input.text), "application/xml");
        const err = doc.querySelector("parsererror");
        return { kind: "text", value: err ? "Invalid XML" : "Valid XML" };
      } catch { return { kind: "text", value: "Invalid XML" }; }
    },
    seoTitle: L("XML Validator", "XML ভ্যালিডেটর"),
    seoDescription: L("Validate XML.", "XML ভ্যালিডেট।"),
    keywords: ["xml validator"],
    instructions: LI(["Paste XML."], ["XML পেস্ট করুন।"]),
    faqs: [], related: ["xml-formatter"],
  },
  {
    id: "uuid-generator", slug: "uuid-generator", category: "developer", icon: "Key",
    name: L("UUID Generator", "UUID জেনারেটর"),
    description: L("Generate UUIDs.", "UUID তৈরি করুন।"),
    inputSchema: [{ name: "count", label: L("Count", "সংখ্যা"), type: "number", min: 1, max: 20 }],
    run: (input) => {
      const n = Math.max(1, Math.min(20, Number(input.count) || 1));
      const out: string[] = [];
      for (let i = 0; i < n; i++) out.push(crypto.randomUUID());
      return { kind: "text", value: out.join("\n") };
    },
    seoTitle: L("UUID Generator", "UUID জেনারেটর"),
    seoDescription: L("Generate UUID.", "UUID তৈরি।"),
    keywords: ["uuid generator"],
    instructions: LI(["Set count and run."], ["সংখ্যা সেট করে চালান।"]),
    faqs: [], related: [],
  },
  {
    id: "url-encoder", slug: "url-encoder", category: "developer", icon: "Link",
    name: L("URL Encoder/Decoder", "URL এনকোডার/ডিকোডার"),
    description: L("Encode or decode URL components.", "URL উপাদান এনকোড/ডিকোড।"),
    inputSchema: [
      { name: "text", label: L("Text", "টেক্সট"), type: "textarea", required: true },
      { name: "mode", label: L("Mode", "মোড"), type: "select", options: [
        { value: "encode", label: L("Encode", "এনকোড") }, { value: "decode", label: L("Decode", "ডিকোড") },
      ] },
    ],
    run: (input) => {
      const t = String(input.text || "");
      try {
        return { kind: "text", value: input.mode === "decode" ? decodeURIComponent(t) : encodeURIComponent(t) };
      } catch { return { kind: "text", value: "Error" }; }
    },
    seoTitle: L("URL Encoder/Decoder", "URL এনকোডার/ডিকোডার"),
    seoDescription: L("Encode/decode URLs.", "URL এনকোড/ডিকোড।"),
    keywords: ["url encoder"],
    instructions: LI(["Paste text and choose mode."], ["টেক্সট পেস্ট করে মোড বেছে নিন।"]),
    faqs: [], related: [],
  },
  {
    id: "regex-tester", slug: "regex-tester", category: "developer", icon: "Regex",
    name: L("Regex Tester", "রেজেক্স টেস্টার"),
    description: L("Test a regular expression.", "রেজুলার এক্সপ্রেশন টেস্ট।"),
    inputSchema: [
      { name: "pattern", label: L("Pattern", "প্যাটার্ন"), type: "text", required: true },
      { name: "text", label: L("Text", "টেক্সট"), type: "textarea", required: true },
      { name: "flags", label: L("Flags", "ফ্ল্যাগস"), type: "text" },
    ],
    run: (input) => {
      try {
        const re = new RegExp(String(input.pattern), String(input.flags || "g"));
        const matches = String(input.text || "").match(re);
        return { kind: "text", value: matches ? matches.join("\n") : "No matches" };
      } catch (e: any) { return { kind: "text", value: `Error: ${e.message}` }; }
    },
    seoTitle: L("Regex Tester", "রেজেক্স টেস্টার"),
    seoDescription: L("Test regex.", "রেজেক্স টেস্ট।"),
    keywords: ["regex tester"],
    instructions: LI(["Enter pattern, text, flags."], ["প্যাটার্ন, টেক্সট, ফ্ল্যাগস দিন।"]),
    faqs: [], related: [],
  },
  {
    id: "unix-timestamp-converter", slug: "unix-timestamp-converter", category: "developer", icon: "Clock",
    name: L("Unix Timestamp Converter", "ইউনিক্স টাইমস্ট্যাম্প কনভার্টার"),
    description: L("Convert Unix timestamp to date and back.", "ইউনিক্স টাইমস্ট্যাম্প ও তারিখ রূপান্তর।"),
    inputSchema: [{ name: "value", label: L("Timestamp or Date", "টাইমস্ট্যাম্প/তারিখ"), type: "text", required: true }],
    run: (input) => {
      const v = String(input.value || "").trim();
      if (/^\d+$/.test(v)) {
        const ms = v.length <= 10 ? Number(v) * 1000 : Number(v);
        return { kind: "text", value: new Date(ms).toString() };
      }
      const d = new Date(v);
      if (isNaN(d.getTime())) return { kind: "text", value: "Invalid" };
      return { kind: "text", value: `Seconds: ${Math.floor(d.getTime() / 1000)}\nMillis: ${d.getTime()}` };
    },
    seoTitle: L("Unix Timestamp Converter", "ইউনিক্স টাইমস্ট্যাম্প কনভার্টার"),
    seoDescription: L("Convert Unix timestamp.", "ইউনিক্স টাইমস্ট্যাম্প রূপান্তর।"),
    keywords: ["unix timestamp converter"],
    instructions: LI(["Enter timestamp or date."], ["টাইমস্ট্যাম্প বা তারিখ দিন।"]),
    faqs: [], related: [],
  },
  {
    id: "qr-code-generator", slug: "qr-code-generator", category: "developer", icon: "QrCode",
    name: L("QR Code Generator", "QR কোড জেনারেটর"),
    description: L("Generate a QR code image (via public API).", "QR কোড ইমেজ তৈরি (পাবলিক API)।"),
    inputSchema: [{ name: "text", label: L("Text/URL", "টেক্সট/URL"), type: "text", required: true }],
    run: (input) => {
      const t = encodeURIComponent(String(input.text || ""));
      return { kind: "image", value: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${t}`, filename: "qr.png" };
    },
    seoTitle: L("QR Code Generator", "QR কোড জেনারেটর"),
    seoDescription: L("Generate QR code.", "QR কোড তৈরি।"),
    keywords: ["qr code generator"],
    instructions: LI(["Enter text or URL."], ["টেক্সট বা URL দিন।"]),
    faqs: [], related: [],
  },
  {
    id: "http-status-code-reference", slug: "http-status-code-reference", category: "developer", icon: "Globe",
    name: L("HTTP Status Code Reference", "HTTP স্ট্যাটাস কোড রেফারেন্স"),
    description: L("Lookup HTTP status code meaning.", "HTTP স্ট্যাটাস কোড অর্থ খুঁজুন।"),
    inputSchema: [{ name: "code", label: L("Status Code", "স্ট্যাটাস কোড"), type: "number", required: true }],
    run: (input) => {
      const map: Record<number, string> = { 200: "OK", 201: "Created", 204: "No Content", 301: "Moved Permanently", 302: "Found", 304: "Not Modified", 400: "Bad Request", 401: "Unauthorized", 403: "Forbidden", 404: "Not Found", 405: "Method Not Allowed", 408: "Request Timeout", 429: "Too Many Requests", 500: "Internal Server Error", 502: "Bad Gateway", 503: "Service Unavailable" };
      const code = Number(input.code);
      return { kind: "text", value: map[code] || "Unknown" };
    },
    seoTitle: L("HTTP Status Code Reference", "HTTP স্ট্যাটাস কোড রেফারেন্স"),
    seoDescription: L("HTTP status codes.", "HTTP স্ট্যাটাস কোড।"),
    keywords: ["http status code"],
    instructions: LI(["Enter status code."], ["স্ট্যাটাস কোড দিন।"]),
    faqs: [], related: [],
  },
  {
    id: "markdown-editor", slug: "markdown-editor", category: "developer", icon: "FileText",
    name: L("Markdown Editor", "মার্কডাউন এডিটর"),
    description: L("Preview Markdown as HTML (basic).", "মার্কডাউন প্রিভিউ (বেসিক)।"),
    inputSchema: [{ name: "text", label: L("Markdown", "মার্কডাউন"), type: "textarea", required: true }],
    run: (input) => {
      const t = String(input.text || "");
      const html = t.replace(/^# (.*)/gm, "<h1>$1</h1>").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>");
      return { kind: "html", value: html };
    },
    seoTitle: L("Markdown Editor", "মার্কডাউন এডিটর"),
    seoDescription: L("Edit Markdown.", "মার্কডাউন এডিট।"),
    keywords: ["markdown editor"],
    instructions: LI(["Paste Markdown."], ["মার্কডাউন পেস্ট করুন।"]),
    faqs: [], related: ["markdown-preview"],
  },
  {
    id: "emi-calculator", slug: "emi-calculator", category: "calculator", icon: "Landmark",
    name: L("EMI Calculator", "EMI ক্যালকুলেটর"),
    description: L("Calculate monthly EMI.", "মাসিক EMI হিসাব।"),
    inputSchema: [
      { name: "principal", label: L("Principal", "মূল"), type: "number", required: true },
      { name: "rate", label: L("Annual Rate %", "বার্ষিক হার %"), type: "number", required: true },
      { name: "months", label: L("Months", "মাস"), type: "number", required: true },
    ],
    run: (input) => {
      const P = Number(input.principal), r = Number(input.rate) / 12 / 100, n = Number(input.months);
      const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      return { kind: "text", value: `EMI: ${emi.toFixed(2)}\nTotal: ${(emi * n).toFixed(2)}` };
    },
    seoTitle: L("EMI Calculator", "EMI ক্যালকুলেটর"),
    seoDescription: L("Calculate EMI.", "EMI হিসাব।"),
    keywords: ["emi calculator"],
    instructions: LI(["Enter principal, rate, months."], ["মূল, হার, মাস দিন।"]),
    faqs: [], related: ["loan-calculator"],
  },
  {
    id: "length-converter", slug: "length-converter", category: "calculator", icon: "Ruler",
    name: L("Length Converter", "লেংথ কনভার্টার"),
    description: L("Convert length units.", "লেংথ ইউনিট রূপান্তর।"),
    inputSchema: [
      { name: "value", label: L("Value", "ভ্যালু"), type: "number", required: true },
      { name: "from", label: L("From", "থেকে"), type: "select", options: [
        { value: "m", label: L("Meters", "মিটার") }, { value: "cm", label: L("CM", "সেমি") },
        { value: "km", label: L("KM", "কিমি") }, { value: "in", label: L("Inches", "ইঞ্চি") },
        { value: "ft", label: L("Feet", "ফুট") },
      ] },
    ],
    run: (input) => {
      const factors: Record<string, number> = { m: 1, cm: 0.01, km: 1000, in: 0.0254, ft: 0.3048 };
      const v = Number(input.value) * (factors[String(input.from)] || 1);
      return { kind: "text", value: Object.entries(factors).map(([u, f]) => `${(v / f).toFixed(6)} ${u}`).join("\n") };
    },
    seoTitle: L("Length Converter", "লেংথ কনভার্টার"),
    seoDescription: L("Convert length.", "লেংথ রূপান্তর।"),
    keywords: ["length converter"],
    instructions: LI(["Enter value and unit."], ["ভ্যালু ও ইউনিট দিন।"]),
    faqs: [], related: [],
  },
  {
    id: "weight-converter", slug: "weight-converter", category: "calculator", icon: "Scale",
    name: L("Weight Converter", "ওয়েট কনভার্টার"),
    description: L("Convert weight units.", "ওয়েট ইউনিট রূপান্তর।"),
    inputSchema: [
      { name: "value", label: L("Value", "ভ্যালু"), type: "number", required: true },
      { name: "from", label: L("From", "থেকে"), type: "select", options: [
        { value: "kg", label: L("KG", "কেজি") }, { value: "g", label: L("Grams", "গ্রাম") },
        { value: "lb", label: L("Pounds", "পাউন্ড") }, { value: "oz", label: L("Ounces", "আউন্স") },
      ] },
    ],
    run: (input) => {
      const factors: Record<string, number> = { kg: 1, g: 0.001, lb: 0.453592, oz: 0.0283495 };
      const v = Number(input.value) * (factors[String(input.from)] || 1);
      return { kind: "text", value: Object.entries(factors).map(([u, f]) => `${(v / f).toFixed(6)} ${u}`).join("\n") };
    },
    seoTitle: L("Weight Converter", "ওয়েট কনভার্টার"),
    seoDescription: L("Convert weight.", "ওয়েট রূপান্তর।"),
    keywords: ["weight converter"],
    instructions: LI(["Enter value and unit."], ["ভ্যালু ও ইউনিট দিন।"]),
    faqs: [], related: [],
  },
  {
    id: "temperature-converter", slug: "temperature-converter", category: "calculator", icon: "Thermometer",
    name: L("Temperature Converter", "টেম্পারেচার কনভার্টার"),
    description: L("Convert temperature units.", "টেম্পারেচার ইউনিট রূপান্তর।"),
    inputSchema: [
      { name: "value", label: L("Value", "ভ্যালু"), type: "number", required: true },
      { name: "from", label: L("From", "থেকে"), type: "select", options: [
        { value: "c", label: L("Celsius", "সেলসিয়াস") }, { value: "f", label: L("Fahrenheit", "ফারেনহাইট") },
        { value: "k", label: L("Kelvin", "কেলভিন") },
      ] },
    ],
    run: (input) => {
      const v = Number(input.value);
      const from = String(input.from);
      let c = v;
      if (from === "f") c = (v - 32) * 5 / 9;
      else if (from === "k") c = v - 273.15;
      const f = c * 9 / 5 + 32;
      const k = c + 273.15;
      return { kind: "text", value: `Celsius: ${c.toFixed(2)}\nFahrenheit: ${f.toFixed(2)}\nKelvin: ${k.toFixed(2)}` };
    },
    seoTitle: L("Temperature Converter", "টেম্পারেচার কনভার্টার"),
    seoDescription: L("Convert temperature.", "টেম্পারেচার রূপান্তর।"),
    keywords: ["temperature converter"],
    instructions: LI(["Enter value and unit."], ["ভ্যালু ও ইউনিট দিন।"]),
    faqs: [], related: [],
  },
  {
    id: "speed-converter", slug: "speed-converter", category: "calculator", icon: "Gauge",
    name: L("Speed Converter", "স্পিড কনভার্টার"),
    description: L("Convert speed units.", "স্পিড ইউনিট রূপান্তর।"),
    inputSchema: [
      { name: "value", label: L("Value", "ভ্যালু"), type: "number", required: true },
      { name: "from", label: L("From", "থেকে"), type: "select", options: [
        { value: "mps", label: L("m/s", "মি/সে") }, { value: "kmh", label: L("km/h", "কিমি/ঘ") },
        { value: "mph", label: L("mph", "মাইল/ঘ") },
      ] },
    ],
    run: (input) => {
      const factors: Record<string, number> = { mps: 1, kmh: 1000 / 3600, mph: 0.44704 };
      const v = Number(input.value) * (factors[String(input.from)] || 1);
      return { kind: "text", value: Object.entries(factors).map(([u, f]) => `${(v / f).toFixed(6)} ${u}`).join("\n") };
    },
    seoTitle: L("Speed Converter", "স্পিড কনভার্টার"),
    seoDescription: L("Convert speed.", "স্পিড রূপান্তর।"),
    keywords: ["speed converter"],
    instructions: LI(["Enter value and unit."], ["ভ্যালু ও ইউনিট দিন।"]),
    faqs: [], related: [],
  },
  {
    id: "data-storage-converter", slug: "data-storage-converter", category: "calculator", icon: "Database",
    name: L("Data Storage Converter", "ডেটা স্টোরেজ কনভার্টার"),
    description: L("Convert data storage units.", "ডেটা স্টোরেজ ইউনিট রূপান্তর।"),
    inputSchema: [
      { name: "value", label: L("Value", "ভ্যালু"), type: "number", required: true },
      { name: "from", label: L("From", "থেকে"), type: "select", options: [
        { value: "B", label: L("Bytes", "বাইট") }, { value: "KB", label: L("KB", "KB") },
        { value: "MB", label: L("MB", "MB") }, { value: "GB", label: L("GB", "GB") },
        { value: "TB", label: L("TB", "TB") },
      ] },
    ],
    run: (input) => {
      const factors: Record<string, number> = { B: 1, KB: 1024, MB: 1024 ** 2, GB: 1024 ** 3, TB: 1024 ** 4 };
      const v = Number(input.value) * (factors[String(input.from)] || 1);
      return { kind: "text", value: Object.entries(factors).map(([u, f]) => `${(v / f).toFixed(6)} ${u}`).join("\n") };
    },
    seoTitle: L("Data Storage Converter", "ডেটা স্টোরেজ কনভার্টার"),
    seoDescription: L("Convert data storage.", "ডেটা স্টোরেজ রূপান্তর।"),
    keywords: ["data storage converter"],
    instructions: LI(["Enter value and unit."], ["ভ্যালু ও ইউনিট দিন।"]),
    faqs: [], related: [],
  },
  {
    id: "sitemap-xml-generator", slug: "sitemap-xml-generator", category: "seo", icon: "FileCode",
    name: L("Sitemap XML Generator", "সাইটম্যাপ XML জেনারেটর"),
    description: L("Generate a simple sitemap XML.", "সাধারণ সাইটম্যাপ XML তৈরি।"),
    inputSchema: [{ name: "urls", label: L("URLs (one per line)", "URL (প্রতি লাইন)"), type: "textarea", required: true }],
    run: (input) => {
      const urls = String(input.text || input.urls || "").split(/\n/).map((u) => u.trim()).filter(Boolean);
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n")}\n</urlset>`;
      return { kind: "text", value: xml };
    },
    seoTitle: L("Sitemap XML Generator", "সাইটম্যাপ XML জেনারেটর"),
    seoDescription: L("Generate sitemap.", "সাইটম্যাপ তৈরি।"),
    keywords: ["sitemap xml generator"],
    instructions: LI(["One URL per line."], ["প্রতি লাইনে একটি URL।"]),
    faqs: [], related: [],
  },
  {
    id: "seo-text-analyzer", slug: "seo-text-analyzer", category: "seo", icon: "BarChart",
    name: L("SEO Text Analyzer", "SEO টেক্সট অ্যানালাইজার"),
    description: L("Analyze text word count and density.", "টেক্সট শব্দ সংখ্যা ও ঘনত্ব বিশ্লেষণ।"),
    inputSchema: [{ name: "text", label: L("Text", "টেক্সট"), type: "textarea", required: true }],
    run: (input) => {
      const t = String(input.text || "");
      const words = t.trim().split(/\s+/).filter(Boolean);
      const sentences = t.split(/[.!?]+/).filter(Boolean).length;
      return { kind: "text", value: `Words: ${words.length}\nCharacters: ${t.length}\nSentences: ${sentences}\nAvg word length: ${(words.join("").length / (words.length || 1)).toFixed(2)}` };
    },
    seoTitle: L("SEO Text Analyzer", "SEO টেক্সট অ্যানালাইজার"),
    seoDescription: L("Analyze SEO text.", "SEO টেক্সট বিশ্লেষণ।"),
    keywords: ["seo text analyzer"],
    instructions: LI(["Paste text."], ["টেক্সট পেস্ট করুন।"]),
    faqs: [], related: [],
  },
  {
    id: "url-inspection-helper", slug: "url-inspection-helper", category: "seo", icon: "Search",
    name: L("URL Inspection Helper", "URL ইন্সপেকশন হেল্পার"),
    description: L("Inspect URL structure.", "URL কাঠামো পরিদর্শন।"),
    inputSchema: [{ name: "url", label: L("URL", "URL"), type: "text", required: true }],
    run: (input) => {
      try {
        const u = new URL(String(input.url));
        return { kind: "text", value: `Host: ${u.hostname}\nPath: ${u.pathname}\nQuery params: ${u.searchParams.toString() || "none"}\nHTTPS: ${u.protocol === "https:"}` };
      } catch { return { kind: "text", value: "Invalid URL" }; }
    },
    seoTitle: L("URL Inspection Helper", "URL ইন্সপেকশন হেল্পার"),
    seoDescription: L("Inspect URLs.", "URL পরিদর্শন।"),
    keywords: ["url inspection helper"],
    instructions: LI(["Enter a URL."], ["একটি URL দিন।"]),
    faqs: [], related: [],
  },
  {
    id: "internal-link-analyzer", slug: "internal-link-analyzer", category: "seo", icon: "Link",
    name: L("Internal Link Analyzer", "ইন্টার্নাল লিংক অ্যানালাইজার"),
    description: L("Extract links from HTML.", "HTML থেকে লিংক বের করুন।"),
    inputSchema: [{ name: "html", label: L("HTML", "HTML"), type: "textarea", required: true }],
    run: (input) => {
      const doc = new DOMParser().parseFromString(String(input.html), "text/html");
      const links = Array.from(doc.querySelectorAll("a")).map((a) => a.getAttribute("href") || "");
      return { kind: "text", value: links.length ? links.join("\n") : "No links" };
    },
    seoTitle: L("Internal Link Analyzer", "ইন্টার্নাল লিংক অ্যানালাইজার"),
    seoDescription: L("Analyze internal links.", "ইন্টার্নাল লিংক বিশ্লেষণ।"),
    keywords: ["internal link analyzer"],
    instructions: LI(["Paste HTML."], ["HTML পেস্ট করুন।"]),
    faqs: [], related: [],
  },
  {
    id: "seo-content-preview", slug: "seo-content-preview", category: "seo", icon: "Eye",
    name: L("SEO Content Preview", "SEO কন্টেন্ট প্রিভিউ"),
    description: L("Preview title and description lengths.", "টাইটেল ও ডেসক্রিপশন দৈর্ঘ্য প্রিভিউ।"),
    inputSchema: [
      { name: "title", label: L("Title", "টাইটেল"), type: "text" },
      { name: "description", label: L("Description", "ডেসক্রিপশন"), type: "textarea" },
    ],
    run: (input) => {
      const t = String(input.title || ""), d = String(input.description || "");
      return { kind: "text", value: `Title: ${t.length}/60 ${t.length > 60 ? "(too long)" : "OK"}\nDescription: ${d.length}/160 ${d.length > 160 ? "(too long)" : "OK"}` };
    },
    seoTitle: L("SEO Content Preview", "SEO কন্টেন্ট প্রিভিউ"),
    seoDescription: L("Preview SEO content.", "SEO কন্টেন্ট প্রিভিউ।"),
    keywords: ["seo content preview"],
    instructions: LI(["Enter title and description."], ["টাইটেল ও ডেসক্রিপশন দিন।"]),
    faqs: [], related: [],
  },
  {
    id: "youtube-description-generator", slug: "youtube-description-generator", category: "social", icon: "Youtube",
    name: L("YouTube Description Generator", "ইউটিউব ডেসক্রিপশন জেনারেটর"),
    description: L("Generate a basic YouTube description.", "বেসিক ইউটিউব ডেসক্রিপশন তৈরি।"),
    inputSchema: [
      { name: "title", label: L("Title", "টাইটেল"), type: "text", required: true },
      { name: "keywords", label: L("Keywords", "কিওয়ার্ডস"), type: "text" },
    ],
    run: (input) => {
      const t = String(input.title || "");
      const k = String(input.keywords || "");
      return { kind: "text", value: `${t}\n\nIn this video: ${t}\n\nTags: ${k}\n\nSubscribe for more!` };
    },
    seoTitle: L("YouTube Description Generator", "ইউটিউব ডেসক্রিপশন জেনারেটর"),
    seoDescription: L("Generate YouTube description.", "ইউটিউব ডেসক্রিপশন তৈরি।"),
    keywords: ["youtube description generator"],
    instructions: LI(["Enter title and keywords."], ["টাইটেল ও কিওয়ার্ডস দিন।"]),
    faqs: [], related: [],
  },
  {
    id: "facebook-caption-generator", slug: "facebook-caption-generator", category: "social", icon: "Facebook",
    name: L("Facebook Caption Generator", "ফেসবুক ক্যাপশন জেনারেটর"),
    description: L("Generate a Facebook caption.", "ফেসবুক ক্যাপশন তৈরি।"),
    inputSchema: [{ name: "topic", label: L("Topic", "টপিক"), type: "text", required: true }],
    run: (input) => ({ kind: "text", value: `${input.topic}\n\nWhat do you think? Comment below! 👇` }),
    seoTitle: L("Facebook Caption Generator", "ফেসবুক ক্যাপশন জেনারেটর"),
    seoDescription: L("Generate Facebook caption.", "ফেসবুক ক্যাপশন তৈরি।"),
    keywords: ["facebook caption generator"],
    instructions: LI(["Enter topic."], ["টপিক দিন।"]),
    faqs: [], related: [],
  },
  {
    id: "social-media-caption-generator", slug: "social-media-caption-generator", category: "social", icon: "MessageCircle",
    name: L("Social Media Caption Generator", "সোশ্যাল মিডিয়া ক্যাপশন জেনারেটর"),
    description: L("Generate a social caption.", "সোশ্যাল ক্যাপশন তৈরি।"),
    inputSchema: [{ name: "topic", label: L("Topic", "টপিক"), type: "text", required: true }],
    run: (input) => ({ kind: "text", value: `${input.topic} ✨\n\n#social #content` }),
    seoTitle: L("Social Media Caption Generator", "সোশ্যাল মিডিয়া ক্যাপশন জেনারেটর"),
    seoDescription: L("Generate social caption.", "সোশ্যাল ক্যাপশন তৈরি।"),
    keywords: ["social media caption generator"],
    instructions: LI(["Enter topic."], ["টপিক দিন।"]),
    faqs: [], related: [],
  },
  {
    id: "thumbnail-size-guide", slug: "thumbnail-size-guide", category: "social", icon: "Image",
    name: L("Thumbnail Size Guide", "থাম্বনেইল সাইজ গাইড"),
    description: L("Show common thumbnail sizes.", "সাধারণ থাম্বনেইল সাইজ দেখান।"),
    inputSchema: [],
    run: () => ({ kind: "text", value: "YouTube: 1280x720\nInstagram: 1080x1080\nFacebook: 1200x630\nTwitter: 1200x675\nLinkedIn: 1200x627" }),
    seoTitle: L("Thumbnail Size Guide", "থাম্বনেইল সাইজ গাইড"),
    seoDescription: L("Thumbnail sizes.", "থাম্বনেইল সাইজ।"),
    keywords: ["thumbnail size guide"],
    instructions: LI(["Click run."], ["রান ক্লিক করুন।"]),
    faqs: [], related: [],
  },
  {
    id: "social-media-character-counter", slug: "social-media-character-counter", category: "social", icon: "Hash",
    name: L("Social Media Character Counter", "সোশ্যাল ক্যারেক্টার কাউন্টার"),
    description: L("Count chars with platform limits.", "প্ল্যাটফর্ম লিমিট সহ ক্যারেক্টার গণনা।"),
    inputSchema: [
      { name: "text", label: L("Text", "টেক্সট"), type: "textarea", required: true },
      { name: "platform", label: L("Platform", "প্ল্যাটফর্ম"), type: "select", options: [
        { value: "twitter", label: L("Twitter (280)", "টুইটার (280)") },
        { value: "instagram", label: L("Instagram (2200)", "ইনস্টাগ্রাম (2200)") },
      ] },
    ],
    run: (input) => {
      const t = String(input.text || "");
      const limit = input.platform === "instagram" ? 2200 : 280;
      return { kind: "text", value: `Characters: ${t.length}/${limit}\nRemaining: ${Math.max(0, limit - t.length)}` };
    },
    seoTitle: L("Social Media Character Counter", "সোশ্যাল ক্যারেক্টার কাউন্টার"),
    seoDescription: L("Count social chars.", "সোশ্যাল ক্যারেক্টার গণনা।"),
    keywords: ["social character counter"],
    instructions: LI(["Paste text."], ["টেক্সট পেস্ট করুন।"]),
    faqs: [], related: [],
  },
  {
    id: "utm-campaign-builder", slug: "utm-campaign-builder", category: "social", icon: "Link",
    name: L("UTM Campaign Builder", "UTM ক্যাম্পেইন বিল্ডার"),
    description: L("Build UTM tagged URL.", "UTM ট্যাগড URL তৈরি।"),
    inputSchema: [
      { name: "url", label: L("Base URL", "বেস URL"), type: "text", required: true },
      { name: "source", label: L("Source", "সোর্স"), type: "text" },
      { name: "medium", label: L("Medium", "মিডিয়াম"), type: "text" },
      { name: "campaign", label: L("Campaign", "ক্যাম্পেইন"), type: "text" },
    ],
    run: (input) => {
      const u = new URL(String(input.url));
      if (input.source) u.searchParams.set("utm_source", String(input.source));
      if (input.medium) u.searchParams.set("utm_medium", String(input.medium));
      if (input.campaign) u.searchParams.set("utm_campaign", String(input.campaign));
      return { kind: "text", value: u.toString() };
    },
    seoTitle: L("UTM Campaign Builder", "UTM ক্যাম্পেইন বিল্ডার"),
    seoDescription: L("Build UTM URLs.", "UTM URL তৈরি।"),
    keywords: ["utm campaign builder"],
    instructions: LI(["Enter URL and params."], ["URL ও প্যারাম দিন।"]),
    faqs: [], related: [],
  },
  {
    id: "social-post-formatter", slug: "social-post-formatter", category: "social", icon: "AlignLeft",
    name: L("Social Post Formatter", "সোশ্যাল পোস্ট ফরম্যাটার"),
    description: L("Format a social post.", "সোশ্যাল পোস্ট ফরম্যাট।"),
    inputSchema: [{ name: "text", label: L("Text", "টেক্সট"), type: "textarea", required: true }],
    run: (input) => ({ kind: "text", value: String(input.text || "").trim() + "\n\n#post" }),
    seoTitle: L("Social Post Formatter", "সোশ্যাল পোস্ট ফরম্যাটার"),
    seoDescription: L("Format social post.", "সোশ্যাল পোস্ট ফরম্যাট।"),
    keywords: ["social post formatter"],
    instructions: LI(["Paste text."], ["টেক্সট পেস্ট করুন।"]),
    faqs: [], related: [],
  },
  {
    id: "youtube-tags-helper", slug: "youtube-tags-helper", category: "social", icon: "Tag",
    name: L("YouTube Tags Helper", "ইউটিউব ট্যাগস হেল্পার"),
    description: L("Convert keywords to comma tags.", "কিওয়ার্ডসকে কমা ট্যাগে রূপান্তর।"),
    inputSchema: [{ name: "keywords", label: L("Keywords (one per line)", "কিওয়ার্ডস (প্রতি লাইন)"), type: "textarea", required: true }],
    run: (input) => ({ kind: "text", value: String(input.keywords || "").split(/\n/).map((k) => k.trim()).filter(Boolean).join(", ") }),
    seoTitle: L("YouTube Tags Helper", "ইউটিউব ট্যাগস হেল্পার"),
    seoDescription: L("YouTube tags.", "ইউটিউব ট্যাগস।"),
    keywords: ["youtube tags helper"],
    instructions: LI(["One keyword per line."], ["প্রতি লাইনে একটি কিওয়ার্ড।"]),
    faqs: [], related: [],
  },
  {
    id: "content-calendar-helper", slug: "content-calendar-helper", category: "social", icon: "Calendar",
    name: L("Content Calendar Helper", "কন্টেন্ট ক্যালেন্ডার হেল্পার"),
    description: L("Generate a weekly content plan.", "সাপ্তাহিক কন্টেন্ট প্ল্যান তৈরি।"),
    inputSchema: [{ name: "topic", label: L("Topic", "টপিক"), type: "text", required: true }],
    run: (input) => {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      return { kind: "text", value: days.map((d) => `${d}: ${input.topic} post`).join("\n") };
    },
    seoTitle: L("Content Calendar Helper", "কন্টেন্ট ক্যালেন্ডার হেল্পার"),
    seoDescription: L("Content calendar.", "কন্টেন্ট ক্যালেন্ডার।"),
    keywords: ["content calendar helper"],
    instructions: LI(["Enter topic."], ["টপিক দিন।"]),
    faqs: [], related: [],
  },
  {
    id: "social-media-text-formatter", slug: "social-media-text-formatter", category: "social", icon: "Type",
    name: L("Social Media Text Formatter", "সোশ্যাল টেক্সট ফরম্যাটার"),
    description: L("Format text for social media.", "সোশ্যাল মিডিয়ার জন্য টেক্সট ফরম্যাট।"),
    inputSchema: [{ name: "text", label: L("Text", "টেক্সট"), type: "textarea", required: true }],
    run: (input) => ({ kind: "text", value: String(input.text || "").trim().replace(/\n/g, " ") }),
    seoTitle: L("Social Media Text Formatter", "সোশ্যাল টেক্সট ফরম্যাটার"),
    seoDescription: L("Format social text.", "সোশ্যাল টেক্সট ফরম্যাট।"),
    keywords: ["social media text formatter"],
    instructions: LI(["Paste text."], ["টেক্সট পেস্ট করুন।"]),
    faqs: [], related: [],
  },
  {
    id: "http-header-viewer", slug: "http-header-viewer", category: "web", icon: "Globe",
    name: L("HTTP Header Viewer", "HTTP হেডার ভিউয়ার"),
    description: L("Show request headers (client).", "ক্লায়েন্ট রিকোয়েস্ট হেডার দেখান।"),
    inputSchema: [],
    run: () => ({ kind: "text", value: `User-Agent: ${navigator.userAgent}\nLanguage: ${navigator.language}` }),
    seoTitle: L("HTTP Header Viewer", "HTTP হেডার ভিউয়ার"),
    seoDescription: L("View HTTP headers.", "HTTP হেডার দেখুন।"),
    keywords: ["http header viewer"],
    instructions: LI(["Click run."], ["রান ক্লিক করুন।"]),
    faqs: [], related: [],
  },
  {
    id: "web-color-tester", slug: "web-color-tester", category: "web", icon: "Palette",
    name: L("Web Color Tester", "ওয়েব কালার টেস্টার"),
    description: L("Preview a color.", "একটি কালার প্রিভিউ।"),
    inputSchema: [{ name: "color", label: L("Color", "কালার"), type: "color", required: true }],
    run: (input) => ({ kind: "text", value: `Color: ${input.color}` }),
    seoTitle: L("Web Color Tester", "ওয়েব কালার টেস্টার"),
    seoDescription: L("Test web colors.", "ওয়েব কালার টেস্ট।"),
    keywords: ["web color tester"],
    instructions: LI(["Choose color."], ["কালার বেছে নিন।"]),
    faqs: [], related: [],
  },
  {
    id: "website-content-preview", slug: "website-content-preview", category: "web", icon: "Eye",
    name: L("Website Content Preview", "ওয়েবসাইট কন্টেন্ট প্রিভিউ"),
    description: L("Preview a URL in an iframe (may be blocked).", "URL iframe প্রিভিউ (ব্লক হতে পারে)।"),
    inputSchema: [{ name: "url", label: L("URL", "URL"), type: "text", required: true }],
    run: (input) => ({ kind: "html", value: `<iframe src="${input.url}" width="100%" height="400"></iframe>` }),
    seoTitle: L("Website Content Preview", "ওয়েবসাইট কন্টেন্ট প্রিভিউ"),
    seoDescription: L("Preview website.", "ওয়েবসাইট প্রিভিউ।"),
    keywords: ["website content preview"],
    instructions: LI(["Enter URL."], ["URL দিন।"]),
    faqs: [], related: [],
  },
  {
    id: "password-strength-checker", slug: "password-strength-checker", category: "developer", icon: "Shield",
    name: L("Password Strength Checker", "পাসওয়ার্ড স্ট্রেংথ চেকার"),
    description: L("Check password strength.", "পাসওয়ার্ড স্ট্রেংথ চেক।"),
    inputSchema: [{ name: "password", label: L("Password", "পাসওয়ার্ড"), type: "text", required: true }],
    run: (input) => {
      const p = String(input.password || "");
      let score = 0;
      if (p.length >= 8) score++;
      if (/[A-Z]/.test(p)) score++;
      if (/[a-z]/.test(p)) score++;
      if (/[0-9]/.test(p)) score++;
      if (/[^A-Za-z0-9]/.test(p)) score++;
      const levels = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"];
      return { kind: "text", value: `Score: ${score}/5\nStrength: ${levels[score]}` };
    },
    seoTitle: L("Password Strength Checker", "পাসওয়ার্ড স্ট্রেংথ চেকার"),
    seoDescription: L("Check password strength.", "পাসওয়ার্ড স্ট্রেংথ চেক।"),
    keywords: ["password strength checker"],
    instructions: LI(["Enter password."], ["পাসওয়ার্ড দিন।"]),
    faqs: [], related: ["password-generator"],
  },
];
