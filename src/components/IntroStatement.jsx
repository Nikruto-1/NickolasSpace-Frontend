import useLanguage from "../i18n/useLanguage.js";

export default function IntroStatement() {
  const { t } = useLanguage();

  return (
    <section id="intro" className="bg-paper text-ink">
      <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-12 md:py-28">
        <p className="display section-title">
          {t.intro.title}
          <br />
          <span className="text-muted-dark">{t.intro.accent}</span>
        </p>
        <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t bdd pt-6">
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
