import { useEffect, useRef, useState } from "react";
import useLanguage from "../../i18n/useLanguage.js";
import { ContactModalContext } from "./contactModalCore.js";
import { ArrowUpRight, X } from "lucide-react";

const contactLinks = [
  { key: "instagram", href: "https://www.instagram.com/nickolas_space/" },
  { key: "telegram", href: "https://t.me/nickolas_space" },
  { key: "email", href: "mailto:kkosmacevskij@gmail.com", detail: "kkosmacevskij@gmail.com" },
];

export function ContactModalProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [project, setProject] = useState(null);
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
    <ContactModalContext.Provider value={{ openContactModal: (projectName = null) => {
      setProject(projectName);
      setOpen(true);
    } }}>
      <div inert={open ? true : undefined}>{children}</div>
      {open ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-5 py-8" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title" aria-describedby="contact-modal-description">
          <div className="absolute inset-0 bg-ink/85 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div ref={panelRef} className="relative max-h-[calc(100dvh-4rem)] w-full max-w-lg overflow-y-auto rounded-lg border bd bg-ink p-6 text-paper shadow-2xl md:p-8">
            <button
              type="button"
              className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full text-mist transition-colors hover:bg-paper/5 hover:text-paper"
              aria-label={t.contactModal.close}
              title={t.contactModal.close}
              onClick={() => setOpen(false)}
            >
              <X size={20} aria-hidden="true" />
            </button>
            <p className="text-sm font-medium text-accent">{t.contactModal.eyebrow}</p>
            <h2 id="contact-modal-title" className="display mt-3 pr-10 text-2xl md:text-3xl">
              {t.contactModal.title}
            </h2>
            <p id="contact-modal-description" className="mt-4 text-base leading-relaxed text-mist">{t.contactModal.text}</p>
            {project && <p className="mt-4 border-l-2 border-accent pl-3 text-base text-accent">{t.work.discussSimilar}: {project}</p>}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {contactLinks.map((item) => {
                const isEmail = item.key === "email";
                const className = `group flex min-h-20 items-center justify-between rounded-md border border-control bg-ink2 px-5 py-4 text-left text-base font-medium transition-colors hover:border-accent hover:bg-accent/10 ${isEmail ? "sm:col-span-2" : ""}`;
                const content = (
                  <>
                    <span className="flex min-w-0 flex-col gap-1">
                      <span>{t.contactModal[item.key]}</span>
                      {item.detail ? <span className="break-all text-sm font-normal text-mist">{item.detail}</span> : null}
                    </span>
                    <ArrowUpRight size={18} className="ml-4 shrink-0" aria-hidden="true" />
                  </>
                );

                return (
                  <a key={item.key} href={isEmail && project ? `${item.href}?subject=${encodeURIComponent(`${t.work.discussSimilar}: ${project}`)}` : item.href} target={isEmail ? undefined : "_blank"} rel={isEmail ? undefined : "noreferrer"} className={className} onClick={() => setOpen(false)}>
                    {content}
                  </a>
                );
              })}
            </div>
            <a href={t.footer.privacyUrl} className="mt-6 inline-block py-2 text-sm text-mist underline underline-offset-4 hover:text-paper">{t.footer.privacy}</a>
          </div>
        </div>
      ) : null}
    </ContactModalContext.Provider>
  );
}
