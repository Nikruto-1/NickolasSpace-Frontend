import { ASSETS } from "../constants.js";
import useInView from "../hooks/useInView.js";
import useLanguage from "../i18n/useLanguage.js";
import Video from "./shared/Video.jsx";

export default function BusinessAutomation() {
  const [ref, seen] = useInView(0.4);
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-ink">
      <Video src={ASSETS.automation} />
      <div className="absolute inset-0 bg-[#15181C]/70" />
      <div className="relative mx-auto max-w-[1400px] px-6 py-32 md:px-12 md:py-48">
        <h2 className="display max-w-4xl text-[clamp(2.4rem,6vw,5.5rem)]">
          {t.automation.title}
          <br />
          {t.automation.accent}
        </h2>
        <div ref={ref} className="relative mt-24 md:mt-32">
          <div className="absolute bottom-3 left-[7px] top-3 w-px bg-paper/20 md:bottom-auto md:left-0 md:right-0 md:top-[7px] md:h-px md:w-auto" />
          <div
            className="absolute bottom-3 left-[7px] top-3 w-px origin-top bg-paper transition-transform duration-[2400ms] ease-out md:bottom-auto md:left-0 md:right-0 md:top-[7px] md:h-px md:w-auto md:origin-left"
            style={{ transform: seen ? "scale(1)" : "scale(0)" }}
          />
          <ol className="relative flex flex-col gap-10 md:flex-row md:justify-between">
            {t.automation.nodes.map((node, index) => (
              <li key={node} className="flex items-center gap-5 md:flex-col md:items-start md:gap-6">
                <span
                  className="h-[15px] w-[15px] rounded-full border border-paper transition-all duration-500"
                  style={{ transitionDelay: `${index * 330}ms`, background: seen ? "#E8E8E4" : "#15181C" }}
                />
                <span className="text-lg font-medium transition-opacity duration-700" style={{ transitionDelay: `${index * 330}ms`, opacity: seen ? 1 : 0.25 }}>
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
