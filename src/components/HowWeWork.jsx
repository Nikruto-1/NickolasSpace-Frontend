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
      <div className="mx-auto grid max-w-[1400px] gap-16 px-6 py-28 md:px-12 md:py-40 lg:grid-cols-2">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="display text-[clamp(2.4rem,6vw,5.5rem)]">
            {t.process.title}
            <br />
            {t.process.accent}
          </h2>
          <div className="relative mt-12 aspect-[4/3] overflow-hidden">
            <Video src={ASSETS.how} smoothLoop />
          </div>
        </div>
        <div ref={listRef} className="relative pl-10 md:pl-14">
          <div className="absolute bottom-0 left-0 top-0 w-px bg-paper/15" />
          <div className="absolute left-0 top-0 w-px bg-paper" style={{ height: `${progress * 100}%` }} />
          {t.process.steps.map(([number, title, description], index) => {
            const active = progress >= index / t.process.steps.length + 0.04;

            return (
              <div key={number} className="relative pb-24 last:pb-0 md:pb-32" style={{ opacity: active ? 1 : 0.3, transition: "opacity .6s" }}>
                <span className="absolute -left-[45px] top-3 h-[9px] w-[9px] rounded-full bg-paper md:-left-[61px]" />
                <span className="text-mist">{number}</span>
                <h3 className="display mt-2 text-4xl md:text-5xl">{title}</h3>
                <p className="mt-4 max-w-sm text-lg text-paper/70">{description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
