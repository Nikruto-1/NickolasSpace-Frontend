import { ASSETS } from "../constants.js";
import useLanguage from "../i18n/useLanguage.js";
import ContactButton from "./contact/ContactButton.jsx";

export default function FounderSection() {
  const { t } = useLanguage();

  return (
    <section id="founder" className="bg-paper text-ink">
      <div className="mx-auto grid max-w-[1400px] items-center gap-14 px-6 py-28 md:px-12 md:py-40 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <div className="overflow-hidden">
            <img
              src={ASSETS.portrait}
              alt={t.founder.alt}
              className="h-auto w-full scale-105 grayscale transition-transform duration-[1600ms] ease-out hover:scale-100"
              loading="lazy"
            />
          </div>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <p className="text-[#5E6E7C]">{t.founder.role}</p>
          <h2 className="display mt-3 text-[clamp(2.2rem,4.5vw,4rem)]">{t.founder.name}</h2>
          <blockquote className="mt-10 space-y-5 text-xl leading-relaxed md:text-2xl">
            <p>{t.founder.quote1}</p>
            <p>{t.founder.quote2}</p>
          </blockquote>
          <ContactButton className="mt-12 !bg-ink !text-paper hover:!bg-[#2A323A]">
            {t.founder.cta}
          </ContactButton>
        </div>
      </div>
    </section>
  );
}
