import { ASSETS } from "../constants.js";
import useLanguage from "../i18n/useLanguage.js";
import ContactButton from "./contact/ContactButton.jsx";
import Video from "./shared/Video.jsx";

export default function FinalCTA() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-deep">
      <Video src={ASSETS.cta} smoothLoop />
      <div className="absolute inset-0 bg-deep/85" />
      <div className="relative mx-auto w-full max-w-[1400px] px-6 py-20 md:px-12 md:py-28">
        <h2 className="display section-title">
          {t.cta.title}
          <br />
          {t.cta.accent}
        </h2>
        <p className="mt-6 max-w-xl text-lg text-paper">{t.cta.text}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ContactButton>{t.cta.primary}</ContactButton>
        </div>
      </div>
    </section>
  );
}
