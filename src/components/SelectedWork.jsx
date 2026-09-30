import useLanguage from "../i18n/useLanguage.js";

function AutoAlexMockup() {
  return (
    <div className="relative min-h-[360px] overflow-hidden border border-[rgba(232,232,228,.16)] bg-[#111418] p-5 md:min-h-[430px]">
      <div className="flex items-center justify-between border-b border-[rgba(232,232,228,.12)] pb-4 text-sm text-paper/55">
        <span>Auto Alex KFZ-Handel</span>
        <span>autoalex.net</span>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-5">
        <div className="md:col-span-3">
          <div className="flex aspect-[16/10] flex-col justify-end border border-[rgba(232,232,228,.14)] bg-gradient-to-br from-[#29313A] via-[#1E2329] to-[#15181C] p-6">
            <div className="mb-5 h-20 w-full border border-[rgba(232,232,228,.14)] bg-[#E8E8E4]/8" />
            <div className="h-3 w-2/3 bg-[#E8E8E4]" />
            <div className="mt-3 h-3 w-1/2 bg-[#8A9BAA]" />
          </div>
        </div>
        <div className="space-y-4 md:col-span-2">
          {["Search", "Lead", "Telegram"].map((item, index) => (
            <div key={item} className="border border-[rgba(232,232,228,.14)] bg-[#1E2329] p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-paper/55">{item}</span>
                <span className="h-2 w-2 bg-[#8A9BAA]" />
              </div>
              <div className="mt-8 h-2 bg-[#E8E8E4]" style={{ width: `${70 - index * 12}%` }} />
              <div className="mt-3 h-2 bg-[#E8E8E4]/25" />
            </div>
          ))}
        </div>
      </div>
      <div className="absolute -bottom-16 -right-16 h-44 w-44 border border-[rgba(232,232,228,.12)]" />
    </div>
  );
}

export default function SelectedWork() {
  const { t } = useLanguage();
  const [featured, ...secondaryCases] = t.work.cases;

  return (
    <section id="work" className="bg-ink2 text-paper">
      <div className="mx-auto max-w-[1400px] px-6 py-28 md:px-12 md:py-40">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-mist">{t.work.eyebrow}</p>
            <h2 className="display mt-4 max-w-3xl text-[clamp(2.5rem,5.8vw,5.4rem)]">{t.work.title}</h2>
          </div>
          <p className="max-w-xl text-lg leading-relaxed text-paper/65 lg:justify-self-end">
            {featured.desc}
          </p>
        </div>

        <article className="mt-16 grid overflow-hidden border border-[rgba(232,232,228,.16)] lg:grid-cols-[0.85fr_1.15fr]">
          <div className="flex flex-col justify-between gap-12 bg-ink p-7 md:p-10">
            <div>
              <span className="text-sm text-mist">01</span>
              <h3 className="display mt-6 text-[clamp(2.2rem,5vw,4.8rem)]">{featured.name}</h3>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-paper/70">{featured.desc}</p>
            </div>
            <div>
              <ul className="flex flex-wrap gap-2">
                {featured.tags.map((tag) => (
                  <li key={tag} className="border border-[rgba(232,232,228,.18)] px-3 py-1 text-sm text-paper/70">
                    {tag}
                  </li>
                ))}
              </ul>
              {featured.url ? (
                <a
                  href={featured.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-flex items-center border border-[rgba(232,232,228,.4)] bg-[#E8E8E4] px-6 py-3.5 text-[15px] font-semibold text-[#15181C] transition-colors hover:bg-transparent hover:text-[#E8E8E4]"
                >
                  {t.work.viewProject}
                  <span className="ml-5 text-3xl leading-none">↗</span>
                </a>
              ) : null}
            </div>
          </div>
          <AutoAlexMockup />
        </article>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {secondaryCases.map((item, index) => (
            <article key={item.name} className="group border border-[rgba(232,232,228,.16)] bg-ink p-7 transition-colors hover:bg-[#E8E8E4]">
              <div className="flex min-h-[240px] flex-col justify-between">
                <div>
                  <span className="text-sm text-mist transition-colors group-hover:text-[#15181C]/55">0{index + 2}</span>
                  <h3 className="display mt-6 text-[clamp(1.9rem,3.6vw,3.2rem)] text-paper transition-colors group-hover:text-[#15181C]">{item.name}</h3>
                  <p className="mt-5 max-w-md text-paper/65 transition-colors group-hover:text-[#15181C]/70">{item.desc}</p>
                </div>
                <ul className="mt-8 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <li key={tag} className="border border-[rgba(232,232,228,.18)] px-3 py-1 text-sm text-paper/70 transition-colors group-hover:border-[#15181C]/20 group-hover:text-[#15181C]/70">
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
