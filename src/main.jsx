import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { LanguageProvider } from "./i18n/LanguageContext.jsx";
import "./styles/global.css";
import { projectRoute } from "./data/projectRoutes.js";

const root = document.getElementById("root");
const route = projectRoute(window.location.pathname);
const app = (
  <React.StrictMode>
    <LanguageProvider pageLanguage={route?.language}>
      <App projectRoute={route} />
    </LanguageProvider>
  </React.StrictMode>
);

if (root.dataset.prerendered) {
  ReactDOM.hydrateRoot(root, app);
} else {
  ReactDOM.createRoot(root).render(app);
}
