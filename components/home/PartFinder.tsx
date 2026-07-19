"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PartSearchBox from "@/components/search/PartSearchBox";
import { getManufacturers, ManufacturerSummary } from "@/lib/catalog";

export default function PartFinder() {
  const t = useTranslations("home");
  const locale = useLocale();
  const router = useRouter();

  const [manufacturers, setManufacturers] = useState<ManufacturerSummary[]>([]);

  useEffect(() => {
    getManufacturers().then(setManufacturers);
  }, []);

  const handleChangeQuery = useCallback(
    (query: string) => {
      // Prefetch the search route so "View all results" feels instant once typed.
      if (query.trim().length >= 2) router.prefetch(`/${locale}/search?q=${encodeURIComponent(query)}`);
    },
    [locale, router]
  );

  return (
    <section
      id="part-selector"
      style={{ backgroundColor: "var(--color-rs-light)", padding: "88px 0", scrollMarginTop: 24 }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2
            style={{
              fontSize: "clamp(26px, 3.4vw, 38px)",
              fontWeight: 800,
              letterSpacing: "-0.01em",
              textTransform: "uppercase",
              color: "var(--color-rs-ink)",
              margin: "0 0 12px",
            }}
          >
            {t("selectorTitle")}
          </h2>
          <p style={{ fontSize: 15, color: "var(--color-rs-mid)", margin: 0 }}>
            {t("selectorSubtitle")}
          </p>
        </div>

        <div style={{ maxWidth: 640, margin: "0 auto 28px" }}>
          <PartSearchBox onChangeQuery={handleChangeQuery} />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            maxWidth: 640,
            margin: "0 auto 40px",
          }}
        >
          <span style={{ flex: 1, height: 1, backgroundColor: "var(--color-rs-border)" }} />
          <span
            style={{
              fontSize: 12,
              fontStyle: "italic",
              color: "var(--color-rs-mid)",
              whiteSpace: "nowrap",
            }}
          >
            {t("browseByManufacturer")}
          </span>
          <span style={{ flex: 1, height: 1, backgroundColor: "var(--color-rs-border)" }} />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 16,
          }}
        >
          {manufacturers.map((m) => (
            <Link
              key={m.id}
              href={`/${locale}/search?manufacturer=${encodeURIComponent(m.slug)}`}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                padding: "24px 16px",
                border: "1.5px solid var(--color-rs-border)",
                borderRadius: 4,
                backgroundColor: "#fff",
                textDecoration: "none",
                transition: "border-color 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--color-rs-orange)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--color-rs-border)";
              }}
            >
              <span
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  backgroundColor: "var(--color-rs-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 15,
                  fontWeight: 800,
                  color: "var(--color-rs-mid)",
                }}
              >
                {m.name.charAt(0).toUpperCase()}
              </span>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--color-rs-ink)",
                  textAlign: "center",
                }}
              >
                {m.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
