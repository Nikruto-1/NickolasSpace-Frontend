import { useEffect, useSyncExternalStore } from "react";
import { defaultPortfolioState, normalizePortfolioState } from "./portfolioState.js";

const listeners = new Set();
let snapshot;
const getSnapshot = () => snapshot ??= normalizePortfolioState(window.history.state?.portfolio, window.location.search);
const getServerSnapshot = () => defaultPortfolioState;

function subscribe(listener) {
  listeners.add(listener);
  const restore = () => {
    snapshot = undefined;
    listeners.forEach((notify) => notify());
  };
  window.addEventListener("popstate", restore);
  window.addEventListener("pageshow", restore);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("popstate", restore);
    window.removeEventListener("pageshow", restore);
  };
}

export default function usePortfolioState() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    const saved = window.history.state?.portfolio;
    if (!Number.isFinite(saved?.offset)) return undefined;
    const frame = window.requestAnimationFrame(() => {
      const work = document.getElementById("work");
      window.scrollTo({ top: window.scrollY + work.getBoundingClientRect().top - saved.offset, behavior: "instant" });
      document.getElementById(saved.focus)?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const update = (next) => {
    snapshot = normalizePortfolioState({ ...getSnapshot(), ...next });
    listeners.forEach((notify) => notify());
  };
  return [state, update];
}
