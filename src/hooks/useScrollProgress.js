import { useEffect, useState } from "react";
import { getProcessProgress } from "./processProgress.js";

export default function useScrollProgress(ref) {
  const [progress, setProgress] = useState({ activeIndex: 0, progressByStep: [] });

  useEffect(() => {
    const list = ref.current;
    if (!list) return undefined;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const bounds = [...list.children].map((step) => step.getBoundingClientRect());
      setProgress(getProcessProgress(bounds, Math.max(128, window.innerHeight * 0.45)));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };
    // Translation changes, loaded fonts and viewport changes can resize each step.
    const observer = new window.ResizeObserver(onScroll);
    observer.observe(list);
    [...list.children].forEach((step) => observer.observe(step));
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref]);

  return progress;
}
