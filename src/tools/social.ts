import type { ToolDefinition } from "@/lib/tools/types";
import type { Locale } from "@/lib/i18n";

const L = (en: string, bn: string): Record<Locale, string> => ({ en, bn });
const LI = (en: string[], bn: string[]): Record<Locale, string[]> => ({ en, bn });

export const socialTools: ToolDefinition[] = [
  {
    id: "hashtag-generator", slug: "hashtag-generator", category: "social", icon: "Hash",
    name: L("Hashtag Generator", "হ্যাশট্যাগ জেনারেটর"),
    description: L("Generate hashtags from keywords.", "কিওয়ার্ড থেকে হ্যাশট্যাগ তৈরি।"),
    inputSchema: [{ name: "text", label: L("Keywords", "কিওয়ার্ড"), type: "text", required: true }],
    run: (input) => {
      const tags = String(input.text || "").split(/[\s,]+/).filter(Boolean).map((w) => "#" + w.replace(/[^a-zA-Z0-9]/g, ""));
      return { kind: "text", value: tags.join(" ") };
    },
    seoTitle: L("Hashtag Generator", "হ্যাশট্যাগ জেনারেটর"),
    seoDescription: L("Generate hashtags.", "হ্যাশট্যাগ তৈরি।"),
    keywords: ["hashtag generator"],
    instructions: LI(["Enter keywords."], ["কিওয়ার্ড লিখুন।"]),
    faqs: [],
    related: [],
  },
  {
    id: "bio-generator", slug: "bio-generator", category: "social", icon: "User",
    name: L("Bio Generator", "বায়ো জেনারেটর"),
    description: L("Generate a short bio from details.", "বিবরণ থেকে শর্ট বায়ো তৈরি।"),
    inputSchema: [
      { name: "name", label: L("Name", "নাম"), type: "text", required: true },
      { name: "role", label: L("Role", "পদ"), type: "text", required: true },
      { name: "interest", label: L("Interest", "আগ্রহ"), type: "text" },
    ],
    run: (input) => {
      const bio = `${input.name} | ${input.role}${input.interest ? " | " + input.interest : ""}`;
      return { kind: "text", value: bio };
    },
    seoTitle: L("Bio Generator", "বায়ো জেনারেটর"),
    seoDescription: L("Generate bio.", "বায়ো তৈরি।"),
    keywords: ["bio generator"],
    instructions: LI(["Enter details."], ["বিবরণ দিন।"]),
    faqs: [],
    related: [],
  },
  {
    id: "social-post-preview", slug: "social-post-preview", category: "social", icon: "Eye",
    name: L("Social Post Preview", "সোশ্যাল পোস্ট প্রিভিউ"),
    description: L("Preview a social post.", "সোশ্যাল পোস্ট প্রিভিউ।"),
    inputSchema: [
      { name: "title", label: L("Title", "শিরোনাম"), type: "text", required: true },
      { name: "description", label: L("Description", "বিবরণ"), type: "textarea" },
      { name: "url", label: L("URL", "URL"), type: "text" },
    ],
    run: (input) => {
      return { kind: "html", value: `<div style="border:1px solid #ccc;padding:12px;border-radius:8px;max-width:400px"><strong>${input.title}</strong><p>${input.description || ""}</p><small>${input.url || ""}</small></div>` };
    },
    seoTitle: L("Social Post Preview", "সোশ্যাল পোস্ট প্রিভিউ"),
    seoDescription: L("Preview social posts.", "সোশ্যাল পোস্ট প্রিভিউ।"),
    keywords: ["social preview"],
    instructions: LI(["Enter title, description, url."], ["শিরোনাম, বিবরণ, URL দিন।"]),
    faqs: [],
    related: [],
  },
  {
    id: "thumbnail-dimension-guide", slug: "thumbnail-dimension-guide", category: "social", icon: "Image",
    name: L("Thumbnail Dimension Guide", "থাম্বনেইল ডাইমেনশন গাইড"),
    description: L("Common thumbnail dimensions.", "সাধারণ থাম্বনেইল মাপ।"),
    inputSchema: [{ name: "platform", label: L("Platform", "প্ল্যাটফর্ম"), type: "select", options: [
      { value: "youtube", label: L("YouTube", "YouTube") },
      { value: "facebook", label: L("Facebook", "Facebook") },
      { value: "instagram", label: L("Instagram", "Instagram") },
      { value: "twitter", label: L("Twitter", "Twitter") },
    ] }],
    run: (input) => {
      const dims: Record<string, string> = { youtube: "1280 x 720 (16:9)", facebook: "1200 x 630", instagram: "1080 x 1080", twitter: "1200 x 675" };
      return { kind: "text", value: dims[input.platform] || "Unknown" };
    },
    seoTitle: L("Thumbnail Dimension Guide", "থাম্বনেইল ডাইমেনশন গাইড"),
    seoDescription: L("Thumbnail sizes.", "থাম্বনেইল মাপ।"),
    keywords: ["thumbnail dimensions"],
    instructions: LI(["Choose platform."], ["প্ল্যাটফর্ম বেছে নিন।"]),
    faqs: [],
    related: [],
  },
];
