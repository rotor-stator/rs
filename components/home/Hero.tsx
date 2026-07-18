"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";

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
          <h1
            style={{
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
              color: "var(--color-rs-ink)",
              margin: "0 0 28px",
            }}
          >
            {t("heroTitle")}
          </h1>

          <p
            style={{
              fontSize: 17,
              lineHeight: 1.65,
              color: "var(--color-rs-mid)",
              maxWidth: 480,
              margin: "0 0 40px",
            }}
          >
            <span style={{ display: "block" }}>{t("heroTaglineLine1")}</span>
            <span style={{ display: "block", marginTop: "0.85em" }}>
              {t("heroTaglineLine2")}
            </span>
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
          {/* Device frame — aspect ratio matches head-pic.png's native 1536×870 */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              width: "100%",
              maxWidth: 480,
              aspectRatio: "1536 / 870",
              padding: 18,
              borderRadius: 32,
              background: "linear-gradient(155deg, #2B3140, #141820)",
              boxShadow: "0 30px 60px -20px rgba(20,24,32,0.35)",
              transform: "perspective(1200px) rotateY(-8deg) rotateX(3deg)",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                borderRadius: 20,
                backgroundColor: "#F0F2F5",
                overflow: "hidden",
              }}
            >
              <Image
                src="/head-pic.png"
                alt="OEM-grade replacement rotor and stator"
                fill
                style={{ objectFit: "contain" }}
                sizes="(max-width: 860px) 90vw, 480px"
                priority
              />
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
