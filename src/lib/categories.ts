import type { Locale } from "@/lib/i18n";

export type Category = {
  slug: string;
  icon: string;
  name: Record<Locale, string>;
  description: Record<Locale, string>;
  color: string;
};

export const categories: Category[] = [
  { slug: "image", icon: "Image", name: { en: "Image Tools", bn: "ইমেজ টুলস" }, description: { en: "Compress, resize, convert and edit images.", bn: "ছবি কম্প্রেস, রিসাইজ, কনভার্ট ও এডিট।" }, color: "from-pink-500 to-rose-500" },
  { slug: "pdf", icon: "FileText", name: { en: "PDF Tools", bn: "PDF টুলস" }, description: { en: "Merge, split and manage PDF files.", bn: "PDF ফাইল মার্জ, স্প্লিট ও ম্যানেজ।" }, color: "from-red-500 to-orange-500" },
  { slug: "seo", icon: "Search", name: { en: "SEO Tools", bn: "SEO টুলস" }, description: { en: "Meta tags, sitemaps and SEO helpers.", bn: "মেটা ট্যাগ, সাইটম্যাপ ও SEO সহায়ক।" }, color: "from-blue-500 to-cyan-500" },
  { slug: "developer", icon: "Code", name: { en: "Developer Tools", bn: "ডেভেলপার টুলস" }, description: { en: "Format, validate and convert code.", bn: "কোড ফরম্যাট, ভ্যালিডেট ও কনভার্ট।" }, color: "from-violet-500 to-purple-500" },
  { slug: "calculator", icon: "Calculator", name: { en: "Calculators", bn: "ক্যালকুলেটর" }, description: { en: "Age, loan, percentage and more.", bn: "বয়স, লোন, শতকরা ও আরও।" }, color: "from-emerald-500 to-teal-500" },
  { slug: "text", icon: "Type", name: { en: "Text Tools", bn: "টেক্সট টুলস" }, description: { en: "Count, convert and clean text.", bn: "টেক্সট গণনা, কনভার্ট ও পরিষ্কার।" }, color: "from-amber-500 to-yellow-500" },
  { slug: "social", icon: "Share2", name: { en: "Social Media Tools", bn: "সোশ্যাল মিডিয়া টুলস" }, description: { en: "Captions, hashtags and previews.", bn: "ক্যাপশন, হ্যাশট্যাগ ও প্রিভিউ।" }, color: "from-sky-500 to-indigo-500" },
  { slug: "ai", icon: "Sparkles", name: { en: "AI Tools", bn: "AI টুলস" }, description: { en: "AI-assisted writing helpers.", bn: "AI-সহায়তা লেখার টুল।" }, color: "from-fuchsia-500 to-pink-500" },
];
