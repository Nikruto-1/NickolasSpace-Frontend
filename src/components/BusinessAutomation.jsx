import { ASSETS } from "../constants.js";
import useInView from "../hooks/useInView.js";
import useLanguage from "../i18n/useLanguage.js";
import Video from "./shared/Video.jsx";

export default function BusinessAutomation() {
  const [ref, seen] = useInView(0.4);
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-ink">
      <Video src={ASSETS.automation} smoothLoop />
      <div className="absolute inset-0 bg-ink/85" />
      <div className="relative mx-auto max-w-[1400px] px-6 py-20 md:px-12 md:py-28">
        <h2 className="display section-title">
          {t.automation.title}
          <br />
          {t.automation.accent}
        </h2>
        <div ref={ref} className="relative mt-12 md:mt-16">
          <div className="absolute bottom-3 left-[7px] top-3 w-px bg-paper/20 xl:bottom-auto xl:left-0 xl:right-0 xl:top-[7px] xl:h-px xl:w-auto" />
          <div
            className="absolute bottom-3 left-[7px] top-3 w-px origin-top bg-paper transition-transform duration-[2400ms] ease-out xl:bottom-auto xl:left-0 xl:right-0 xl:top-[7px] xl:h-px xl:w-auto xl:origin-left"
            style={{ transform: seen ? "scale(1)" : "scale(0)" }}
          />
          <ol className="relative flex flex-col gap-10 xl:flex-row xl:justify-between">
            {t.automation.nodes.map((node, index) => (
              <li key={node} className="flex min-w-0 items-center gap-5 xl:flex-col xl:items-start xl:gap-6">
                <span
                  className="h-[15px] w-[15px] shrink-0 rounded-full border border-accent transition-colors duration-500"
                  style={{ transitionDelay: `${index * 330}ms`, background: seen ? "var(--accent)" : "var(--ink)" }}
                />
                <span className="text-base font-medium text-paper">
                  {node}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
