import useLanguage from "../i18n/useLanguage.js";

export default function IntroStatement() {
  const { t } = useLanguage();

  return (
    <section id="intro" className="bg-paper text-ink">
      <div className="mx-auto max-w-[1400px] px-6 py-32 md:px-12 md:py-48">
        <p className="display max-w-6xl text-[clamp(2.2rem,6vw,5.5rem)]">
          {t.intro.title}
          <br />
          <span className="text-[#5E6E7C]">{t.intro.accent}</span>
        </p>
        <ul className="mt-16 flex flex-wrap gap-x-10 gap-y-3 border-t bdd pt-6">
          {t.intro.words.map((word) => (
            <li key={word} className="group relative cursor-default py-1 text-lg font-medium">
              {word}
              <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-ink transition-transform duration-500 group-hover:scale-x-100" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
