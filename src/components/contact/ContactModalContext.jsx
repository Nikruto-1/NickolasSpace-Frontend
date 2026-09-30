import { useEffect, useState } from "react";
import useLanguage from "../../i18n/useLanguage.js";
import { ContactModalContext } from "./contactModalCore.js";

const contactLinks = [
  { key: "instagram", href: "https://www.instagram.com/nickolas_space/" },
  { key: "telegram", href: "https://t.me/nickolas_space" },
];

export function ContactModalProvider({ children }) {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <ContactModalContext.Provider value={{ openContactModal: () => setOpen(true) }}>
      {children}
      {open ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-5 py-8" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">
          <button type="button" className="absolute inset-0 bg-[#15181C]/75 backdrop-blur-sm" aria-label={t.contactModal.close} onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-lg border bd bg-[#15181C] p-6 text-[#E8E8E4] shadow-2xl md:p-8">
            <button
              type="button"
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center border border-[rgba(232,232,228,.22)] text-xl text-[#E8E8E4]/70 transition-colors hover:border-[#E8E8E4] hover:text-[#E8E8E4]"
              aria-label={t.contactModal.close}
              onClick={() => setOpen(false)}
            >
              ×
            </button>
            <p className="text-sm font-semibold text-[#9DB2C5]">{t.contactModal.eyebrow}</p>
            <h2 id="contact-modal-title" className="mt-3 pr-10 text-3xl font-bold tracking-tight md:text-4xl">
              {t.contactModal.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#E8E8E4]/70 md:text-lg">{t.contactModal.text}</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {contactLinks.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex min-h-20 items-center justify-between border border-[rgba(232,232,228,.24)] bg-[#1E242A] px-5 py-4 text-lg font-semibold transition-colors hover:bg-[#E8E8E4] hover:text-[#15181C]"
                  onClick={() => setOpen(false)}
                >
                  {t.contactModal[item.key]}
                  <span className="ml-4 text-3xl leading-none transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </ContactModalContext.Provider>
  );
}
