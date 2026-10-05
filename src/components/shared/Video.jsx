import { useEffect, useRef } from "react";

function BasicVideo({ src, poster, className = "" }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

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
    frameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameId);
      video.removeEventListener("canplay", play);
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      className={`absolute inset-0 h-full w-full object-cover will-change-transform ${className}`}
      src={src}
      poster={poster}
      autoPlay
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
    />
  );
}

function CrossfadeVideo({ src, poster, className = "" }) {
  const firstRef = useRef(null);
  const secondRef = useRef(null);
  const activeRef = useRef(0);
  const transitionRef = useRef(false);
  const frameRef = useRef(0);

  useEffect(() => {
    const videos = [firstRef.current, secondRef.current];
    if (!videos[0] || !videos[1]) return undefined;

    activeRef.current = 0;
    transitionRef.current = false;

    videos.forEach((video, index) => {
      video.currentTime = 0;
      video.style.opacity = index === 0 ? "1" : "0";
      video.pause();
    });

    const play = (video) => video.play().catch(() => {});
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

          window.setTimeout(() => {
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
      videos.forEach((video) => video.pause());
    };
  }, [src]);

  const videoClass = `absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-linear will-change-opacity ${className}`;

  return (
    <>
      <video ref={firstRef} className={videoClass} src={src} poster={poster} autoPlay muted playsInline preload="auto" aria-hidden="true" />
      <video ref={secondRef} className={videoClass} src={src} muted playsInline preload="auto" aria-hidden="true" />
    </>
  );
}

export default function Video({ smoothLoop = false, ...props }) {
  return smoothLoop ? <CrossfadeVideo {...props} /> : <BasicVideo {...props} />;
}
