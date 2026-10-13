import { useRef } from "react";
import { ASSETS } from "../constants.js";
import useScrollProgress from "../hooks/useScrollProgress.js";
import useLanguage from "../i18n/useLanguage.js";
import Video from "./shared/Video.jsx";

export default function HowWeWork() {
  const listRef = useRef(null);
  const progress = useScrollProgress(listRef);
  const { t } = useLanguage();

  return (
    <section id="process" className="bg-ink2">
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
        <div ref={listRef} className="relative pl-10 md:pl-14">
          <div className="absolute bottom-0 left-0 top-0 w-px bg-paper/15" />
          <div className="absolute left-0 top-0 w-px bg-paper" style={{ height: `${progress * 100}%` }} />
          {t.process.steps.map(([number, title, description], index) => {
            const active = progress >= index / t.process.steps.length + 0.04;

            return (
              <div key={number} className="relative pb-12 last:pb-0 md:pb-16">
                <span className="absolute -left-[45px] top-3 h-[9px] w-[9px] rounded-full md:-left-[61px]" style={{ background: active ? "var(--accent)" : "rgb(var(--mist-rgb))" }} />
                <span className="text-mist">{number}</span>
                <h3 className="display mt-2 text-2xl md:text-3xl">{title}</h3>
                <p className="mt-4 max-w-md text-base text-mist">{description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
