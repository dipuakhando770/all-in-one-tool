export const locales = ["en", "bn"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  bn: "বাংলা",
};

export function isLocale(v: string): v is Locale {
  return locales.includes(v as Locale);
}

export function withLocale(locale: Locale, path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${p === "/" ? "" : p}`;
}

// Dictionary shape (English + Bengali message files share this shape).
export interface Dictionary {
  nav: {
    home: string;
    allTools: string;
    categories: string;
    popular: string;
    newTools: string;
    blog: string;
    search: string;
    language: string;
    theme: string;
    account: string;
    login: string;
    register: string;
    dashboard: string;
    admin: string;
  };
  hero: {
    title: string;
    description: string;
    explore: string;
    popular: string;
    searchPlaceholder: string;
  };
  sections: {
    popularTools: string;
    browseCategories: string;
    recentlyAdded: string;
    recommended: string;
    why: string;
    howItWorks: string;
    guides: string;
    faq: string;
  };
  footer: {
    about: string;
    allTools: string;
    popularTools: string;
    categories: string;
    blog: string;
    contact: string;
    privacy: string;
    terms: string;
    disclaimer: string;
    tagline: string;
  };
  common: {
    run: string;
    reset: string;
    copy: string;
    copied: string;
    download: string;
    loading: string;
    error: string;
    noResults: string;
    instructions: string;
    faqs: string;
    relatedTools: string;
  };
  how: Array<{ title: string; desc: string }>;
}
