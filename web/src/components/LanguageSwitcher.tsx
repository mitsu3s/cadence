"use client";

import { usePathname, useRouter } from "next/navigation";
import { i18n, Locale } from "@/i18n-config";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const redirectedPathName = (locale: Locale) => {
    if (!pathname) return "/";
    const segments = pathname.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  const currentLocale = pathname?.split("/")[1] as Locale || i18n.defaultLocale;

  return (
    <div className="flex items-center gap-1 bg-zinc-900 rounded-lg p-1 border border-zinc-800 w-full">
      {i18n.locales.map((locale) => (
        <button
          key={locale}
          onClick={() => router.push(redirectedPathName(locale))}
          className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-colors text-center ${
            currentLocale === locale
              ? "bg-zinc-800 text-white shadow-sm"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          {locale === "ja" ? "日本語" : "English"}
        </button>
      ))}
    </div>
  );
}
