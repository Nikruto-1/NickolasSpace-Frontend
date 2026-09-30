import useLanguage from "../i18n/useLanguage.js";

const nav = [
  ["services", "#services"],
  ["work", "#work"],
  ["process", "#process"],
  ["contact", "#contact"],
];

const social = [
  ["Instagram", "https://www.instagram.com/nickolas_space/"],
  ["TikTok", "https://www.tiktok.com/@nickolas_space"],
  ["Threads", "https://www.threads.com/@nickolas_space"],
  ["Telegram", "https://t.me/nickolas_space"],
  ["LinkedIn", "https://www.linkedin.com/in/nickolas-kosmachevskyi-665a1840a/"],
  ["Email", "mailto:kkosmacevskij@gmail.com"],
];

export default function Footer() {
  const { t } = useLanguage();
  const colClass = "flex flex-col gap-3 text-paper/70 [&_a]:transition-colors [&_a:hover]:text-paper";

  return (
    <footer id="contact" className="bg-ink">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-6 py-20 md:grid-cols-4 md:px-12">
        <div className="md:col-span-2">
          <a href="#top" className="inline-flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center border border-[rgba(232,232,228,.18)] bg-[#1E2329]">
              <img src="./favicon.svg" alt="" className="h-9 w-9" />
            </span>
            <span className="text-2xl font-bold tracking-tight">NickolasSpace</span>
          </a>
          <p className="mt-3 max-w-xs text-paper/60">{t.footer.tagline}</p>
        </div>
        <nav className={colClass}>
          {nav.map(([key, href]) => (
            <a key={key} href={href}>
              {t.nav[key]}
            </a>
          ))}
        </nav>
        <div className={colClass}>
          <p className="font-semibold text-paper">Social Media & Contacts</p>
          {social.map(([label, href]) => (
            <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined}>
              {label}
            </a>
          ))}
        </div>
      </div>
      <div className="mx-auto flex max-w-[1400px] justify-between border-t bd px-6 py-6 text-sm text-paper/50 md:px-12">
        <span>© {new Date().getFullYear()} NickolasSpace</span>
        <a href="#" className="hover:text-paper">
          {t.footer.privacy}
        </a>
      </div>
    </footer>
  );
}
