import { ASSETS } from "../constants.js";
import useLanguage from "../i18n/useLanguage.js";
import ContactButton from "./contact/ContactButton.jsx";
import Button from "./shared/Button.jsx";
import Video from "./shared/Video.jsx";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section id="top" className="relative flex min-h-screen min-h-[100svh] items-end overflow-hidden bg-ink">
      <Video src={ASSETS.hero} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#15181C] via-[#15181C]/55 to-[#15181C]/40" />
      <div className="relative mx-auto w-full max-w-[1400px] px-6 pb-10 pt-32 sm:pb-14 md:px-12 md:pb-16 lg:pb-20">
        <h1 className="hero-title display">
          {t.hero.lines.map((line, index) => (
            <span key={line} className="mask">
              <span className="rise" style={{ animationDelay: `${0.25 + index * 0.16}s` }}>
                {line}
              </span>
            </span>
          ))}
        </h1>
        <div className="mt-6 flex flex-col gap-8 sm:mt-8 md:flex-row md:items-end md:justify-between">
          <div className="tabfade max-w-md" style={{ animationDelay: "1s" }}>
            <p className="text-lg text-paper/80 md:text-xl">{t.hero.text}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ContactButton>{t.hero.primary}</ContactButton>
              <Button href="#services" variant="ghost">
                {t.hero.secondary}
              </Button>
            </div>
          </div>
          <a href="#intro" aria-label={t.hero.scrollAria} className="hidden items-center gap-4 text-sm text-paper/60 md:flex">
            {t.hero.scroll}
            <span className="relative block h-14 w-px overflow-hidden bg-paper/20">
              <span className="absolute inset-0 bg-paper" style={{ animation: "drop 2.4s ease-in-out infinite" }} />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
