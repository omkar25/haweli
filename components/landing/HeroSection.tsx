import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

export function HeroSection() {
  const t = useTranslations("Hero");
  return (
    <header className="relative flex h-screen items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="hero-overlay absolute inset-0 z-10" />
        <Image
          src="/landing-banner.png"
          alt="Haweli Restaurant"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>
      <div className="relative z-20 mx-auto w-full max-w-[1280px] px-5 md:px-16">
        <div className="max-w-2xl space-y-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.3em] text-gold">
            {t("welcome")}
          </p>
          <h1 className="text-glow font-heading text-[40px] font-bold leading-tight md:text-[64px] md:leading-[1.1] md:tracking-[-0.02em]">
            {t("title")}
          </h1>
          <p className="border-l-2 border-gold pl-6 font-heading text-[24px] font-medium leading-[1.4] text-on-surface-variant">
            {t("subtitle")}
          </p>
          <div className="flex flex-col gap-4 pt-8 md:flex-row">
            <Link
              href="/order"
              className="brass-gradient rounded px-10 py-5 text-[12px] font-semibold uppercase tracking-[0.15em] text-on-primary transition-all hover:shadow-[0_0_20px_rgba(233,193,118,0.3)]"
            >
              {t("viewMenu")}
            </Link>
            <a
              href="#reservations"
              className="rounded border border-gold px-10 py-5 text-[12px] font-semibold uppercase tracking-[0.15em] text-gold transition-all hover:bg-gold/10"
            >
              {t("reserveTable")}
            </a>
          </div>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="h-6 w-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </header>
  );
}
