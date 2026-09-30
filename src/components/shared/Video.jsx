export default function Video({ src, poster, className = "" }) {
  return (
    <video
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
    />
  );
}
