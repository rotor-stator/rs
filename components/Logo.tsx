interface LogoProps {
  /** "dark" = on dark backgrounds like the header/footer, "light" = on white content backgrounds */
  variant?: "dark" | "light";
  /** Renders only the icon glyph, no wordmark */
  iconOnly?: boolean;
  height?: number;
  className?: string;
}

/**
 * Icon glyph is a stylized cross-section of a progressing-cavity pump:
 * the stadium-shaped bore is the stator, the offset circle is the rotor
 * riding eccentrically inside it.
 */
function Glyph({ height, wordColor }: { height: number; wordColor: string }) {
  return (
    <svg
      width={height}
      height={height}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <rect
        x="4"
        y="14"
        width="40"
        height="20"
        rx="10"
        stroke={wordColor}
        strokeWidth="2.5"
      />
      <circle cx="18" cy="24" r="7" stroke="var(--color-rs-orange)" strokeWidth="2.5" />
    </svg>
  );
}

export default function Logo({
  variant = "light",
  iconOnly = false,
  height = 32,
  className,
}: LogoProps) {
  const wordColor = variant === "dark" ? "var(--color-rs-border)" : "var(--color-rs-ink)";

  return (
    <div
      className={className}
      style={{ display: "flex", alignItems: "center", gap: height * 0.3, height }}
    >
      <Glyph height={height} wordColor={wordColor} />
      {!iconOnly && (
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 800,
            fontSize: height * 0.5,
            letterSpacing: "0.02em",
            textTransform: "uppercase",
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ color: wordColor }}>Rotor</span>
          <span style={{ color: "var(--color-rs-orange)" }}>Stator</span>
        </span>
      )}
    </div>
  );
}
