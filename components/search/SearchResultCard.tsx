"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import CategoryGlyph from "@/components/ui/CategoryGlyph";
import { EnrichedProduct, slugifyPartNumber } from "@/lib/products";
import { formatPrice } from "@/lib/formatPrice";

interface Props {
  product: EnrichedProduct;
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: "var(--color-rs-mid)",
        backgroundColor: "var(--color-rs-light)",
        padding: "4px 10px",
        borderRadius: 999,
      }}
    >
      {children}
    </span>
  );
}

export default function SearchResultCard({ product }: Props) {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  return (
    <Link
      href={`/${locale}/model/${encodeURIComponent(product.modelSlug)}#${slugifyPartNumber(product.partNumber)}`}
      style={{ textDecoration: "none", display: "block" }}
    >
      <div
        style={{
          border: "1px solid var(--color-rs-border)",
          borderRadius: 4,
          overflow: "hidden",
          backgroundColor: "#fff",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "border-color 0.15s, box-shadow 0.15s",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = "var(--color-rs-orange)";
          el.style.boxShadow = "0 8px 28px rgba(212,98,26,0.14)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = "var(--color-rs-border)";
          el.style.boxShadow = "none";
        }}
      >
        <div
          style={{
            height: 120,
            background: "linear-gradient(155deg, #2B3140, #141820)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <CategoryGlyph category={product.category} />
        </div>

        <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", flex: 1 }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "var(--color-rs-mid)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              margin: "0 0 4px",
            }}
          >
            {tCommon("partNumber")}: {product.partNumber}
          </p>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--color-rs-ink)", margin: "0 0 10px" }}>
            {product.name}
          </h3>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
            <Pill>{product.manufacturerName}</Pill>
            <Pill>{product.modelName}</Pill>
            {product.material && <Pill>{product.material}</Pill>}
          </div>

          <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: "var(--color-rs-mid)", fontWeight: 500 }}>
              {formatPrice(product.price) ?? tCommon("priceOnRequest")}
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--color-rs-orange)" }}>
              {t("viewProduct")} →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
