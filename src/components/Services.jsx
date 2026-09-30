import { useState } from "react";
import useLanguage from "../i18n/useLanguage.js";

const serviceCardLayout = [
  "xl:basis-[32%]",
  "xl:basis-[34%]",
  "xl:basis-[28%]",
  "xl:basis-[39%]",
  "xl:basis-[31%]",
  "xl:basis-[48%]",
];

export default function Services() {
  const { t, language } = useLanguage();
  const [tabIndex, setTabIndex] = useState(0);
  const groups = t.services.groups;
  const tab = groups[tabIndex] ?? groups[0];

  return (
    <section id="services" className="bg-ink text-paper">
      <div className="mx-auto grid min-h-screen min-h-[100svh] max-w-[1400px] items-center gap-10 px-6 py-24 md:px-12 lg:grid-cols-[0.85fr_1.6fr] lg:gap-16">
        <div className="flex flex-col justify-between gap-10">
          <div>
            <h2 className="display max-w-xl text-[clamp(2.6rem,5.7vw,5.25rem)] leading-[0.92] text-paper">{t.services.title}</h2>
          </div>
          <a
            href="#contact"
            className="group inline-flex w-fit items-center border border-[rgba(232,232,228,.4)] bg-[#E8E8E4] px-6 py-3.5 text-[15px] font-semibold text-[#15181C] transition-colors hover:bg-transparent hover:text-[#E8E8E4]"
          >
            {t.nav.start}
            <span className="ml-5 text-3xl leading-none transition-transform group-hover:translate-x-1">↗</span>
          </a>
        </div>

        <div>
          <div role="tablist" className="flex flex-wrap gap-3">
            {groups.map((item, index) => (
              <button
                key={item.name}
                type="button"
                role="tab"
                aria-selected={tabIndex === index}
                onClick={() => setTabIndex(index)}
                className={`min-h-14 w-auto whitespace-nowrap border px-6 py-3 text-lg font-semibold transition-colors md:text-xl ${
                  tabIndex === index ? "border-[#E8E8E4] bg-[#E8E8E4] text-[#15181C]" : "bd text-[#E8E8E4]/75 hover:border-[#E8E8E4]/70 hover:text-[#E8E8E4]"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          <div key={`${language}-${tab.name}`} role="tabpanel" className="mt-8 flex flex-col gap-3 sm:grid sm:grid-cols-2 xl:flex xl:flex-row xl:flex-wrap">
            {tab.items.map((service, index) => (
              <div
                key={service}
                className={`tabfade group flex min-h-[118px] grow items-end border bd bg-ink2 p-5 transition-colors hover:bg-[#E8E8E4] ${
                  serviceCardLayout[index] ?? "xl:basis-[32%]"
                } ${index === tab.items.length - 1 ? "sm:col-span-2" : ""}`}
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <h3 className="text-2xl font-semibold tracking-tight text-[#E8E8E4] transition-colors group-hover:text-[#15181C] md:text-3xl">{service}</h3>
              </div>
            ))}
            <a
              href="#contact"
              className="tabfade group flex min-h-[118px] grow basis-full items-center justify-between border bd bg-transparent p-5 text-[#E8E8E4] transition-colors hover:bg-[#E8E8E4] hover:text-[#15181C] sm:col-span-2 xl:basis-[48%]"
              style={{ animationDelay: `${tab.items.length * 60}ms` }}
            >
              <span className="text-2xl font-semibold tracking-tight md:text-3xl">{t.services.more}</span>
              <span className="ml-6 text-5xl font-normal leading-none transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
