import { useContext, useEffect, useRef, useState } from "react";
import { MotionContext } from "./motionContext.js";

function BasicVideo({ src, poster, active, className = "" }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    if (!active) {
      video.pause();
      return undefined;
    }

    let frameId = 0;
    let seekingToStart = false;

    const tick = () => {
      if (video.duration && !video.paused && !video.seeking) {
        const remaining = video.duration - video.currentTime;

        if (remaining < 0.18 && !seekingToStart) {
          seekingToStart = true;
          video.currentTime = 0.04;
          video.play().catch(() => {});
        }

        if (video.currentTime > 0.2) {
          seekingToStart = false;
        }
      }

      frameId = window.requestAnimationFrame(tick);
    };

    const play = () => video.play().catch(() => {});

    video.addEventListener("canplay", play);
    play();
    frameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameId);
      video.removeEventListener("canplay", play);
      video.pause();
    };
  }, [src, active]);

  return (
    <video
      ref={videoRef}
      className={`absolute inset-0 h-full w-full object-cover will-change-transform ${className}`}
      src={src}
      poster={poster}
      muted
      playsInline
      preload="none"
      aria-hidden="true"
    />
  );
}

function CrossfadeVideo({ src, poster, active: isActive, className = "" }) {
  const firstRef = useRef(null);
  const secondRef = useRef(null);
  const activeRef = useRef(0);
  const transitionRef = useRef(false);
  const frameRef = useRef(0);

  useEffect(() => {
    const videos = [firstRef.current, secondRef.current];
    if (!videos[0] || !videos[1]) return undefined;
    if (!isActive) {
      videos.forEach((video) => video.pause());
      return undefined;
    }
    let timeoutId;

    activeRef.current = 0;
    transitionRef.current = false;

    videos.forEach((video, index) => {
      video.currentTime = 0;
      video.style.opacity = index === 0 ? "1" : "0";
      video.pause();
    });

    const play = (video) => video.play().catch(() => {});
    const onCanPlay = () => play(videos[activeRef.current]);
    videos.forEach((video) => video.addEventListener("canplay", onCanPlay));
    play(videos[0]);

    const tick = () => {
      const active = videos[activeRef.current];
      const standbyIndex = activeRef.current === 0 ? 1 : 0;
      const standby = videos[standbyIndex];

      if (active.duration && !active.paused && !active.seeking) {
        const remaining = active.duration - active.currentTime;

        if (remaining < 0.75 && !transitionRef.current) {
          transitionRef.current = true;
          standby.currentTime = 0;
          play(standby);
          standby.style.opacity = "1";
          active.style.opacity = "0";

          timeoutId = window.setTimeout(() => {
            active.pause();
            active.currentTime = 0;
            activeRef.current = standbyIndex;
            transitionRef.current = false;
          }, 700);
        }
      }

      frameRef.current = window.requestAnimationFrame(tick);
    };

    frameRef.current = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameRef.current);
      window.clearTimeout(timeoutId);
      videos.forEach((video) => {
        video.pause();
        video.removeEventListener("canplay", onCanPlay);
      });
    };
  }, [src, isActive]);

  const videoClass = `absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-linear will-change-opacity ${className}`;

  return (
    <>
      <video ref={firstRef} className={videoClass} src={src} poster={poster} muted playsInline preload="none" aria-hidden="true" />
      <video ref={secondRef} className={videoClass} src={src} muted playsInline preload="none" aria-hidden="true" />
    </>
  );
}

export default function Video({ smoothLoop = false, src, ...props }) {
  const containerRef = useRef(null);
  const [status, setStatus] = useState({ loaded: false, active: false });
  const [visible, setVisible] = useState(true);
  const { paused } = useContext(MotionContext);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = window.navigator.connection;
    const limitedConnection = () => connection?.saveData || ["slow-2g", "2g"].includes(connection?.effectiveType);
    const observer = new IntersectionObserver(([entry]) => {
      const active = entry.isIntersecting && !reducedMotion.matches && !limitedConnection();
      setStatus((previous) => ({ loaded: previous.loaded || active, active }));
    }, { rootMargin: "200px" });
    observer.observe(containerRef.current);
    const onVisibility = () => setVisible(document.visibilityState !== "hidden");
    const onMotionChange = () => {
      observer.unobserve(containerRef.current);
      observer.observe(containerRef.current);
    };
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    reducedMotion.addEventListener("change", onMotionChange);
    connection?.addEventListener("change", onMotionChange);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reducedMotion.removeEventListener("change", onMotionChange);
      connection?.removeEventListener("change", onMotionChange);
    };
  }, []);

  const VideoPlayer = smoothLoop ? CrossfadeVideo : BasicVideo;
  return (
    <div ref={containerRef} className="absolute inset-0" aria-hidden="true">
      <VideoPlayer {...props} src={status.loaded && !paused ? src : undefined} active={status.active && visible && !paused} />
    </div>
  );
}
