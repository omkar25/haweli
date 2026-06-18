"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useTransition } from "react";
import { Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

function setLocaleCookie(newLocale: string) {
  document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`;
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useTranslations("Header");
  const locale = useLocale();
  const [, startTransition] = useTransition();

  function switchLocale(newLocale: string) {
    if (newLocale === locale) return;
    setLocaleCookie(newLocale);
    startTransition(() => window.location.reload());
  }

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-gold/10"
      style={{ backgroundColor: "#1f2731" }}
    >
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 py-3 lg:px-20">
        <Link href="/" className="relative flex items-center">
          <Image
            src="/logo_haweli.png"
            alt="Haweli Indian Cuisine"
            width={400}
            height={160}
            className="h-12 w-auto scale-[1.4] object-contain mix-blend-lighten"
            priority
          />
        </Link>

        {/* Right side: nav + language + order */}
        <div className="flex items-center gap-8">
          {/* Desktop nav */}
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#menu"
              className="text-[12px] font-semibold uppercase tracking-[0.15em] text-on-surface-variant transition-colors hover:text-gold"
            >
              {t("menu")}
            </a>
            <a
              href="#reservations"
              className="text-[12px] font-semibold uppercase tracking-[0.15em] text-on-surface-variant transition-colors hover:text-gold"
            >
              {t("reservations")}
            </a>
            <a
              href="#about"
              className="text-[12px] font-semibold uppercase tracking-[0.15em] text-on-surface-variant transition-colors hover:text-gold"
            >
              {t("about")}
            </a>
            <a
              href="#contact"
              className="text-[12px] font-semibold uppercase tracking-[0.15em] text-on-surface-variant transition-colors hover:text-gold"
            >
              {t("contact")}
            </a>
          </div>

          {/* Language switcher */}
          <div className="flex items-center rounded-md border border-gold/20 p-0.5">
            {([
              { code: "de", flag: "🇩🇪" },
              { code: "en", flag: "🇬🇧" },
            ] as const).map(({ code, flag }) => (
              <button
                key={code}
                onClick={() => switchLocale(code)}
                className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest transition-colors ${
                  locale === code
                    ? "bg-gold text-on-primary"
                    : "text-on-surface-variant hover:text-gold"
                }`}
              >
                <span className="text-sm leading-none">{flag}</span>
                {code}
              </button>
            ))}
          </div>

          <Link
            href="/order"
            className="hidden rounded-lg bg-primary-container px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.15em] text-on-primary-container transition-all hover:bg-brass active:scale-95 md:inline-flex"
          >
            {t("orderNow")}
          </Link>

          {/* Mobile toggle */}
          <button
            className="text-on-surface-variant md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t border-outline-variant/20 bg-surface-container px-6 py-6 md:hidden">
          <div className="flex flex-col gap-4">
            <a
              href="#menu"
              className="text-[12px] font-semibold uppercase tracking-[0.15em] text-on-surface-variant"
              onClick={() => setMobileOpen(false)}
            >
              {t("menu")}
            </a>
            <a
              href="#reservations"
              className="text-[12px] font-semibold uppercase tracking-[0.15em] text-on-surface-variant"
              onClick={() => setMobileOpen(false)}
            >
              {t("reservations")}
            </a>
            <a
              href="#about"
              className="text-[12px] font-semibold uppercase tracking-[0.15em] text-on-surface-variant"
              onClick={() => setMobileOpen(false)}
            >
              {t("about")}
            </a>
            <a
              href="#contact"
              className="text-[12px] font-semibold uppercase tracking-[0.15em] text-on-surface-variant"
              onClick={() => setMobileOpen(false)}
            >
              {t("contact")}
            </a>
            <Link
              href="/order"
              className="brass-gradient mt-2 rounded-lg py-3 text-center text-[12px] font-semibold uppercase tracking-[0.15em] text-on-primary"
              onClick={() => setMobileOpen(false)}
            >
              {t("orderNow")}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
