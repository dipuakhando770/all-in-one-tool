import "server-only";
import type { Locale } from "@/lib/i18n";

const dictionaries = {
  en: () => import("@/messages/en.json").then((m) => m.default),
  bn: () => import("@/messages/bn.json").then((m) => m.default),
};

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]();
}
