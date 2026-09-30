import { useEffect, useMemo, useState } from "react";
import { LanguageContext } from "./languageContextCore.js";
import { translations } from "./translations.js";

const defaultLanguage = "en";

function getInitialLanguage() {
  const saved = window.localStorage.getItem("nickolas-language");
  return translations[saved] ? saved : defaultLanguage;
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);
  const value = useMemo(() => ({ language, setLanguage, t: translations[language] }), [language]);

  useEffect(() => {
    window.localStorage.setItem("nickolas-language", language);
    document.documentElement.lang = language;
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
