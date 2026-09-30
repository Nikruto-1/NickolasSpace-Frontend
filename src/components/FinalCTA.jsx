import { ASSETS } from "../constants.js";
import useLanguage from "../i18n/useLanguage.js";
import Button from "./shared/Button.jsx";
import Video from "./shared/Video.jsx";

export default function FinalCTA() {
  const { t } = useLanguage();

  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-ink">
      <Video src={ASSETS.cta} poster="./assets/final-cta.jpg" />
      <div className="absolute inset-0 bg-[#15181C]/65" />
      <div className="relative mx-auto w-full max-w-[1400px] px-6 py-32 md:px-12">
        <h2 className="display text-[clamp(2.6rem,7.5vw,7rem)]">
          {t.cta.title}
          <br />
          {t.cta.accent}
        </h2>
        <p className="mt-8 max-w-lg text-lg text-paper/80 md:text-xl">{t.cta.text}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="mailto:kkosmacevskij@gmail.com">{t.cta.primary}</Button>
          <Button href="#contact" variant="ghost">
            {t.cta.secondary}
          </Button>
        </div>
      </div>
    </section>
  );
}
