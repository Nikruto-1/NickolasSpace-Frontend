import { projectSlugs } from "../data/projectRoutes.js";

export const defaultPortfolioState = { active: 0, screens: [0, 0] };

export function normalizePortfolioState(value, search = "") {
  const requested = projectSlugs.indexOf(new URLSearchParams(search).get("project"));
  const active = value?.active ?? requested;
  return {
    active: active === 1 ? 1 : 0,
    screens: [0, 1].map((index) => {
      const screen = value?.screens?.[index];
      return Number.isInteger(screen) && screen >= 0 && screen < (index === 0 ? 3 : 2) ? screen : 0;
    }),
  };
}

export function isPlainNavigation(event) {
  return !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

export function openProject(event, href, state) {
  if (!isPlainNavigation(event)) return;
  event.preventDefault();
  const work = document.getElementById("work");
  window.history.replaceState({
    ...window.history.state,
    portfolio: { ...state, offset: work.getBoundingClientRect().top, focus: `project-details-${state.active}` },
  }, "");
  window.location.assign(`${href}?from=portfolio`);
}

export function switchProjectLanguage(event, href) {
  if (!isPlainNavigation(event)) return;
  event.preventDefault();
  // Keep the case in one history entry so Back still returns to the portfolio.
  window.history.replaceState(window.history.state, "", href);
  window.location.reload();
}
