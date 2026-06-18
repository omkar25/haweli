import Image from "next/image";
import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/ScrollReveal";

export function AboutSection() {
  const t = useTranslations("About");
  return (
    <ScrollReveal>
      <section className="bg-surface-container-lowest py-24 md:py-32" id="about">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-12 px-5 md:grid-cols-2 md:gap-20 md:px-16">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="font-heading text-[32px] font-semibold leading-[1.3] text-gold">
                {t("tag")}
              </h2>
              <p className="text-[18px] leading-[1.6] text-on-surface-variant">
                {t("p1")}
              </p>
            </div>
            <p className="text-[16px] leading-[1.6] text-on-surface-variant/80">
              {t("p2")}
            </p>
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div>
                <span className="block font-heading text-[24px] font-medium text-gold">
                  {t("stat1Value")}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-on-surface-variant">
                  {t("stat1Label")}
                </span>
              </div>
              <div>
                <span className="block font-heading text-[24px] font-medium text-gold">
                  {t("stat2Value")}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-on-surface-variant">
                  {t("stat2Label")}
                </span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -left-4 -top-4 h-24 w-24 border-l-2 border-t-2 border-gold opacity-30" />
            <div className="absolute -bottom-4 -right-4 h-24 w-24 border-b-2 border-r-2 border-gold opacity-30" />
            <Image
              src="/landing-banner.png"
              alt="Restaurant Interior"
              width={600}
              height={450}
              className="rounded shadow-2xl grayscale-20 transition-all duration-700 hover:grayscale-0"
            />
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
