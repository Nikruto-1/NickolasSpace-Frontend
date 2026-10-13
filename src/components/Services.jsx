import { useState } from "react";
import useLanguage from "../i18n/useLanguage.js";
import ContactButton from "./contact/ContactButton.jsx";
import { serviceDescriptions } from "../i18n/serviceDescriptions.js";
import { ArrowUpRight } from "lucide-react";

export default function Services() {
  const { t, language } = useLanguage();
  const [tabIndex, setTabIndex] = useState(0);
  const groups = t.services.groups;

  return (
    <section id="services" className="bg-ink text-paper">
      <div className="mx-auto grid max-w-[1400px] items-start gap-10 px-6 py-20 md:px-12 md:py-28 lg:grid-cols-[0.85fr_1.6fr] lg:gap-16">
        <div className="flex flex-col justify-between gap-10">
          <div>
            <h2 className="display section-title text-paper">{t.services.title}</h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-mist">{t.services.text}</p>
          </div>
          <ContactButton className="group w-fit">
            {t.nav.start}
            <ArrowUpRight size={18} className="ml-4" aria-hidden="true" />
          </ContactButton>
        </div>

        <div>
          <select
            value={tabIndex}
            onChange={(event) => setTabIndex(Number(event.target.value))}
            className="w-full rounded-md border border-control bg-ink px-4 py-3 text-base font-medium text-paper md:hidden"
            aria-label={t.nav.services}
          >
            {groups.map((item, index) => (
              <option key={item.name} value={index}>
                {item.name}
              </option>
            ))}
          </select>

          <div role="tablist" aria-label={t.nav.services} className="hidden flex-wrap gap-3 md:flex">
            {groups.map((item, index) => (
              <button
                key={item.name}
                type="button"
                role="tab"
                id={`service-tab-${index}`}
                aria-controls={`service-panel-${index}`}
                aria-selected={tabIndex === index}
                tabIndex={tabIndex === index ? 0 : -1}
                onClick={() => setTabIndex(index)}
                onKeyDown={(event) => {
                  const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
                  if (!keys.includes(event.key)) return;
                  event.preventDefault();
                  const next = event.key === "Home" ? 0 : event.key === "End" ? groups.length - 1 :
                    (index + (event.key === "ArrowRight" ? 1 : -1) + groups.length) % groups.length;
                  setTabIndex(next);
                  event.currentTarget.parentElement.querySelectorAll('[role="tab"]')[next].focus();
                }}
                className={`min-h-11 w-auto whitespace-nowrap rounded-md border px-4 py-2.5 text-base font-medium transition-colors ${
                  tabIndex === index ? "border-accent/60 bg-accent/10 text-accent" : "border-transparent text-mist hover:bg-paper/5 hover:text-paper"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          {groups.map((group, groupIndex) => (
          <div key={`${language}-${group.name}`} id={`service-panel-${groupIndex}`} role="tabpanel" aria-label={group.name} hidden={tabIndex !== groupIndex} className={`service-panel mt-8 gap-4 sm:grid-cols-2 ${tabIndex === groupIndex ? "grid" : "hidden"}`}>
            <h3 className="text-base font-semibold text-mist sm:col-span-2">{group.name}</h3>
            {group.items.map((service, index) => (
              <article
                key={service}
                className="tabfade flex min-w-0 flex-col rounded-lg border bd bg-ink2 p-5 md:p-6"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <h4 className="break-words text-xl font-medium text-paper">{service}</h4>
                <p className="mt-3 text-base leading-relaxed text-mist">{serviceDescriptions[language][groupIndex][index]}</p>
              </article>
            ))}
            <ContactButton
              variant="outline" className="tabfade group flex min-h-[64px] items-center justify-between !p-5 text-left sm:col-span-2"
              style={{ animationDelay: `${group.items.length * 60}ms` }}
            >
              <span className="text-lg font-semibold">{t.services.discuss}</span>
              <ArrowUpRight size={20} className="ml-6 shrink-0" aria-hidden="true" />
            </ContactButton>
          </div>
          ))}
        </div>
      </div>
    </section>
  );
}
