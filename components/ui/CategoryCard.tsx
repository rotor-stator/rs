"use client";

import Link from "next/link";
import { useLocale } from "next-intl";

interface Props {
  href: string;
  title: string;
  description: string;
  icon: "stator" | "rotor";
}

function StatorIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <rect x="8" y="8" width="48" height="48" rx="4" stroke="currentColor" strokeWidth="2.5" fill="none"/>
      <ellipse cx="32" cy="32" rx="16" ry="16" stroke="currentColor" strokeWidth="2.5" fill="none"/>
      <ellipse cx="32" cy="32" rx="6" ry="6" stroke="currentColor" strokeWidth="2" fill="none"/>
      <line x1="32" y1="8" x2="32" y2="16" stroke="currentColor" strokeWidth="2.5"/>
      <line x1="32" y1="48" x2="32" y2="56" stroke="currentColor" strokeWidth="2.5"/>
      <line x1="8" y1="32" x2="16" y2="32" stroke="currentColor" strokeWidth="2.5"/>
      <line x1="48" y1="32" x2="56" y2="32" stroke="currentColor" strokeWidth="2.5"/>
    </svg>
  );
}

function RotorIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="32" rx="10" ry="22" stroke="currentColor" strokeWidth="2.5" fill="none"/>
      <line x1="32" y1="4" x2="32" y2="60" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3"/>
      <path d="M22 18 Q32 10 42 18" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M22 32 Q32 24 42 32" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M22 46 Q32 38 42 46" stroke="currentColor" strokeWidth="2" fill="none"/>
    </svg>
  );
}

export default function CategoryCard({ href, title, description, icon }: Props) {
  const locale = useLocale();

  return (
    <Link
      href={`/${locale}/${href}`}
      style={{ textDecoration: "none" }}
    >
      <div
        style={{
          border: "2px solid var(--color-rs-border)",
          borderRadius: 4,
          padding: "48px 36px",
          textAlign: "center",
          cursor: "pointer",
          transition: "border-color 0.15s, box-shadow 0.15s",
          backgroundColor: "#fff",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = "var(--color-rs-orange)";
          el.style.boxShadow = "0 4px 24px rgba(212,98,26,0.12)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = "var(--color-rs-border)";
          el.style.boxShadow = "none";
        }}
      >
        <div
          style={{
            color: "var(--color-rs-orange)",
            marginBottom: 20,
            display: "flex",
            justifyContent: "center",
          }}
        >
          {icon === "stator" ? <StatorIcon /> : <RotorIcon />}
        </div>
        <h2
          style={{
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "var(--color-rs-ink)",
            margin: "0 0 10px",
          }}
        >
          {title}
        </h2>
        <p
          style={{
            fontSize: 14,
            color: "var(--color-rs-mid)",
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          {description}
        </p>
      </div>
    </Link>
  );
}
