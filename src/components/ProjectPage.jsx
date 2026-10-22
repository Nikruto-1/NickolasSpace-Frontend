import { useEffect } from "react";
import { ArrowLeft, ArrowUpRight, ChevronDown } from "lucide-react";
import useLanguage from "../i18n/useLanguage.js";
import { caseStudies } from "../i18n/caseStudies.js";
import { gameProjectDetails } from "../i18n/gameProjectDetails.js";
import { projectPages } from "../i18n/projectPages.js";
import { projectStories } from "../i18n/projectStories.js";
import { projectMedia } from "../data/projectMedia.js";
import { projectMetadata } from "../data/projectMetadata.js";
import { isPlainNavigation } from "../navigation/portfolioState.js";
import { ProjectGallery } from "./SelectedWork.jsx";
import Button from "./shared/Button.jsx";
import ContactButton from "./contact/ContactButton.jsx";

function BackToProjects({ slug, children }) {
  return <a href={`./?project=${slug}#work`} onClick={(event) => {
    if (isPlainNavigation(event) && window.history.state?.fromPortfolio && window.history.length > 1) {
      event.preventDefault();
      window.history.back();
    }
  }} className="inline-flex min-h-11 items-center gap-3 py-2 text-sm text-mist transition-colors hover:text-accent"><ArrowLeft size={18} aria-hidden="true" />{children}</a>;
}

export default function ProjectPage({ route }) {
  const { language, t } = useLanguage();
  const copy = projectPages[language];
  const storyCopy = projectStories[language];
  const story = storyCopy.projects[route.index];
  const project = t.work.cases[route.index];
  const study = caseStudies[language];
  const isGames = route.index === 1;
  const media = projectMedia(route.index, language);
  const features = isGames ? gameProjectDetails[language][2].items : copy.autoFeatures;

  useEffect(() => {
    const url = new window.URL(window.location.href);
    if (url.searchParams.get("from") === "portfolio") {
      url.searchParams.delete("from");
      window.history.replaceState({ ...window.history.state, fromPortfolio: true }, "", url);
    }
    const metadata = projectMetadata(route);
    document.title = metadata.title;
    for (const [selector, value] of [
      ['meta[name="description"]', metadata.description],
      ['meta[property="og:title"]', metadata.title],
      ['meta[property="og:description"]', metadata.description],
      ['meta[property="og:url"]', metadata.url],
      ['meta[property="og:image"]', metadata.image],
      ['meta[property="og:image:width"]', metadata.imageWidth],
      ['meta[property="og:image:height"]', metadata.imageHeight],
      ['meta[property="og:image:type"]', metadata.imageType],
      ['meta[property="og:image:alt"]', project.name],
      ['meta[name="twitter:title"]', metadata.title],
      ['meta[name="twitter:description"]', metadata.description],
      ['meta[name="twitter:image"]', metadata.image],
      ['meta[name="twitter:image:alt"]', project.name],
    ]) document.querySelector(selector)?.setAttribute("content", String(value));
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", metadata.url);
  }, [route, project.name]);

  return (
    <article className="case-page pt-24 md:pt-28">
      <header className="case-container">
        <BackToProjects slug={route.slug}>{copy.back}</BackToProjects>
        <div className="case-intro">
          <div>
            <p className="text-sm text-accent">{copy.eyebrow}</p>
            <h1 className="display mt-3 break-words text-4xl md:text-5xl">{project.name}</h1>
            <p className="case-lead mt-5">{story.intro}</p>
          </div>
          <div className="case-role">
            <p className="text-sm font-medium">{storyCopy.role}</p>
            <p className="mt-3 max-w-lg leading-7 text-mist">{story.role}</p>
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-mist">{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
            <div className="case-actions mt-6 flex flex-wrap gap-3">
              <Button href={project.url} target="_blank" rel="noreferrer">{copy.visit}<ArrowUpRight size={18} className="ml-3 shrink-0" aria-hidden="true" /></Button>
              <ContactButton project={project.name} variant="outline">{t.work.discussSimilar}</ContactButton>
            </div>
          </div>
        </div>
      </header>
      <section aria-labelledby="case-gallery-title" className="case-container pb-12 md:pb-16">
        <h2 id="case-gallery-title" className="mb-6 text-sm font-medium text-mist">{storyCopy.gallery}</h2>
        <ProjectGallery screens={media.screens} labels={isGames ? t.work.gamesViews : t.work.screens} name={project.name} galleryLabel={isGames ? t.work.gamesGallery : t.work.gallery} context={story.views} large />
      </section>
      <section aria-labelledby="case-overview" className="bg-ink2">
        <div className="case-container py-12 md:py-16">
          <h2 id="case-overview" className="display text-2xl md:text-3xl">{copy.overview}</h2>
          <dl className="mt-8 grid gap-8 md:grid-cols-3 md:gap-10">
            {study.projects[project.name].map((description, index) => <div key={study.labels[index]} className="min-w-0"><dt className="font-semibold">{study.labels[index]}</dt><dd className="mt-3 text-base leading-7 text-mist">{description}</dd></div>)}
          </dl>
        </div>
      </section>
      <section aria-labelledby="case-features" className="case-container py-12 md:py-16">
        <h2 id="case-features" className="display text-2xl md:text-3xl">{copy.features}</h2>
        <dl className="mt-8 grid gap-x-16 md:grid-cols-2">
          {features.map(([title, description]) => <div key={title} className="border-t bd py-6"><dt className="text-lg font-medium">{title}</dt><dd className="mt-3 max-w-xl text-mist">{description}</dd></div>)}
        </dl>
        {isGames && <details className="group mt-6 border-y bd">
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 py-5 font-medium hover:text-accent [&::-webkit-details-marker]:hidden">{copy.games}<ChevronDown size={20} className="shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" /></summary>
          <div className="grid gap-10 pb-8 pt-3 lg:grid-cols-2">
            {gameProjectDetails[language].slice(0, 2).map((group) => <section key={group.title}><h3 className="text-xl font-medium">{group.title}</h3><dl className="case-game-details mt-6">{group.items.map(([title, description]) => <div key={title}><dt className="font-medium">{title}</dt><dd className="mt-2 text-sm leading-6 text-mist">{description}</dd></div>)}</dl></section>)}
          </div>
        </details>}
      </section>
      <section aria-labelledby="case-decisions" className="bg-ink2">
        <div className="case-container py-12 md:py-16">
          <h2 id="case-decisions" className="display text-2xl md:text-3xl">{storyCopy.decisions}</h2>
          <dl className="mt-8 grid gap-8 md:grid-cols-2 md:gap-16">
            {story.decisions.map(([title, description]) => <div key={title}><dt className="text-lg font-medium">{title}</dt><dd className="mt-3 max-w-xl leading-7 text-mist">{description}</dd></div>)}
          </dl>
          <div className="mt-12 border-t bd pt-10" aria-labelledby="case-flow">
          <h2 id="case-flow" className="display text-2xl md:text-3xl">{copy.flow}</h2>
          <ol className="mt-8 grid gap-8 md:grid-cols-3 md:gap-10">
            {copy.flows[route.index].map(([title, description], index) => <li key={title} className="border-t bd pt-5"><span className="text-sm tabular-nums text-accent">{String(index + 1).padStart(2, "0")}</span><h3 className="mt-4 text-lg font-medium">{title}</h3><p className="mt-3 text-mist">{description}</p></li>)}
          </ol>
          </div>
        </div>
      </section>
      <section aria-labelledby="case-contact-title" className="case-container py-14 md:py-20">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto] lg:gap-16">
          <div><h2 id="case-contact-title" className="display max-w-xl text-2xl md:text-3xl">{storyCopy.closingTitle}</h2><p className="mt-4 max-w-xl leading-7 text-mist">{storyCopy.closingText}</p></div>
          <ContactButton project={project.name} className="justify-self-start">{t.work.discussSimilar}<ArrowUpRight size={18} className="ml-3 shrink-0" aria-hidden="true" /></ContactButton>
        </div>
        <div className="mt-8"><BackToProjects slug={route.slug}>{copy.back}</BackToProjects></div>
      </section>
    </article>
  );
}
