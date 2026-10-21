import { useId } from "react";

export default function DeviceMockup({ src, label }) {
  const maskId = useId();

  return (
    <svg viewBox="0 0 836 607" width="836" height="607" role="img" aria-label={label} className="h-full w-full">
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="836" height="607" style={{ maskType: "alpha" }}>
          <image href="./assets/autoalex-device-mask.svg" x="-49.92" y="-163.92" width="934.353" height="934.353" />
        </mask>
      </defs>
      <image href={src} width="836" height="607" mask={`url(#${maskId})`} />
    </svg>
  );
}
