"use client";

import { useTranslations } from "next-intl";

function PartIllustration() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 320 320"
      fill="none"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id="rsStatorFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2B3140" />
          <stop offset="100%" stopColor="#141820" />
        </linearGradient>
      </defs>

      {/* Stator bore */}
      <rect
        x="30"
        y="110"
        width="260"
        height="100"
        rx="50"
        fill="url(#rsStatorFill)"
        stroke="#C8CDD7"
        strokeWidth="2"
      />
      {/* Thread guide lines to suggest a helical bore */}
      {[70, 110, 150, 190, 230, 270].map((x) => (
        <path
          key={x}
          d={`M ${x} 112 Q ${x + 20} 160 ${x} 208`}
          stroke="#3A4254"
          strokeWidth="1.5"
          fill="none"
        />
      ))}
      {/* Rotor, offset eccentrically inside the bore */}
      <circle
        cx="120"
        cy="160"
        r="46"
        fill="none"
        stroke="var(--color-rs-orange)"
        strokeWidth="4"
      />
      <circle cx="120" cy="160" r="8" fill="var(--color-rs-orange)" />
    </svg>
  );
}

export default function Hero() {
  const t = useTranslations("home");

  function scrollToSelector() {
    document
      .getElementById("part-selector")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section
      style={{
        backgroundColor: "var(--color-rs-white)",
        borderBottom: "1px solid var(--color-rs-light)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "88px 24px",
          display: "grid",
          gridTemplateColumns: "minmax(0, 55fr) minmax(0, 45fr)",
          gap: 56,
          alignItems: "center",
        }}
        className="rs-hero-grid"
      >
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <span
            style={{
              display: "inline-block",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--color-rs-orange)",
              marginBottom: 20,
            }}
          >
            {t("heroEyebrow")}
          </span>

          <h1
            style={{
              fontSize: "clamp(40px, 6vw, 72px)",
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
              color: "var(--color-rs-ink)",
              margin: 0,
            }}
          >
            {t("heroTitle")}
          </h1>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginTop: 14,
              marginBottom: 28,
            }}
          >
            <span style={{ width: 36, height: 2, backgroundColor: "var(--color-rs-orange)" }} />
            <span
              style={{
                fontSize: "clamp(16px, 2vw, 20px)",
                fontWeight: 600,
                letterSpacing: "0.04em",
                color: "var(--color-rs-orange)",
              }}
            >
              {t("heroTitleAccent")}
            </span>
          </div>

          <p
            style={{
              fontSize: 17,
              lineHeight: 1.65,
              color: "var(--color-rs-mid)",
              maxWidth: 480,
              margin: "0 0 40px",
            }}
          >
            {t("heroTagline")}
          </p>

          <button
            onClick={scrollToSelector}
            style={{
              alignSelf: "flex-start",
              padding: "18px 36px",
              backgroundColor: "var(--color-rs-ink)",
              color: "#fff",
              border: "none",
              borderRadius: 2,
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              transition: "background-color 0.2s, transform 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--color-rs-orange)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--color-rs-ink)";
            }}
          >
            {t("heroCta")} →
          </button>
        </div>

        {/* Right column — device mockup frame */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 360,
          }}
        >
          {/* Glow */}
          <div
            style={{
              position: "absolute",
              width: "70%",
              height: "70%",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(212,98,26,0.22) 0%, rgba(212,98,26,0) 70%)",
              filter: "blur(20px)",
              zIndex: 0,
            }}
          />
          {/* Device frame */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              width: "100%",
              maxWidth: 420,
              aspectRatio: "1 / 1",
              padding: 18,
              borderRadius: 32,
              background: "linear-gradient(155deg, #2B3140, #141820)",
              boxShadow: "0 30px 60px -20px rgba(20,24,32,0.35)",
              transform: "perspective(1200px) rotateY(-8deg) rotateX(3deg)",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 20,
                backgroundColor: "#F0F2F5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                padding: 24,
              }}
            >
              <PartIllustration />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .rs-hero-grid {
            grid-template-columns: 1fr !important;
            padding-top: 56px !important;
            padding-bottom: 56px !important;
          }
        }
      `}</style>
    </section>
  );
}
