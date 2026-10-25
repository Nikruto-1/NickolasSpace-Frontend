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

  useEffect(() => {
    const videos = [firstRef.current, secondRef.current];
    if (!videos[0] || !videos[1]) return undefined;
    if (!isActive) {
      videos.forEach((video) => video.pause());
      return undefined;
    }
    let activeIndex = 0;
    let pending = false;
    let cancelled = false;
    let frameId;
    let timeoutId;
    let videoFrameId;
    let incomingVideo;
    let retryAfter = 0;

    videos.forEach((video, index) => {
      video.currentTime = 0;
      video.style.opacity = index === 0 ? "1" : "0";
      video.style.zIndex = index === 0 ? "1" : "0";
      video.pause();
    });

    const onCanPlay = () => {
      if (!cancelled) videos[activeIndex].play().catch(() => {});
    };
    videos[0].addEventListener("canplay", onCanPlay);
    onCanPlay();

    const crossfade = async (outgoing, incoming, nextIndex) => {
      pending = true;
      incomingVideo = incoming;
      try {
        incoming.currentTime = 0;
        await incoming.play();
        if (cancelled) return;
        // Keep the outgoing frame visible until the decoder presents its replacement.
        if (incoming.requestVideoFrameCallback) {
          await new Promise((resolve) => {
            videoFrameId = incoming.requestVideoFrameCallback(resolve);
          });
        } else if (incoming.readyState < 2 || incoming.seeking) {
          incoming.pause();
          pending = false;
          return;
        }
        if (cancelled) return;
        incoming.style.zIndex = "2";
        incoming.style.opacity = "1";
        // Only fade in the top layer, avoiding a dark dip between two fading layers.
        timeoutId = window.setTimeout(() => {
          outgoing.pause();
          outgoing.style.opacity = "0";
          outgoing.style.zIndex = "0";
          incoming.style.zIndex = "1";
          activeIndex = nextIndex;
          pending = false;
        }, 700);
      } catch {
        pending = false;
        retryAfter = window.performance.now() + 2000;
      }
    };

    const tick = () => {
      const active = videos[activeIndex];
      const standbyIndex = activeIndex === 0 ? 1 : 0;
      const standby = videos[standbyIndex];

      if (active.duration && !active.paused && !active.seeking) {
        const remaining = active.duration - active.currentTime;

        if (remaining < 1.2 && !pending && window.performance.now() >= retryAfter) {
          crossfade(active, standby, standbyIndex);
        }
      }
      // A slow standby decoder may outlast the clip; retain the final frame and retry.
      if (active.ended && !pending && window.performance.now() >= retryAfter) {
        crossfade(active, standby, standbyIndex);
      }

      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(timeoutId);
      if (videoFrameId !== undefined) incomingVideo?.cancelVideoFrameCallback(videoFrameId);
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

export default function Video({ smoothLoop = false, src, poster = src?.replace(/\.mp4$/, "-poster.webp"), ...props }) {
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
    <div ref={containerRef} className="absolute inset-0 isolate" aria-hidden="true">
      {poster && <img src={poster} alt="" width="1280" height="720" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />}
      <VideoPlayer {...props} poster={poster} src={status.loaded && !paused ? src : undefined} active={status.active && visible && !paused} />
    </div>
  );
}
