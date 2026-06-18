"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { useCurrency, CURRENCIES, CurrencyCode } from "@/lib/currency-context";

const LANGUAGES: Record<string, { name: string; flag: string }> = {
  en: { name: "English", flag: "\uD83C\uDDEC\uD83C\uDDE7" },
  de: { name: "Deutsch", flag: "\uD83C\uDDE9\uD83C\uDDEA" },
  hi: { name: "\u0939\u093F\u0928\u094D\u0926\u0940", flag: "\uD83C\uDDEE\uD83C\uDDF3" },
};

export function LocaleSelector() {
  const locale = useLocale();
  const t = useTranslations("Common");
  const { currency, setCurrency } = useCurrency();
  const [, startTransition] = useTransition();

  function handleLocaleChange(newLocale: string) {
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`;
    startTransition(() => {
      window.location.reload();
    });
  }

  return (
    <div className="flex items-center gap-3">
      {/* Language Selector */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-gray-500">{t("language")}:</span>
        <select
          value={locale}
          onChange={(e) => handleLocaleChange(e.target.value)}
          className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {Object.entries(LANGUAGES).map(([code, { name, flag }]) => (
            <option key={code} value={code}>
              {flag} {name}
            </option>
          ))}
        </select>
      </div>

      {/* Currency Selector */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-gray-500">{t("currency")}:</span>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
          className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {Object.entries(CURRENCIES).map(([code, { symbol, name, flag }]) => (
            <option key={code} value={code}>
              {flag} {symbol} {name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
