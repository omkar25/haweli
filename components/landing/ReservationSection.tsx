import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/ScrollReveal";

export function ReservationSection() {
  const t = useTranslations("Reservation");
  return (
    <ScrollReveal>
      <section className="py-24 md:py-32" id="reservations">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-start gap-16 px-5 md:grid-cols-2 md:px-16">
          <div className="space-y-10">
            <h2 className="font-heading text-[32px] font-semibold leading-[1.3] md:text-[64px] md:font-bold md:leading-[1.1]">
              {t("title")}
            </h2>
            <p className="text-[18px] leading-[1.6] text-on-surface-variant">
              {t("desc")}
            </p>
            <div className="space-y-6 pt-6">
              <div className="flex items-center gap-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10">
                  <span className="text-gold">📞</span>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-on-surface-variant/60">
                    {t("phoneLabel")}
                  </p>
                  <span className="font-heading text-xl transition-colors hover:text-gold">
                    +49 40 61193643
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10">
                  <span className="text-gold">📍</span>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-on-surface-variant/60">
                    {t("addressLabel")}
                  </p>
                  <p className="text-[16px]">{t("address")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reservation form */}
          <div className="rounded border border-gold/5 bg-surface-container p-10 shadow-xl">
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-semibold uppercase tracking-[0.15em] text-on-surface-variant">
                    {t("nameLabel")}
                  </label>
                  <input
                    className="w-full border-0 border-b border-outline bg-transparent px-0 py-2 text-on-surface transition-all placeholder:text-on-surface-variant/30 focus:border-gold focus:outline-none focus:ring-0"
                    placeholder={t("namePlaceholder")}
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-semibold uppercase tracking-[0.15em] text-on-surface-variant">
                    {t("guestsLabel")}
                  </label>
                  <input
                    className="w-full border-0 border-b border-outline bg-transparent px-0 py-2 text-on-surface focus:border-gold focus:outline-none focus:ring-0"
                    type="number"
                    defaultValue={2}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-semibold uppercase tracking-[0.15em] text-on-surface-variant">
                  {t("emailLabel")}
                </label>
                <input
                  className="w-full border-0 border-b border-outline bg-transparent px-0 py-2 text-on-surface placeholder:text-on-surface-variant/30 focus:border-gold focus:outline-none focus:ring-0"
                  placeholder="email@example.com"
                  type="email"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-semibold uppercase tracking-[0.15em] text-on-surface-variant">
                    {t("dateLabel")}
                  </label>
                  <input
                    className="w-full border-0 border-b border-outline bg-transparent px-0 py-2 text-on-surface-variant focus:border-gold focus:outline-none focus:ring-0"
                    type="date"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-semibold uppercase tracking-[0.15em] text-on-surface-variant">
                    {t("timeLabel")}
                  </label>
                  <input
                    className="w-full border-0 border-b border-outline bg-transparent px-0 py-2 text-on-surface-variant focus:border-gold focus:outline-none focus:ring-0"
                    type="time"
                  />
                </div>
              </div>
              <button
                className="brass-gradient mt-4 w-full py-4 text-[12px] font-semibold uppercase tracking-[0.15em] text-on-primary transition-all hover:brightness-110"
                type="submit"
              >
                {t("submit")}
              </button>
              <p className="text-center text-[10px] text-on-surface-variant/40">
                {t("privacy")}
              </p>
            </form>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
