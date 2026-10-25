import { useEffect, useRef, useState } from "react";
import useLanguage from "../i18n/useLanguage.js";
import Button from "./shared/Button.jsx";
import DeviceMockup from "./DeviceMockup.jsx";
import PhoneMockup from "./PhoneMockup.jsx";
import { projectPages } from "../i18n/projectPages.js";
import { projectMedia } from "../data/projectMedia.js";
import { projectFilename, projectSlugs } from "../data/projectRoutes.js";
import { openProject } from "../navigation/portfolioState.js";
import usePortfolioState from "../navigation/usePortfolioState.js";
import { ArrowLeft, ArrowRight, ArrowUpRight, Maximize2, X } from "lucide-react";

export function ProjectGallery({ screens, labels, name, galleryLabel, mockup, selectedIndex, onSelect, large = false, context }) {
  const { t } = useLanguage();
  const [localSelected, setLocalSelected] = useState(0);
  const selected = selectedIndex ?? localSelected;
  const setSelected = onSelect ?? setLocalSelected;
  const [expanded, setExpanded] = useState(false);
  const dialogRef = useRef(null);
  const showingMockup = mockup && selected === 0;
  const screen = showingMockup ? mockup : screens[selected];
  const showingPhone = screen.device === "phone";
  const view = context?.[selected];
  const previewLabel = showingPhone ? labels[selected] : t.work.devicesPreview;
  const PreviewTag = showingMockup || showingPhone ? "button" : "a";
  const previewProps = showingMockup || showingPhone
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
    <figure className={`min-w-0 ${context ? "case-gallery" : ""}`}>
      <PreviewTag {...previewProps} aria-label={`${t.work.openImage}: ${name}, ${labels[selected]}`} title={t.work.openImage} style={large ? { aspectRatio: `${screens[0].width} / ${screens[0].height}` } : undefined} className={`${large ? "case-preview" : "project-preview"} relative block w-full overflow-hidden rounded-lg ${showingMockup ? "aspect-[4/3] md:aspect-[16/10]" : large ? "bg-deep" : "aspect-[16/9] bg-deep"}`}>
        {showingMockup ? (
          <DeviceMockup src={screen.src} label={`${name} — ${labels[selected]}`} />
        ) : showingPhone ? <>
          <PhoneMockup screen={screen} label={`${name} — ${labels[selected]}`} loading={large ? "eager" : "lazy"} />
          <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-md border bd bg-ink text-paper" aria-hidden="true"><Maximize2 size={16} /></span>
        </> : <picture>
          {screen.preview && <source type="image/webp" srcSet={`${screen.preview}-720.webp 720w, ${screen.preview}-1440.webp 1440w`} sizes={large ? "(min-width: 1280px) 864px, (min-width: 1024px) calc(100vw - 416px), (min-width: 768px) calc(100vw - 96px), calc(100vw - 48px)" : "(min-width: 1400px) 758px, (min-width: 1024px) calc((100vw - 136px) * 0.6), (min-width: 768px) calc(100vw - 96px), calc(100vw - 48px)"} />}
          <img src={screen.src} alt={`${name} — ${labels[selected]}`} width={screen.width} height={screen.height} loading={large ? "eager" : "lazy"} decoding="async" draggable={false} className="h-full w-full object-contain" />
        </picture>}
      </PreviewTag>
      <div role="group" aria-label={galleryLabel} className={`flex flex-wrap gap-x-5 gap-y-1 ${context ? "case-gallery-controls" : "mt-4"}`}>
        {screens.map((item, index) => (
          <button key={index} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)} className={`min-h-11 border-b-2 py-2 text-sm font-medium transition-colors ${selected === index ? "border-accent text-accent" : "border-transparent text-mist hover:text-paper"}`}>
            {labels[index]}
          </button>
        ))}
      </div>
      {view ? <figcaption className="case-gallery-caption">
        <p className="text-sm text-accent">{view[0]}</p>
        <h3 className="display mt-3 text-2xl">{view[1]}</h3>
        <p className="mt-4 leading-7 text-mist">{view[2]}</p>
        {screen.demo && <p className="mt-5 text-xs leading-relaxed text-mist">{t.work.adminDemo}</p>}
      </figcaption> : screen.demo && <figcaption className="mt-3 text-xs leading-relaxed text-mist">{t.work.adminDemo}</figcaption>}
      {(mockup || showingPhone) && <dialog ref={dialogRef} aria-label={`${name} — ${previewLabel}`} onCancel={() => setExpanded(false)} onClick={(event) => {
        if (event.target === event.currentTarget) setExpanded(false);
      }} className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-[1400px] rounded-lg border bd bg-ink2 p-4 text-paper backdrop:bg-ink/90 md:p-6">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-mist">{name} — {previewLabel}</p>
          <button type="button" onClick={() => setExpanded(false)} aria-label={t.work.closePreview} title={t.work.closePreview} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md hover:bg-paper/5"><X size={24} aria-hidden="true" /></button>
        </div>
        <div className={showingPhone ? "h-[min(70dvh,640px)] w-full" : "aspect-[836/607] max-h-[70dvh] w-full"}>
          {showingPhone ? <PhoneMockup screen={screen} label={`${name} — ${previewLabel}`} loading="eager" /> : <DeviceMockup src={mockup.src} label={`${name} — ${t.work.devicesPreview}`} />}
        </div>
      </dialog>}
    </figure>
  );
}

export default function SelectedWork() {
  const { t, language } = useLanguage();
  const [portfolio, updatePortfolio] = usePortfolioState();
  const { active } = portfolio;
  const setActive = (value) => updatePortfolio({ active: typeof value === "function" ? value(active) : value });
  const gesture = useRef(null);
  const projects = t.work.cases;
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
            const media = projectMedia(index, language);
            const href = `./${projectFilename(projectSlugs[index], language)}`;
            return (
              <article key={project.name} id={`project-slide-${index}`} aria-labelledby={`project-title-${index}`} hidden={active !== index} className={`project-slide items-start gap-8 pt-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-10 ${active === index ? "grid" : "hidden"}`}>
                <div className="order-last grid min-w-0 gap-6 border-t bd pt-7 lg:order-first lg:border-t-0 lg:pt-2">
                  <div>
                    <h3 id={`project-title-${index}`} className="display break-words text-3xl md:text-4xl">{project.name}</h3>
                    <p className="mt-5 max-w-lg text-base leading-7 text-mist">{project.desc}</p>
                  </div>
                  <div>
                    <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-mist">
                      {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
                    </ul>
                    <div className="mt-7 flex flex-wrap gap-3">
                    <Button id={`project-details-${index}`} href={href} aria-label={`${projectPages[language].details}: ${project.name}`} onClick={(event) => openProject(event, href, portfolio)}>
                      {projectPages[language].details}<ArrowRight size={18} className="ml-3 shrink-0" aria-hidden="true" />
                    </Button>
                    <Button href={project.url} target="_blank" rel="noreferrer" variant="outline">
                      {t.work.viewProject}<ArrowUpRight size={18} className="ml-4" aria-hidden="true" />
                    </Button>
                    </div>
                  </div>
                </div>
                <ProjectGallery {...media} labels={isGames ? t.work.gamesViews : [t.work.devicesPreview, ...t.work.screens.slice(1)]} name={project.name} galleryLabel={isGames ? t.work.gamesGallery : t.work.gallery} selectedIndex={portfolio.screens[index]} onSelect={(selected) => updatePortfolio({ screens: portfolio.screens.map((value, item) => item === index ? selected : value) })} />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
