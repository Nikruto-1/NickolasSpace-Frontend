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
  const colClass = "flex flex-col gap-3 text-mist [&_a]:transition-colors [&_a:hover]:text-accent";

  return (
    <footer id="contact" className="bg-deep">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-6 py-20 md:grid-cols-4 md:px-12">
        <div className="md:col-span-2">
          <a href="#top" aria-label="NickolasSpace" className="inline-flex flex-col items-start">
            <img src="./assets/logo-480.webp" alt="" width="480" height="480" loading="lazy" decoding="async" className="h-24 w-44 object-contain object-left md:h-32 md:w-60" />
            <span className="-mt-2 text-2xl font-semibold text-paper md:text-3xl">NickolasSpace</span>
          </a>
          <p className="mt-3 max-w-xs text-mist">{t.footer.tagline}</p>
        </div>
        <nav className={colClass} aria-label={t.nav.navigation}>
          {nav.map(([key, href]) => (
            <a key={key} href={href}>
              {t.nav[key]}
            </a>
          ))}
        </nav>
        <div className={colClass}>
          <p className="font-medium text-paper">{t.footer.social}</p>
          {social.map(([label, href]) => (
            <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined}>
              {label}
            </a>
          ))}
        </div>
      </div>
      <div className="mx-auto flex max-w-[1400px] flex-wrap justify-between gap-4 border-t bd px-6 py-6 text-sm text-mist md:px-12">
        <span>© {new Date().getFullYear()} NickolasSpace</span>
        <a href={t.footer.privacyUrl} className="hover:text-paper">
          {t.footer.privacy}
        </a>
      </div>
    </footer>
  );
}
