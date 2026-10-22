import { useEffect, useRef, useState } from "react";
import useLanguage from "../i18n/useLanguage.js";
import Button from "./shared/Button.jsx";
import ContactButton from "./contact/ContactButton.jsx";
import DeviceMockup from "./DeviceMockup.jsx";
import { gameProjectDetails } from "../i18n/gameProjectDetails.js";
import { caseStudies } from "../i18n/caseStudies.js";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";

const autoAlexScreens = [
  { src: "./assets/autoalex-home.jpeg", preview: "./assets/autoalex-home", width: 1536, height: 874 },
  { src: "./assets/autoalex-calculator.png", preview: "./assets/autoalex-calculator", width: 1902, height: 1080 },
  { src: "./assets/autoalex-order.png", preview: "./assets/autoalex-order", width: 1901, height: 1080 },
];
const autoAlexMockup = { src: "./assets/autoalex-devices-figma.png", width: 836, height: 607 };
const gameScreensByLanguage = {
  uk: [
    { src: "./assets/nickolasgames-home-uk.png?v=2", preview: "./assets/nickolasgames-home-uk", width: 1904, height: 876 },
    { src: "./assets/nickolasgames-catalog-uk.png", preview: "./assets/nickolasgames-catalog-uk", width: 1900, height: 1080 },
  ],
  en: [
    { src: "./assets/nickolasgames-home-en.png?v=2", preview: "./assets/nickolasgames-home-en", width: 1902, height: 877 },
    { src: "./assets/nickolasgames-catalog-en.png", preview: "./assets/nickolasgames-catalog-en", width: 1900, height: 1080 },
  ],
  sv: [
    { src: "./assets/nickolasgames-home-sv.png?v=2", preview: "./assets/nickolasgames-home-sv", width: 1900, height: 878 },
    { src: "./assets/nickolasgames-catalog-sv.png", preview: "./assets/nickolasgames-catalog-sv", width: 1898, height: 1080 },
  ],
};

function ProjectGallery({ screens, labels, name, galleryLabel, mockup }) {
  const { t } = useLanguage();
  const [selected, setSelected] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const dialogRef = useRef(null);
  const showingMockup = mockup && selected === 0;
  const screen = showingMockup ? mockup : screens[selected];
  const PreviewTag = showingMockup ? "button" : "a";
  const previewProps = showingMockup
    ? { type: "button", onClick: () => setExpanded(true) }
    : { href: screen.src, target: "_blank", rel: "noreferrer" };

  useEffect(() => {
    if (!expanded) return undefined;
    const dialog = dialogRef.current;
    const trigger = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [expanded]);

  return (
    <figure className="min-w-0">
      <PreviewTag {...previewProps} aria-label={`${t.work.openImage}: ${name}, ${labels[selected]}`} className={`block w-full overflow-hidden rounded-lg ${showingMockup ? "aspect-[4/3] md:aspect-[16/10]" : "aspect-[16/9] bg-deep"}`}>
        {showingMockup ? (
          <DeviceMockup src={screen.src} label={`${name} — ${labels[selected]}`} />
        ) : <picture>
          <source type="image/webp" srcSet={`${screen.preview}-720.webp 720w, ${screen.preview}-1440.webp 1440w`} sizes="(min-width: 1400px) 1304px, (min-width: 768px) calc(100vw - 96px), calc(100vw - 48px)" />
          <img src={screen.src} alt={`${name} — ${labels[selected]}`} width={screen.width} height={screen.height} loading="lazy" decoding="async" draggable={false} className="h-full w-full object-contain" />
        </picture>}
      </PreviewTag>
      <div role="group" aria-label={galleryLabel} className="mt-4 flex flex-wrap gap-x-5 gap-y-1">
        {screens.map((item, index) => (
          <button key={index} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)} className={`min-h-11 border-b-2 py-2 text-sm font-medium transition-colors ${selected === index ? "border-accent text-accent" : "border-transparent text-mist hover:text-paper"}`}>
            {labels[index]}
          </button>
        ))}
      </div>
      <figcaption className="mt-3 text-sm text-mist">
        <PreviewTag {...previewProps} className="inline-flex min-h-11 items-center gap-2 py-2 underline underline-offset-4 hover:text-paper">{t.work.openImage}<ArrowUpRight size={14} aria-hidden="true" /></PreviewTag>
      </figcaption>
      {mockup && <dialog ref={dialogRef} aria-label={`${name} — ${t.work.devicesPreview}`} onCancel={() => setExpanded(false)} onClick={(event) => {
        if (event.target === event.currentTarget) setExpanded(false);
      }} className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-[1400px] rounded-lg border bd bg-ink2 p-4 text-paper backdrop:bg-ink/90 md:p-6">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-mist">{name} — {t.work.devicesPreview}</p>
          <button type="button" onClick={() => setExpanded(false)} aria-label={t.work.closePreview} title={t.work.closePreview} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md hover:bg-paper/5"><X size={24} aria-hidden="true" /></button>
        </div>
        <div className="aspect-[836/607] max-h-[70dvh] w-full">
          <DeviceMockup src={mockup.src} label={`${name} — ${t.work.devicesPreview}`} />
        </div>
      </dialog>}
    </figure>
  );
}

export default function SelectedWork() {
  const { t, language } = useLanguage();
  const [active, setActive] = useState(0);
  const gesture = useRef(null);
  const projects = t.work.cases;
  const caseStudy = caseStudies[language];
  const move = (offset) => setActive((index) => Math.max(0, Math.min(projects.length - 1, index + offset)));
  const arrowClass = "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-control text-paper transition-colors hover:border-accent hover:bg-paper/5 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent";

  return (
    <section id="work" className="bg-ink2 text-paper">
      <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-12 md:py-24">
        <p className="text-sm text-mist">{t.work.eyebrow}</p>
        <h2 className="display section-title mt-3">{t.work.title}</h2>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-5 border-b bd pb-5">
          <div role="group" aria-label={t.work.selectProject} className="flex flex-wrap gap-2" onKeyDown={(event) => {
            if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
            event.preventDefault();
            const next = Math.max(0, Math.min(projects.length - 1, active + (event.key === "ArrowRight" ? 1 : -1)));
            setActive(next);
            event.currentTarget.querySelectorAll("button")[next].focus();
          }}>
            {projects.map((project, index) => (
              <button key={project.name} type="button" aria-pressed={active === index} aria-controls={`project-slide-${index}`} onClick={() => setActive(index)} className={`min-h-11 rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${active === index ? "bg-accent/10 text-accent" : "text-mist hover:bg-paper/5 hover:text-paper"}`}>
                {project.name}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <p aria-live="polite" aria-atomic="true" className="mr-2 min-w-12 text-sm tabular-nums text-mist">
              {String(active + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
              <span className="sr-only"> {projects[active].name}</span>
            </p>
            <button type="button" className={arrowClass} aria-label={t.work.previousProject} title={t.work.previousProject} disabled={active === 0} onClick={() => move(-1)}><ArrowLeft size={18} aria-hidden="true" /></button>
            <button type="button" className={arrowClass} aria-label={t.work.nextProject} title={t.work.nextProject} disabled={active === projects.length - 1} onClick={() => move(1)}><ArrowRight size={18} aria-hidden="true" /></button>
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
              <article key={project.name} id={`project-slide-${index}`} aria-labelledby={`project-title-${index}`} hidden={active !== index} className={`project-slide gap-8 pt-8 lg:gap-10 ${active === index ? "grid" : "hidden"}`}>
                <div className="order-last grid min-w-0 gap-6 border-t bd pt-7 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
                  <div>
                    <h3 id={`project-title-${index}`} className="display break-words text-3xl md:text-4xl">{project.name}</h3>
                    <p className="mt-5 max-w-lg text-base leading-7 text-mist">{project.desc}</p>
                  </div>
                  <div className="lg:justify-self-end lg:text-right">
                    <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-mist lg:justify-end">
                      {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
                    </ul>
                    <div className="mt-7 flex flex-wrap gap-3 lg:justify-end">
                    <ContactButton project={project.name}>
                      {t.work.discussSimilar}<ArrowUpRight size={18} className="ml-3 shrink-0" aria-hidden="true" />
                    </ContactButton>
                    <Button href={project.url} target="_blank" rel="noreferrer" variant="outline">
                      {t.work.viewProject}<ArrowUpRight size={18} className="ml-4" aria-hidden="true" />
                    </Button>
                    </div>
                  </div>
                </div>
                <ProjectGallery screens={isGames ? gameScreensByLanguage[language] : autoAlexScreens} labels={isGames ? t.work.gamesViews : [t.work.devicesPreview, ...t.work.screens.slice(1)]} name={project.name} galleryLabel={isGames ? t.work.gamesGallery : t.work.gallery} mockup={isGames ? undefined : autoAlexMockup} />
                {caseStudy.projects[project.name] && (
                  <dl className="order-last grid min-w-0 gap-7 border-t bd pt-7 md:grid-cols-3 md:gap-8">
                    {caseStudy.projects[project.name].map((description, itemIndex) => (
                      <div key={caseStudy.labels[itemIndex]} className="min-w-0">
                        <dt className="text-base font-semibold text-paper">{caseStudy.labels[itemIndex]}</dt>
                        <dd className="mt-3 break-words text-base leading-relaxed text-mist">{description}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {isGames && (
                  <details className="order-last border-t bd">
                    <summary className="cursor-pointer py-5 font-semibold text-paper hover:text-mist">{t.work.gamesDetailsLabel}</summary>
                    <div className="grid gap-10 pb-6 pt-3 md:grid-cols-2 xl:grid-cols-3">
                      {gameProjectDetails[language].map((group) => (
                        <section key={group.title}>
                          <h4 className="text-xl font-semibold">{group.title}</h4>
                          <dl className="mt-6 space-y-5">
                            {group.items.map(([title, description]) => (
                              <div key={title}><dt className="font-semibold">{title}</dt><dd className="mt-2 text-sm leading-relaxed text-mist">{description}</dd></div>
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
