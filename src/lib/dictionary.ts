import "server-only";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/i18n";

const dictionaries = {
  en: () => import("@/messages/en.json") as Promise<{ default: Dictionary }>,
  bn: () => import("@/messages/bn.json") as Promise<{ default: Dictionary }>,
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]().then((m) => m.default);
}
