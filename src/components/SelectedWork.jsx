import { useState } from "react";
import useLanguage from "../i18n/useLanguage.js";
import Button from "./shared/Button.jsx";

const autoAlexScreens = [
  { src: "./assets/autoalex-home.jpeg", width: 1536, height: 874 },
  { src: "./assets/autoalex-calculator.png", width: 1902, height: 1080 },
  { src: "./assets/autoalex-order.png", width: 1901, height: 1080 },
];

const nickolasGamesScreens = [
  { src: "./assets/nickolasgames-home-uk.png", width: 1903, height: 1080 },
  { src: "./assets/nickolasgames-home-en.png", width: 1900, height: 1080 },
  { src: "./assets/nickolasgames-home-sv.png", width: 1901, height: 1079 },
  { src: "./assets/nickolasgames-catalog-uk.png", width: 1900, height: 1080 },
  { src: "./assets/nickolasgames-catalog-en.png", width: 1900, height: 1080 },
  { src: "./assets/nickolasgames-catalog-sv.png", width: 1898, height: 1080 },
];
const gameScreenByLanguage = { uk: 0, en: 1, sv: 2 };

function ProjectGallery({ screens, labels, name, galleryLabel, initialIndex = 0 }) {
  const { t } = useLanguage();
  const [selection, setSelection] = useState(null);
  const selected = selection ?? initialIndex;
  const screen = screens[selected];

  return (
    <figure className="flex min-w-0 flex-col justify-center gap-5 bg-[#111418] p-4 md:p-6">
      <a href={screen.src} target="_blank" rel="noreferrer" aria-label={`${t.work.openImage}: ${name}, ${labels[selected]}`} className="block aspect-[16/9] overflow-hidden bg-[#202020]">
        <img src={screen.src} alt={`${name} — ${labels[selected]}`} width={screen.width} height={screen.height} loading="lazy" decoding="async" className="h-full w-full object-contain" />
      </a>
      <div className="grid grid-cols-3 gap-2" role="group" aria-label={galleryLabel}>
        {screens.map((item, index) => (
          <button key={item.src} type="button" aria-label={labels[index]} title={labels[index]} aria-pressed={selected === index} onClick={() => setSelection(index)} className={`min-w-0 border p-1.5 text-left transition-colors ${selected === index ? "border-paper text-paper" : "bd text-paper/65 hover:border-paper/60"}`}>
            <img src={item.src} alt="" width={item.width} height={item.height} loading="lazy" decoding="async" className="aspect-[16/9] w-full object-contain" />
            <span className="mt-2 hidden min-h-10 break-words px-1 text-xs leading-5 min-[360px]:block sm:text-sm">{labels[index]}</span>
          </button>
        ))}
      </div>
      <figcaption className="flex flex-wrap items-center justify-between gap-3 text-sm text-paper/65">
        <span>{labels[selected]}</span>
        <a href={screen.src} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-paper">{t.work.openImage} ↗</a>
      </figcaption>
    </figure>
  );
}

export default function SelectedWork() {
  const { t, language } = useLanguage();
  const [featured, ...secondaryCases] = t.work.cases;
  const gameScreenLabels = t.work.gamesViews.flatMap((view) => ["UA", "EN", "SV"].map((code) => `${view} · ${code}`));

  return (
    <section id="work" className="bg-ink2 text-paper">
      <div className="mx-auto max-w-[1400px] px-6 py-28 md:px-12 md:py-40">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-mist">{t.work.eyebrow}</p>
            <h2 className="display mt-4 max-w-3xl text-[clamp(2.5rem,5.8vw,5.4rem)]">{t.work.title}</h2>
          </div>
          <p className="max-w-xl text-lg leading-relaxed text-paper/65 lg:justify-self-end">
            {featured.desc}
          </p>
        </div>

        <article className="mt-16 grid overflow-hidden border border-[rgba(232,232,228,.16)] lg:grid-cols-[0.85fr_1.15fr]">
          <div className="flex flex-col justify-between gap-12 bg-ink p-7 md:p-10">
            <div>
              <span className="text-sm text-mist">01</span>
              <h3 className="display mt-6 text-[clamp(2.2rem,5vw,4.8rem)]">{featured.name}</h3>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-paper/70">{featured.desc}</p>
            </div>
            <div>
              <ul className="flex flex-wrap gap-2">
                {featured.tags.map((tag) => (
                  <li key={tag} className="border border-[rgba(232,232,228,.18)] px-3 py-1 text-sm text-paper/70">
                    {tag}
                  </li>
                ))}
              </ul>
              {featured.url ? (
                <a
                  href={featured.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-flex items-center border border-[rgba(232,232,228,.4)] bg-[#E8E8E4] px-6 py-3.5 text-[15px] font-semibold text-[#15181C] transition-colors hover:bg-transparent hover:text-[#E8E8E4]"
                >
                  {t.work.viewProject}
                  <span className="ml-5 text-3xl leading-none">↗</span>
                </a>
              ) : null}
            </div>
          </div>
          <ProjectGallery screens={autoAlexScreens} labels={t.work.screens} name="Auto Alex KFZ-Handel" galleryLabel={t.work.gallery} />
        </article>

        <div className="mt-5 grid gap-5">
          {secondaryCases.map((item, index) => (
            <article key={item.name} className="grid overflow-hidden border border-[rgba(232,232,228,.16)] bg-ink lg:grid-cols-[0.85fr_1.15fr]">
                <div className="p-7 md:p-10">
                  <span className="text-sm text-mist">0{index + 2}</span>
                  <h3 className="display mt-6 text-[clamp(1.9rem,3.6vw,3.2rem)] text-paper">{item.name}</h3>
                  <p className="mt-5 max-w-md text-paper/70">{item.desc}</p>
                  <ul className="mt-8 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <li key={tag} className="border border-[rgba(232,232,228,.18)] px-3 py-1 text-sm text-paper/70">
                        {tag}
                      </li>
                    ))}
                  </ul>
                  <Button href={item.url} target="_blank" rel="noreferrer" className="mt-6">
                    {t.work.viewProject}<span className="ml-5 text-3xl leading-none" aria-hidden="true">↗</span>
                  </Button>
                </div>
                <ProjectGallery screens={nickolasGamesScreens} labels={gameScreenLabels} name={item.name} galleryLabel={t.work.gamesGallery} initialIndex={gameScreenByLanguage[language]} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
