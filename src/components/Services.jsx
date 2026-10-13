import { useState } from "react";
import useLanguage from "../i18n/useLanguage.js";
import ContactButton from "./contact/ContactButton.jsx";
import { serviceDescriptions } from "../i18n/serviceDescriptions.js";

export default function Services() {
  const { t, language } = useLanguage();
  const [tabIndex, setTabIndex] = useState(0);
  const groups = t.services.groups;

  return (
    <section id="services" className="bg-ink text-paper">
      <div className="mx-auto grid min-h-screen min-h-[100svh] max-w-[1400px] items-center gap-10 px-6 py-24 md:px-12 lg:grid-cols-[0.85fr_1.6fr] lg:gap-16">
        <div className="flex flex-col justify-between gap-10">
          <div>
            <h2 className="display max-w-xl text-[clamp(2.6rem,5.7vw,5.25rem)] leading-[0.92] text-paper">{t.services.title}</h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-paper/70">{t.services.text}</p>
          </div>
          <ContactButton className="group w-fit border border-[rgba(232,232,228,.4)] !px-6 !py-3.5 transition-colors hover:!bg-transparent hover:!text-[#E8E8E4]">
            {t.nav.start}
            <span className="ml-5 text-3xl leading-none transition-transform group-hover:translate-x-1">↗</span>
          </ContactButton>
        </div>

        <div>
          <select
            value={tabIndex}
            onChange={(event) => setTabIndex(Number(event.target.value))}
            className="w-full border border-[rgba(232,232,228,.28)] bg-[#15181C] px-4 py-4 text-base font-semibold text-[#E8E8E4] outline-none md:hidden"
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
                className={`min-h-14 w-auto whitespace-nowrap border px-6 py-3 text-lg font-semibold transition-colors md:text-xl ${
                  tabIndex === index ? "border-[#E8E8E4] bg-[#E8E8E4] text-[#15181C]" : "bd text-[#E8E8E4]/75 hover:border-[#E8E8E4]/70 hover:text-[#E8E8E4]"
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
                className="tabfade flex min-w-0 flex-col border bd bg-ink2 p-5 md:p-6"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <h4 className="break-words text-2xl font-semibold text-paper">{service}</h4>
                <p className="mt-3 text-base leading-relaxed text-paper/70">{serviceDescriptions[language][groupIndex][index]}</p>
              </article>
            ))}
            <ContactButton
              className="tabfade group flex min-h-[72px] items-center justify-between border bd !bg-transparent !p-5 text-left !text-[#E8E8E4] transition-colors hover:!bg-[#E8E8E4] hover:!text-[#15181C] sm:col-span-2"
              style={{ animationDelay: `${group.items.length * 60}ms` }}
            >
              <span className="text-lg font-semibold">{t.services.discuss}</span>
              <span className="ml-6 text-5xl font-normal leading-none transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
            </ContactButton>
          </div>
          ))}
        </div>
      </div>
    </section>
  );
}
