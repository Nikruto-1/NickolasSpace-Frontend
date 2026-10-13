import { ASSETS } from "../constants.js";
import useLanguage from "../i18n/useLanguage.js";
import ContactButton from "./contact/ContactButton.jsx";

export default function FounderSection() {
  const { t } = useLanguage();

  return (
    <section id="founder" className="bg-paper text-ink">
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-6 py-20 md:px-12 md:py-28 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <div className="overflow-hidden rounded-lg">
            <img
              src={ASSETS.portrait}
              width="960"
              height="1043"
              alt={t.founder.alt}
              className="h-auto w-full grayscale"
              loading="lazy"
            />
          </div>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <p className="text-muted-dark">{t.founder.role}</p>
          <h2 className="display section-title mt-3">{t.founder.name}</h2>
          <blockquote className="mt-8 space-y-5 text-lg leading-relaxed md:text-xl">
            <p>{t.founder.quote1}</p>
            <p>{t.founder.quote2}</p>
          </blockquote>
          <ContactButton className="mt-8 !bg-ink !text-paper hover:!bg-ink2">
            {t.founder.cta}
          </ContactButton>
        </div>
      </div>
    </section>
  );
}
