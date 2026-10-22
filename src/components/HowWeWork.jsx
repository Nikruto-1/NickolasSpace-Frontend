import { useRef } from "react";
import { ASSETS } from "../constants.js";
import useScrollProgress from "../hooks/useScrollProgress.js";
import useLanguage from "../i18n/useLanguage.js";
import Video from "./shared/Video.jsx";

export default function HowWeWork() {
  const listRef = useRef(null);
  const { activeIndex, progressByStep } = useScrollProgress(listRef);
  const { t } = useLanguage();

  return (
    <section id="process" className="bg-ink">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-6 py-20 md:px-12 md:py-28 lg:grid-cols-2">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="display section-title">
            {t.process.title}
            <br />
            {t.process.accent}
          </h2>
          <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-lg">
            <Video src={ASSETS.how} smoothLoop />
          </div>
        </div>
        <ol ref={listRef} className="process-timeline">
          {t.process.steps.map(([number, title, description], index) => {
            const stepProgress = progressByStep[index] ?? 0;
            const active = index === activeIndex;

            return (
              <li key={number} className="process-step" data-active={active} data-complete={index < activeIndex} aria-current={active ? "step" : undefined}>
                <span className="process-step-number" aria-hidden="true">{number}</span>
                {index < t.process.steps.length - 1 && <span className="process-step-line" aria-hidden="true">
                  <span style={{ transform: `scaleY(${stepProgress})` }} />
                </span>}
                <div className="process-step-copy">
                  <h3 className="display text-2xl md:text-3xl">{title}</h3>
                  <p className="mt-4 text-lg leading-relaxed text-mist">{description}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
