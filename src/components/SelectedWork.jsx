import { useRef, useState } from "react";
import useLanguage from "../i18n/useLanguage.js";
import Button from "./shared/Button.jsx";
import { gameProjectDetails } from "../i18n/gameProjectDetails.js";

const autoAlexScreens = [
  { src: "./assets/autoalex-home.jpeg", width: 1536, height: 874 },
  { src: "./assets/autoalex-calculator.png", width: 1902, height: 1080 },
  { src: "./assets/autoalex-order.png", width: 1901, height: 1080 },
];
const gameScreensByLanguage = {
  uk: [
    { src: "./assets/nickolasgames-home-uk.png?v=2", width: 1904, height: 876 },
    { src: "./assets/nickolasgames-catalog-uk.png", width: 1900, height: 1080 },
  ],
  en: [
    { src: "./assets/nickolasgames-home-en.png?v=2", width: 1902, height: 877 },
    { src: "./assets/nickolasgames-catalog-en.png", width: 1900, height: 1080 },
  ],
  sv: [
    { src: "./assets/nickolasgames-home-sv.png?v=2", width: 1900, height: 878 },
    { src: "./assets/nickolasgames-catalog-sv.png", width: 1898, height: 1080 },
  ],
};

function ProjectGallery({ screens, labels, name, galleryLabel }) {
  const { t } = useLanguage();
  const [selected, setSelected] = useState(0);
  const screen = screens[selected];

  return (
    <figure className="min-w-0">
      <a href={screen.src} target="_blank" rel="noreferrer" aria-label={`${t.work.openImage}: ${name}, ${labels[selected]}`} className="block aspect-[16/9] overflow-hidden rounded-sm bg-[#202020]">
        <img src={screen.src} alt={`${name} — ${labels[selected]}`} width={screen.width} height={screen.height} loading="lazy" decoding="async" draggable={false} className="h-full w-full object-contain" />
      </a>
      <div role="group" aria-label={galleryLabel} className="mt-4 flex flex-wrap gap-x-5 gap-y-1">
        {screens.map((item, index) => (
          <button key={index} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)} className={`min-h-11 border-b-2 py-2 text-sm font-medium transition-colors ${selected === index ? "border-paper text-paper" : "border-transparent text-paper/65 hover:text-paper"}`}>
            {labels[index]}
          </button>
        ))}
      </div>
      <figcaption className="mt-3 text-sm text-paper/65">
        <a href={screen.src} target="_blank" rel="noreferrer" className="inline-block py-2 underline underline-offset-4 hover:text-paper">{t.work.openImage} ↗</a>
      </figcaption>
    </figure>
  );
}

export default function SelectedWork() {
  const { t, language } = useLanguage();
  const [active, setActive] = useState(0);
  const gesture = useRef(null);
  const projects = t.work.cases;
  const move = (offset) => setActive((index) => Math.max(0, Math.min(projects.length - 1, index + offset)));
  const arrowClass = "flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border bd text-xl transition-colors hover:border-mist hover:bg-ink disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent";

  return (
    <section id="work" className="bg-ink2 text-paper">
      <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-12 md:py-24">
        <p className="text-sm text-mist">{t.work.eyebrow}</p>
        <h2 className="display mt-3 text-4xl md:text-5xl">{t.work.title}</h2>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-5 border-b bd pb-5">
          <div role="group" aria-label={t.work.selectProject} className="flex flex-wrap gap-2" onKeyDown={(event) => {
            if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
            event.preventDefault();
            const next = Math.max(0, Math.min(projects.length - 1, active + (event.key === "ArrowRight" ? 1 : -1)));
            setActive(next);
            event.currentTarget.querySelectorAll("button")[next].focus();
          }}>
            {projects.map((project, index) => (
              <button key={project.name} type="button" aria-pressed={active === index} aria-controls={`project-slide-${index}`} onClick={() => setActive(index)} className={`min-h-11 rounded-sm px-4 py-2.5 text-sm font-semibold transition-colors ${active === index ? "bg-paper text-ink" : "text-paper/70 hover:bg-ink hover:text-paper"}`}>
                {project.name}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <p aria-live="polite" aria-atomic="true" className="mr-2 min-w-12 text-sm tabular-nums text-mist">
              {String(active + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
              <span className="sr-only"> {projects[active].name}</span>
            </p>
            <button type="button" className={arrowClass} aria-label={t.work.previousProject} title={t.work.previousProject} disabled={active === 0} onClick={() => move(-1)}>←</button>
            <button type="button" className={arrowClass} aria-label={t.work.nextProject} title={t.work.nextProject} disabled={active === projects.length - 1} onClick={() => move(1)}>→</button>
          </div>
        </div>
        <div style={{ touchAction: "pan-y" }} onTouchStart={(event) => {
          const touch = event.touches[0];
          gesture.current = { x: touch.clientX, y: touch.clientY };
        }} onTouchEnd={(event) => {
          if (!gesture.current) return;
          const touch = event.changedTouches[0];
          const dx = touch.clientX - gesture.current.x;
          const dy = touch.clientY - gesture.current.y;
          gesture.current = null;
          if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) move(dx < 0 ? 1 : -1);
        }} onTouchCancel={() => { gesture.current = null; }}>
          {projects.map((project, index) => {
            const isGames = project.name === "NickolasGames";
            return (
              <article key={project.name} id={`project-slide-${index}`} aria-labelledby={`project-title-${index}`} hidden={active !== index} className={`project-slide gap-8 pt-8 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)] lg:gap-12 ${active === index ? "grid" : "hidden"}`}>
                <div className="order-last min-w-0 lg:py-4">
                  <h3 id={`project-title-${index}`} className="display break-words text-3xl md:text-4xl">{project.name}</h3>
                  <p className="mt-5 max-w-lg text-base leading-7 text-paper/75">{project.desc}</p>
                  <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm text-mist">
                    {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
                  </ul>
                  <Button href={project.url} target="_blank" rel="noreferrer" className="mt-7">
                    {t.work.viewProject}<span className="ml-4 text-xl" aria-hidden="true">↗</span>
                  </Button>
                </div>
                <ProjectGallery screens={isGames ? gameScreensByLanguage[language] : autoAlexScreens} labels={isGames ? t.work.gamesViews : t.work.screens} name={project.name} galleryLabel={isGames ? t.work.gamesGallery : t.work.gallery} />
                {isGames && (
                  <details className="order-last border-t bd lg:col-span-2">
                    <summary className="cursor-pointer py-5 font-semibold text-paper hover:text-mist">{t.work.gamesDetailsLabel}</summary>
                    <div className="grid gap-10 pb-6 pt-3 md:grid-cols-2 xl:grid-cols-3">
                      {gameProjectDetails[language].map((group) => (
                        <section key={group.title}>
                          <h4 className="text-xl font-semibold">{group.title}</h4>
                          <dl className="mt-6 space-y-5">
                            {group.items.map(([title, description]) => (
                              <div key={title}><dt className="font-semibold">{title}</dt><dd className="mt-2 text-sm leading-relaxed text-paper/70">{description}</dd></div>
                            ))}
                          </dl>
                        </section>
                      ))}
                    </div>
                  </details>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
