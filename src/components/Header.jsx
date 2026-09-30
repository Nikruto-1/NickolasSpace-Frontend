import { useEffect, useState } from "react";
import { languages } from "../i18n/translations.js";
import useLanguage from "../i18n/useLanguage.js";

export default function Header() {
  const [solid, setSolid] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const links = [
    [t.nav.services, "#services"],
    [t.nav.work, "#work"],
    [t.nav.process, "#process"],
    [t.nav.founder, "#founder"],
  ];

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 text-[#E8E8E4] transition-all duration-500 ${solid ? "border-b border-[rgba(232,232,228,.16)] bg-[#15181C]/90 backdrop-blur-md" : ""}`}>
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-4 py-4 sm:px-6 md:px-12 md:py-5">
        <a href="#top" className="inline-flex min-w-0 items-center gap-2 text-base font-bold tracking-tight sm:text-lg">
          <img src="./assets/logo-mark.png" alt="" className="h-8 w-8 shrink-0 object-contain" />
          <span>NickolasSpace</span>
        </a>
        <nav className="hidden gap-9 text-[15px] md:flex">
          {links.map(([label, href]) => (
            <a key={label} href={href} className="text-[#E8E8E4]/70 transition-colors hover:text-[#E8E8E4]">
              {label}
            </a>
          ))}
        </nav>
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="flex border border-[rgba(232,232,228,.28)] text-[12px] font-semibold" aria-label="Language selector">
            {languages.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => setLanguage(item.code)}
                className={`px-2 py-2 transition-colors sm:px-2.5 ${language === item.code ? "bg-[#E8E8E4] text-[#15181C]" : "text-[#E8E8E4]/65 hover:text-[#E8E8E4]"}`}
                aria-pressed={language === item.code}
                title={item.name}
              >
                {item.label}
              </button>
            ))}
          </div>
          <a href="#contact" className="inline-flex items-center justify-center border border-[rgba(232,232,228,.4)] px-3 py-2 text-sm font-semibold text-[#E8E8E4] transition-colors hover:bg-[#E8E8E4] hover:text-[#15181C] sm:px-5">
            <span className="hidden sm:inline">{t.nav.start}</span>
            <span className="sm:hidden" aria-hidden="true">↗</span>
            <span className="sr-only sm:hidden">{t.nav.start}</span>
          </a>
        </div>
      </div>
    </header>
  );
}
