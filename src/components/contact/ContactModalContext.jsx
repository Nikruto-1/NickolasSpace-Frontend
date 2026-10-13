import { useEffect, useRef, useState } from "react";
import useLanguage from "../../i18n/useLanguage.js";
import { ContactModalContext } from "./contactModalCore.js";

const contactLinks = [
  { key: "instagram", href: "https://www.instagram.com/nickolas_space/" },
  { key: "telegram", href: "https://t.me/nickolas_space" },
  { key: "email", href: "mailto:kkosmacevskij@gmail.com", detail: "kkosmacevskij@gmail.com" },
];

export function ContactModalProvider({ children }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (!open) return undefined;
    const trigger = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const focusable = () => [...panelRef.current.querySelectorAll('button, a[href]')];
    focusable()[0]?.focus({ preventScroll: true });

    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab") return;
      const elements = focusable();
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <ContactModalContext.Provider value={{ openContactModal: () => setOpen(true) }}>
      <div inert={open ? true : undefined}>{children}</div>
      {open ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-5 py-8" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title" aria-describedby="contact-modal-description">
          <button type="button" tabIndex={-1} aria-hidden="true" className="absolute inset-0 bg-[#15181C]/75 backdrop-blur-sm" aria-label={t.contactModal.close} onClick={() => setOpen(false)} />
          <div ref={panelRef} className="relative max-h-[calc(100dvh-4rem)] w-full max-w-lg overflow-y-auto border bd bg-[#15181C] p-6 text-[#E8E8E4] shadow-2xl md:p-8">
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
            <p id="contact-modal-description" className="mt-4 text-base leading-relaxed text-[#E8E8E4]/70 md:text-lg">{t.contactModal.text}</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {contactLinks.map((item) => {
                const isEmail = item.key === "email";
                const className = `group flex min-h-20 items-center justify-between border border-[rgba(232,232,228,.24)] bg-[#1E242A] px-5 py-4 text-left text-lg font-semibold transition-colors hover:border-[#8A9BAA] hover:bg-[#2A323A] ${isEmail ? "sm:col-span-2" : ""}`;
                const content = (
                  <>
                    <span className="flex min-w-0 flex-col gap-1">
                      <span>{t.contactModal[item.key]}</span>
                      {item.detail ? <span className="break-all text-sm font-medium text-[#E8E8E4]/75">{item.detail}</span> : null}
                    </span>
                    <span className="ml-4 text-3xl leading-none transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
                  </>
                );

                return (
                  <a key={item.key} href={item.href} target={isEmail ? undefined : "_blank"} rel={isEmail ? undefined : "noreferrer"} className={className} onClick={() => setOpen(false)}>
                    {content}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </ContactModalContext.Provider>
  );
}
