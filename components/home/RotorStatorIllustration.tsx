export default function RotorStatorIllustration() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 400 400"
      fill="none"
      style={{ display: "block", overflow: "visible" }}
    >
      <defs>
        <linearGradient id="rsMetalBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3F4759" />
          <stop offset="50%" stopColor="#232833" />
          <stop offset="100%" stopColor="#10131A" />
        </linearGradient>
        <linearGradient id="rsMetalCap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#525A6C" />
          <stop offset="100%" stopColor="#262B36" />
        </linearGradient>
        <linearGradient id="rsBoreFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0B0D12" />
          <stop offset="100%" stopColor="#1B1F27" />
        </linearGradient>
        <radialGradient id="rsTopSheen" cx="32%" cy="18%" r="75%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.30" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="rsEdgeHighlight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
          <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="rsRimLight" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-rs-orange)" stopOpacity="0" />
          <stop offset="50%" stopColor="var(--color-rs-orange)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="var(--color-rs-orange)" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="rsShadowFade" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
        {/* Thin diagonal thread hint; the tile slides once per loop so the
            helix reads as a slowly, continuously turning rotor. */}
        <pattern id="rsHelixStripe" width="24" height="24" patternUnits="userSpaceOnUse">
          <line
            x1="0"
            y1="24"
            x2="24"
            y2="0"
            stroke="var(--color-rs-orange)"
            strokeWidth="1.6"
            strokeOpacity="0.4"
          />
          <animateTransform
            attributeName="patternTransform"
            type="translate"
            from="0 0"
            to="0 24"
            dur="9s"
            repeatCount="indefinite"
          />
        </pattern>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="200" cy="326" rx="128" ry="20" fill="url(#rsShadowFade)" />

      {/* Stator */}
      <path
        d="M100,180 A100,36 0 0,0 300,180 L300,290 A100,36 0 0,1 100,290 Z"
        fill="url(#rsMetalBody)"
        stroke="#4B5262"
        strokeWidth="1"
      />
      <line x1="100" y1="180" x2="100" y2="290" stroke="url(#rsEdgeHighlight)" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="200" cy="180" rx="100" ry="36" fill="url(#rsMetalCap)" stroke="#4B5262" strokeWidth="1.5" />
      <ellipse cx="200" cy="180" rx="66" ry="24" fill="url(#rsBoreFill)" stroke="#050608" strokeWidth="1" />
      {[150, 175, 200, 225, 250].map((x) => (
        <path
          key={x}
          d={`M ${x} 168 Q ${x + 6} 180 ${x} 192`}
          stroke="#3A4254"
          strokeWidth="1"
          fill="none"
          opacity="0.6"
        />
      ))}
      <ellipse cx="200" cy="180" rx="100" ry="36" fill="url(#rsTopSheen)" />
      <ellipse cx="160" cy="167" rx="16" ry="5" fill="#FFFFFF" opacity="0.16" />
      <path d="M100,180 A100,36 0 0,0 300,180" stroke="url(#rsRimLight)" strokeWidth="2" fill="none" opacity="0.85" />

      {/* Rotor, lifted and offset out of the stator bore */}
      <path
        d="M169,38 A46,17 0 0,0 261,38 L243,145 A28,10 0 0,1 187,145 Z"
        fill="url(#rsMetalBody)"
        stroke="#4B5262"
        strokeWidth="1"
      />
      <path
        d="M169,38 A46,17 0 0,0 261,38 L243,145 A28,10 0 0,1 187,145 Z"
        fill="url(#rsHelixStripe)"
        opacity="0.7"
      />
      <line x1="169" y1="38" x2="187" y2="145" stroke="url(#rsEdgeHighlight)" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="215" cy="145" rx="28" ry="10" fill="#171A21" stroke="#4B5262" strokeWidth="1" />
      <ellipse cx="215" cy="38" rx="46" ry="17" fill="url(#rsMetalCap)" stroke="#4B5262" strokeWidth="1.5" />
      <ellipse cx="215" cy="38" rx="46" ry="17" fill="url(#rsTopSheen)" />
      <ellipse cx="182" cy="30" rx="10" ry="4" fill="#FFFFFF" opacity="0.18" />
      <path d="M169,38 A46,17 0 0,0 261,38" stroke="url(#rsRimLight)" strokeWidth="1.6" fill="none" opacity="0.9" />
    </svg>
  );
}
