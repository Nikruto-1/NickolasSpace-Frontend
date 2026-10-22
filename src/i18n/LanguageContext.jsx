import { useEffect, useMemo, useSyncExternalStore } from "react";
import { LanguageContext } from "./languageContextCore.js";
import { translations } from "./translations.js";

const defaultLanguage = "en";
const listeners = new Set();
let selectedLanguage;

function getLanguage() {
  if (!selectedLanguage) {
    try {
      const saved = window.localStorage.getItem("nickolas-language");
      selectedLanguage = translations[saved] ? saved : defaultLanguage;
    } catch {
      selectedLanguage = defaultLanguage;
    }
  }
  return selectedLanguage;
}

function setLanguage(language) {
  if (!translations[language]) return;
  selectedLanguage = language;
  try {
    window.localStorage.setItem("nickolas-language", language);
  } catch {
    // The language still works when browser storage is unavailable.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener) {
  listeners.add(listener);
  const onStorage = (event) => {
    if (event.key === "nickolas-language" || event.key === null) {
      selectedLanguage = undefined;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function LanguageProvider({ children, pageLanguage }) {
  const language = useSyncExternalStore(subscribe, () => pageLanguage || getLanguage(), () => pageLanguage || defaultLanguage);
  const value = useMemo(() => ({ language, setLanguage, t: translations[language] }), [language]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
