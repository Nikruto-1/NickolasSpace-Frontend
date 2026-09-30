import { useEffect, useState } from "react";

export default function useScrollProgress(ref) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;

      const viewportHeight = window.innerHeight;
      setProgress(Math.min(1, Math.max(0, (viewportHeight * 0.6 - rect.top) / rect.height)));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ref]);

  return progress;
}
