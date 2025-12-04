import "server-only";
import type { Locale } from "./i18n-config";
import { ja } from "./dictionaries/ja";
import { en } from "./dictionaries/en";

export type Dictionary = typeof ja;

const FALLBACK_LOCALE: Locale = "ja";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  ja: () => Promise.resolve(ja),
  en: () => Promise.resolve(en),
};

export const getDictionary = async (locale: Locale | string): Promise<Dictionary> => {
  // For now, adhere to whether or not to join the Locale union.
  const normalizedLocale = (Object.keys(dictionaries) as Locale[]).includes(locale as Locale)
    ? (locale as Locale)
    : FALLBACK_LOCALE;

  return dictionaries[normalizedLocale]();
};
