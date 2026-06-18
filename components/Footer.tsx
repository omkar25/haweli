import Link from "next/link";
import { Send } from "lucide-react";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("Footer");
  return (
    <footer className="border-t border-outline-variant/20 bg-surface-container-lowest py-16">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-6 px-6 text-center md:grid-cols-3 md:text-left lg:px-16">
        <div className="space-y-4">
          <span className="font-heading text-[24px] font-medium leading-[1.4] text-gold">
            HAWELI
          </span>
          <p className="text-[16px] leading-[1.6] text-on-surface-variant/80">
            {t("desc")}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Link href="/order" className="text-on-surface-variant transition-colors hover:text-gold">
            {t("menu")}
          </Link>
          <Link href="/dashboard" className="text-on-surface-variant transition-colors hover:text-gold">
            {t("dashboard")}
          </Link>
          <a href="#about" className="text-on-surface-variant transition-colors hover:text-gold">
            {t("about")}
          </a>
          <a href="#reservations" className="text-on-surface-variant transition-colors hover:text-gold">
            {t("reservations")}
          </a>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-on-surface-variant/60">
            {t("newsletter")}
          </p>
          <div className="flex gap-2">
            <input
              className="w-full rounded border border-outline/20 bg-surface-container px-4 py-2 text-sm text-on-surface focus:border-gold focus:outline-none focus:ring-0"
              placeholder={t("emailPlaceholder")}
              type="email"
            />
            <button className="rounded bg-gold p-2 text-on-primary transition hover:bg-brass">
              <Send className="h-4 w-4" />
            </button>
          </div>
          <div className="flex justify-center gap-6 pt-2 md:justify-start">
            <p className="text-sm text-on-surface-variant/60">{t("hours")}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-[1280px] border-t border-outline-variant/10 px-6 pt-8 text-center lg:px-16">
        <p className="text-[16px] text-on-surface-variant/40">
          {t("rights")}
        </p>
      </div>
    </footer>
  );
}
