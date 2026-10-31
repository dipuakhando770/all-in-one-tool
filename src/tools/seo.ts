import type { ToolDefinition } from "@/lib/tools/types";
import type { Locale } from "@/lib/i18n";

const L = (en: string, bn: string): Record<Locale, string> => ({ en, bn });
const LI = (en: string[], bn: string[]): Record<Locale, string[]> => ({ en, bn });

export const seoTools: ToolDefinition[] = [
  {
    id: "meta-tag-generator", slug: "meta-tag-generator", category: "seo", icon: "Tags",
    name: L("Meta Tag Generator", "মেটা ট্যাগ জেনারেটর"),
    description: L("Generate HTML meta tags.", "HTML মেটা ট্যাগ তৈরি।"),
    inputSchema: [
      { name: "title", label: L("Title", "শিরোনাম"), type: "text", required: true },
      { name: "description", label: L("Description", "বিবরণ"), type: "textarea", required: true },
      { name: "keywords", label: L("Keywords", "কিওয়ার্ড"), type: "text" },
    ],
    run: (input) => {
      const tags = `<title>${input.title}</title>\n<meta name="description" content="${input.description}">\n<meta name="keywords" content="${input.keywords || ""}">`;
      return { kind: "text", value: tags };
    },
    seoTitle: L("Meta Tag Generator", "মেটা ট্যাগ জেনারেটর"),
    seoDescription: L("Generate meta tags.", "মেটা ট্যাগ তৈরি।"),
    keywords: ["meta tag generator"],
    instructions: LI(["Enter title and description."], ["শিরোনাম ও বিবরণ দিন।"]),
    faqs: [],
    related: [],
  },
  {
    id: "robots-txt-generator", slug: "robots-txt-generator", category: "seo", icon: "FileCode",
    name: L("Robots.txt Generator", "Robots.txt জেনারেটর"),
    description: L("Generate robots.txt content.", "robots.txt কন্টেন্ট তৈরি।"),
    inputSchema: [
      { name: "allowAll", label: L("Allow all crawlers", "সব ক্রলার অনুমতি"), type: "checkbox" },
      { name: "sitemap", label: L("Sitemap URL", "সাইটম্যাপ URL"), type: "text" },
    ],
    run: (input) => {
      let out = input.allowAll ? "User-agent: *\nDisallow:" : "User-agent: *\nDisallow: /admin/";
      if (input.sitemap) out += `\nSitemap: ${input.sitemap}`;
      return { kind: "text", value: out };
    },
    seoTitle: L("Robots.txt Generator", "Robots.txt জেনারেটর"),
    seoDescription: L("Generate robots.txt.", "robots.txt তৈরি।"),
    keywords: ["robots txt generator"],
    instructions: LI(["Configure and run."], ["কনফিগার করে চালান।"]),
    faqs: [],
    related: [],
  },
  {
    id: "url-slug-generator", slug: "url-slug-generator", category: "seo", icon: "Link",
    name: L("URL Slug Generator", "URL স্লাগ জেনারেটর"),
    description: L("Create URL-friendly slugs.", "URL-বান্ধব স্লাগ তৈরি।"),
    inputSchema: [{ name: "text", label: L("Text", "টেক্সট"), type: "text", required: true }],
    run: (input) => {
      const slug = String(input.text || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      return { kind: "text", value: slug };
    },
    seoTitle: L("URL Slug Generator", "URL স্লাগ জেনারেটর"),
    seoDescription: L("Generate URL slugs.", "URL স্লাগ তৈরি।"),
    keywords: ["slug generator"],
    instructions: LI(["Enter text."], ["টেক্সট লিখুন।"]),
    faqs: [],
    related: ["text-to-slug"],
  },
  {
    id: "utm-builder", slug: "utm-builder", category: "seo", icon: "MousePointerClick",
    name: L("UTM Builder", "UTM বিল্ডার"),
    description: L("Build UTM tracking URLs.", "UTM ট্র্যাকিং URL তৈরি।"),
    inputSchema: [
      { name: "url", label: L("URL", "URL"), type: "text", required: true },
      { name: "source", label: L("Source", "সোর্স"), type: "text", required: true },
      { name: "medium", label: L("Medium", "মিডিয়াম"), type: "text", required: true },
      { name: "campaign", label: L("Campaign", "ক্যাম্পেইন"), type: "text", required: true },
    ],
    run: (input) => {
      try {
        const u = new URL(String(input.url));
        u.searchParams.set("utm_source", String(input.source));
        u.searchParams.set("utm_medium", String(input.medium));
        u.searchParams.set("utm_campaign", String(input.campaign));
        return { kind: "text", value: u.toString() };
      } catch {
        return { kind: "text", value: "Invalid URL" };
      }
    },
    seoTitle: L("UTM Builder", "UTM বিল্ডার"),
    seoDescription: L("Build UTM URLs.", "UTM URL তৈরি।"),
    keywords: ["utm builder"],
    instructions: LI(["Enter URL and params."], ["URL ও প্যারাম দিন।"]),
    faqs: [],
    related: [],
  },
  {
    id: "canonical-url-generator", slug: "canonical-url-generator", category: "seo", icon: "Link",
    name: L("Canonical URL Generator", "ক্যানোনিকাল URL জেনারেটর"),
    description: L("Generate canonical link tag.", "ক্যানোনিকাল লিংক ট্যাগ তৈরি।"),
    inputSchema: [{ name: "url", label: L("URL", "URL"), type: "text", required: true }],
    run: (input) => ({ kind: "text", value: `<link rel="canonical" href="${input.url}">` }),
    seoTitle: L("Canonical URL Generator", "ক্যানোনিকাল URL জেনারেটর"),
    seoDescription: L("Generate canonical tag.", "ক্যানোনিকাল ট্যাগ তৈরি।"),
    keywords: ["canonical url"],
    instructions: LI(["Enter URL."], ["URL লিখুন।"]),
    faqs: [],
    related: [],
  },
];
