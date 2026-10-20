import { useContext } from "react";
import { ArrowUpRight } from "lucide-react";
import { challenges } from "../i18n/challenges.js";
import useLanguage from "../i18n/useLanguage.js";
import ContactButton from "./contact/ContactButton.jsx";
import { MotionContext } from "./shared/motionContext.js";

export default function BusinessChallenges() {
  const { language } = useLanguage();
  const { paused } = useContext(MotionContext);
  const copy = challenges[language] ?? challenges.en;

  return (
    <section id="challenges" aria-labelledby="challenges-title" className="business-challenges bg-paper text-ink" data-motion={paused ? "paused" : "enabled"}>
      <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-12 md:py-24">
        <div className="challenges-heading">
          <h2 id="challenges-title" className="display section-title">{copy.title}</h2>
          <p className="mt-5 max-w-xl text-lg text-muted-dark">{copy.text}</p>
        </div>
        <ol className="challenge-stack">
          {copy.cards.map((card, index) => (
            <li key={index} className={`challenge-card challenge-card--${index + 1}`} style={{ "--card-index": index }}>
              <div className="challenge-card-heading">
                <h3>{card.title}</h3>
                <span className="challenge-card-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <p>{card.text}</p>
            </li>
          ))}
        </ol>
        <div className="challenges-action">
          <ContactButton className="!bg-ink !text-paper hover:!bg-ink2">
            {copy.action}<ArrowUpRight size={20} className="ml-3 shrink-0" aria-hidden="true" />
          </ContactButton>
        </div>
      </div>
    </section>
  );
}
