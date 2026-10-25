export default function PhoneMockup({ screen, label, loading = "lazy" }) {
  return (
    <span className="phone-stage">
      <span className="phone-mockup">
        <span className="phone-screen">
          <span className="phone-camera" aria-hidden="true" />
          <img src={screen.src} alt={label} width={screen.width} height={screen.height} loading={loading} decoding="async" draggable={false} />
        </span>
      </span>
    </span>
  );
}
