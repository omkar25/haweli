import Link from "next/link";
import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/ScrollReveal";

export function MenuSection() {
  const t = useTranslations("Menu");
  return (
    <ScrollReveal>
      <section className="py-24 md:py-32" id="menu">
        <div className="mx-auto max-w-[1280px] px-5 md:px-16">
          <div className="mb-20 space-y-4 text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-gold">
              {t("tag")}
            </p>
            <h2 className="font-heading text-[32px] font-semibold leading-[1.3] md:text-[64px] md:font-bold md:leading-[1.1]">
              {t("title")}
            </h2>
            <div className="mx-auto h-px w-24 bg-gold" />
          </div>

          <div className="grid gap-x-20 gap-y-12 md:grid-cols-2">
            {/* Currys & Rice */}
            <div className="space-y-10">
              <h3 className="flex items-center gap-3 border-b border-outline-variant/30 pb-4 font-heading text-[24px] font-medium leading-[1.4]">
                <span className="text-gold">🍛</span>
                {t("currysTitle")}
              </h3>
              <div className="space-y-6">
                <MenuDotItem
                  name="Butter Chicken Thali"
                  price="10.00"
                  desc={t("butterChickenDesc")}
                />
                <MenuDotItem
                  name="Lamb Biryani"
                  price="11.50"
                  desc={t("lambBiryaniDesc")}
                />
                <MenuDotItem
                  name="Chicken Tikka Thali"
                  price="10.00"
                  desc={t("chickenTikkaDesc")}
                />
              </div>
            </div>

            {/* Vegetarisch & Vegan */}
            <div className="space-y-10">
              <h3 className="flex items-center gap-3 border-b border-outline-variant/30 pb-4 font-heading text-[24px] font-medium leading-[1.4]">
                <span className="text-gold">🌿</span>
                {t("vegTitle")}
              </h3>
              <div className="space-y-6">
                <MenuDotItem
                  name="Palak Paneer Thali"
                  price="10.00"
                  desc={t("palakPaneerDesc")}
                />
                <MenuDotItem
                  name="Vegetable Biryani"
                  price="7.50"
                  desc={t("vegBiryaniDesc")}
                />
                <MenuDotItem
                  name="Kadhi Chawal"
                  price="7.00"
                  desc={t("kadhiChawalDesc")}
                />
              </div>
            </div>
          </div>

          {/* Spice note + CTA */}
          <div className="mt-16 flex flex-col items-center justify-between gap-6 rounded-lg border border-gold/10 bg-surface-container p-8 md:flex-row">
            <div className="flex items-center gap-4">
              <span className="text-3xl text-saffron">🌶️</span>
              <p className="italic text-on-surface-variant">
                {t("spiceNote")}
              </p>
            </div>
            <Link
              href="/order"
              className="shrink-0 border-b border-gold py-2 text-[12px] font-semibold uppercase tracking-[0.15em] text-gold transition-all hover:text-brass"
            >
              {t("viewFull")}
            </Link>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}

function MenuDotItem({
  name,
  price,
  desc,
}: {
  name: string;
  price: string;
  desc: string;
}) {
  return (
    <div className="group cursor-default">
      <div className="mb-1 flex items-end justify-between">
        <h4 className="font-heading text-lg transition-colors group-hover:text-gold">
          {name}
        </h4>
        <div className="dot-leader" />
        <span className="text-gold">€{price}</span>
      </div>
      <p className="text-sm text-on-surface-variant/60">{desc}</p>
    </div>
  );
}
