import type { Metadata } from "next";
import { locales, type Locale } from "@/lib/i18n";

export const SITE_URL = "https://tools.nasirdigitalhub.com";
export const SITE_NAME = "Nasir Tools";

/**
 * Build canonical + hreflang alternates for a localized route.
 * `path` is the path *after* the locale segment, e.g. "/tools/json-formatter".
 */
export function pageAlternates(locale: Locale, path = ""): Metadata["alternates"] {
  const clean = path === "/" ? "" : path.replace(/\/+$/, "");
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = `${SITE_URL}/${l}${clean}`;
  }
  languages["x-default"] = `${SITE_URL}/en${clean}`;

  return {
    canonical: `${SITE_URL}/${locale}${clean}`,
    languages,
  };
}

/** Locale-aware Open Graph block used by inner pages. */
export function pageOpenGraph({
  locale,
  path = "",
  title,
  description,
  type = "website",
}: {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
  type?: "website" | "article";
}): NonNullable<Metadata["openGraph"]> {
  const clean = path === "/" ? "" : path.replace(/\/+$/, "");
  return {
    type,
    title,
    description,
    url: `${SITE_URL}/${locale}${clean}`,
    siteName: SITE_NAME,
    locale: locale === "bn" ? "bn_BD" : "en_US",
  };
}

/** Bidirectional label helper for inline bilingual copy. */
export function pick(locale: Locale, en: string, bn: string): string {
  return locale === "bn" ? bn : en;
}
