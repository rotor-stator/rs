import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ChevronRight } from "lucide-react";
import { getProductById } from "@/lib/products";
import CategoryGlyph from "@/components/ui/CategoryGlyph";
import AddToCartButton from "@/components/product/AddToCartButton";

export const revalidate = 60;

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale, id } = await params;
  const product = await getProductById(decodeURIComponent(id));
  const t = await getTranslations({ locale, namespace: "product" });
  return { title: product ? `${product.name} — RotorStator` : t("notFoundTitle") };
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale, id } = await params;
  const product = await getProductById(decodeURIComponent(id));
  const t = await getTranslations({ locale, namespace: "product" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  if (!product) {
    return (
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "96px 24px", textAlign: "center" }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--color-rs-ink)", margin: "0 0 12px" }}>
          {t("notFoundTitle")}
        </h1>
        <p style={{ fontSize: 15, color: "var(--color-rs-mid)", margin: "0 0 32px" }}>{t("notFoundBody")}</p>
        <Link
          href={`/${locale}#part-selector`}
          style={{
            display: "inline-block",
            padding: "14px 28px",
            backgroundColor: "var(--color-rs-ink)",
            color: "#fff",
            borderRadius: 2,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            textDecoration: "none",
          }}
        >
          {t("notFoundCta")}
        </Link>
      </div>
    );
  }

  const categoryLabel = product.category === "rotor" ? "Rotor" : "Stator";

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 24px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 12,
          color: "var(--color-rs-mid)",
          marginBottom: 32,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          fontWeight: 500,
          flexWrap: "wrap",
        }}
      >
        <Link href={`/${locale}`} style={{ color: "var(--color-rs-mid)", textDecoration: "none" }}>
          {t("breadcrumbHome")}
        </Link>
        <ChevronRight size={12} />
        <Link href={`/${locale}/${product.category}`} style={{ color: "var(--color-rs-mid)", textDecoration: "none" }}>
          {categoryLabel}
        </Link>
        <ChevronRight size={12} />
        <span>{product.modelName}</span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 42fr) minmax(0, 58fr)",
          gap: 48,
        }}
        className="rs-product-grid"
      >
        <div
          style={{
            aspectRatio: "1 / 1",
            borderRadius: 6,
            background: "linear-gradient(155deg, #2B3140, #141820)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CategoryGlyph category={product.category} size={120} />
        </div>

        <div>
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--color-rs-orange)",
              margin: "0 0 10px",
            }}
          >
            {tCommon("partNumber")}: {product.partNumber}
          </p>
          <h1
            style={{
              fontSize: "clamp(24px, 3vw, 34px)",
              fontWeight: 800,
              letterSpacing: "-0.01em",
              color: "var(--color-rs-ink)",
              margin: "0 0 16px",
            }}
          >
            {product.name}
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--color-rs-mid)", margin: "0 0 28px" }}>
            {product.description}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px 24px",
              padding: "20px 0",
              borderTop: "1px solid var(--color-rs-border)",
              borderBottom: "1px solid var(--color-rs-border)",
              marginBottom: 28,
            }}
          >
            <SpecRow label={t("manufacturer")} value={product.manufacturerName} />
            <SpecRow label={t("category")} value={categoryLabel} />
            {product.seriesName && <SpecRow label={t("series")} value={product.seriesName} />}
            <SpecRow label={t("model")} value={product.modelName} />
            {product.material && <SpecRow label={tCommon("material")} value={product.material} />}
          </div>

          <p style={{ fontSize: 13, color: "var(--color-rs-mid)", fontWeight: 500, margin: "0 0 16px" }}>
            {tCommon("priceOnRequest")}
          </p>

          <AddToCartButton product={product} />
        </div>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .rs-product-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--color-rs-mid)",
          marginBottom: 2,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-rs-ink)" }}>{value}</div>
    </div>
  );
}
