import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { languages } from "../i18n/translations.js";
import useLanguage from "../i18n/useLanguage.js";
import ContactButton from "./contact/ContactButton.jsx";

export default function Header() {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
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
    <header onKeyDown={(event) => {
      if (event.key === "Escape" && menuOpen) { setMenuOpen(false); menuRef.current?.focus(); }
    }} className={`fixed inset-x-0 top-0 z-50 text-paper transition-colors duration-200 ${solid || menuOpen ? "border-b bd bg-deep/95 backdrop-blur-md" : "bg-deep/95"}`}>
      <a href="#main-content" className="skip-link">{t.nav.skip}</a>
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-2 px-3 py-4 sm:gap-3 sm:px-6 md:px-12 md:py-5">
        <a href="#top" className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold sm:gap-2 sm:text-lg" onClick={() => setMenuOpen(false)}>
          <img src="./assets/logo-96.webp" alt="" width="96" height="96" className="h-7 w-8 shrink-0 object-contain object-left sm:h-9 sm:w-12" />
          <span>NickolasSpace</span>
        </a>
        <nav aria-label={t.nav.navigation} className="hidden gap-6 text-[15px] xl:flex">
          {links.map(([label, href]) => (
            <a key={label} href={href} className="text-mist transition-colors hover:text-accent">
              {label}
            </a>
          ))}
        </nav>
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div role="group" className="flex gap-0.5 rounded-md bg-paper/5 p-1 text-[12px] font-medium" aria-label={t.nav.language}>
            {languages.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => setLanguage(item.code)}
                className={`min-h-9 rounded px-1.5 py-2 transition-colors sm:px-2.5 ${language === item.code ? "bg-accent/15 text-accent" : "text-mist hover:text-paper"}`}
                aria-pressed={language === item.code}
                title={item.name}
              >
                {item.label}
              </button>
            ))}
          </div>
          <ContactButton className="hidden border border-control !bg-transparent !px-5 !py-2 text-sm !text-paper hover:!bg-paper/5 sm:inline-flex">
            <span className="hidden sm:inline">{t.nav.start}</span>
            <ArrowUpRight className="sm:hidden" size={18} aria-hidden="true" />
            <span className="sr-only sm:hidden">{t.nav.start}</span>
          </ContactButton>
          <button ref={menuRef} type="button" aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu} title={menuOpen ? t.nav.closeMenu : t.nav.openMenu} onClick={() => setMenuOpen(!menuOpen)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-paper hover:bg-paper/5 xl:hidden">
            {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>
      {menuOpen && <nav id="mobile-navigation" aria-label={t.nav.navigation} className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-t bd bg-deep px-6 py-4 xl:hidden">
        {links.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)} className="block rounded-md py-3 text-mist hover:text-accent">{label}</a>)}
        <div className="mt-3 flex items-center justify-between gap-3 border-t bd pt-4">
          <ContactButton onClick={() => { setMenuOpen(false); menuRef.current?.focus(); }}>{t.nav.start}</ContactButton>
        </div>
      </nav>}
    </header>
  );
}
