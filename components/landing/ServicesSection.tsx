import Image from "next/image";
import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/ScrollReveal";

export function ServicesSection() {
  const t = useTranslations("Services");
  return (
    <ScrollReveal>
      <section className="bg-charcoal py-24 md:py-32">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-6 px-5 md:grid-cols-4 md:px-16">
          {/* Large card */}
          <div className="space-y-6 rounded border border-transparent bg-surface-container-high p-12 transition-all hover:border-gold/20 md:col-span-2">
            <span className="text-4xl text-gold">🍽️</span>
            <h3 className="font-heading text-[24px] font-medium leading-[1.4]">
              {t("aiTitle")}
            </h3>
            <p className="text-on-surface-variant">
              {t("aiDesc")}
            </p>
          </div>

          {/* Small cards */}
          <div className="flex flex-col items-center justify-center gap-4 rounded bg-surface-container-high p-8 text-center">
            <span className="text-3xl text-gold">🛵</span>
            <span className="text-[12px] font-semibold uppercase tracking-[0.15em]">
              {t("delivery")}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center gap-4 rounded bg-surface-container-high p-8 text-center">
            <span className="text-3xl text-gold">🌳</span>
            <span className="text-[12px] font-semibold uppercase tracking-[0.15em]">
              {t("outdoor")}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center gap-4 rounded bg-surface-container-high p-8 text-center">
            <span className="text-3xl text-gold">🎉</span>
            <span className="text-[12px] font-semibold uppercase tracking-[0.15em]">
              {t("events")}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center gap-4 rounded bg-surface-container-high p-8 text-center">
            <span className="text-3xl text-gold">📶</span>
            <span className="text-[12px] font-semibold uppercase tracking-[0.15em]">
              {t("wifi")}
            </span>
          </div>

          {/* Image card */}
          <div className="group relative min-h-[200px] overflow-hidden rounded md:col-span-2">
            <Image
              src="/landing-banner.png"
              alt="Traditional cooking"
              fill
              className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 flex items-end bg-linear-to-t from-surface to-transparent p-8">
              <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-gold">
                {t("traditional")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
