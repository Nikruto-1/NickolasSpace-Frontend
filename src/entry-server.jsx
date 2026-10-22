import { renderToString } from "react-dom/server";
import App from "./App.jsx";
import { LanguageProvider } from "./i18n/LanguageContext.jsx";

export function render(route = null) {
  return renderToString(<LanguageProvider pageLanguage={route?.language}><App projectRoute={route} /></LanguageProvider>);
}
