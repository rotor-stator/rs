import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ChevronRight } from "lucide-react";
import { getModelBySlug } from "@/lib/catalog";
import { getProductsForModelGrouped } from "@/lib/products";
import ProductRow from "@/components/model/ProductRow";

export const revalidate = 60;

interface Props {
  params: Promise<{ locale: string; modelSlug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale, modelSlug } = await params;
  const model = await getModelBySlug(decodeURIComponent(modelSlug));
  const t = await getTranslations({ locale, namespace: "model" });
  return { title: model ? `${model.name} — RotorStator` : t("notFoundTitle") };
}

export default async function ModelPage({ params }: Props) {
  const { locale, modelSlug } = await params;
  const model = await getModelBySlug(decodeURIComponent(modelSlug));
  const t = await getTranslations({ locale, namespace: "model" });
  const tCategory = await getTranslations({ locale, namespace: "category" });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  if (!model) {
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

  const { rotors, stators } = await getProductsForModelGrouped(model.id);
  const hasResults = rotors.length > 0 || stators.length > 0;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 12,
          color: "var(--color-rs-mid)",
          marginBottom: 20,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          fontWeight: 500,
          flexWrap: "wrap",
        }}
      >
        <Link href={`/${locale}`} style={{ color: "var(--color-rs-mid)", textDecoration: "none" }}>
          {t("breadcrumbHome")}
        </Link>
        {model.manufacturerName && (
          <>
            <ChevronRight size={12} />
            <span>{model.manufacturerName}</span>
          </>
        )}
        {model.seriesName && (
          <>
            <ChevronRight size={12} />
            <span>{model.seriesName}</span>
          </>
        )}
        <ChevronRight size={12} />
        <span>{model.name}</span>
      </div>

      <h1
        style={{
          fontSize: "clamp(24px, 3vw, 34px)",
          fontWeight: 800,
          letterSpacing: "-0.01em",
          color: "var(--color-rs-ink)",
          margin: "0 0 32px",
        }}
      >
        {model.name}
      </h1>

      {!hasResults ? (
        <p style={{ fontSize: 15, color: "var(--color-rs-mid)" }}>{tCategory("noProductsForModel")}</p>
      ) : (
        <div className="rs-model-groups">
          {rotors.length > 0 && (
            <ProductGroup title={tNav("rotor")} products={rotors} />
          )}
          {stators.length > 0 && (
            <ProductGroup title={tNav("stator")} products={stators} />
          )}
        </div>
      )}

      <style>{`
        .rs-model-groups {
          display: flex;
          gap: 40px;
        }
        @media (max-width: 720px) {
          .rs-model-groups {
            flex-direction: column;
            gap: 28px;
          }
        }
      `}</style>
    </div>
  );
}

function ProductGroup({
  title,
  products,
}: {
  title: string;
  products: Awaited<ReturnType<typeof getProductsForModelGrouped>>["rotors"];
}) {
  return (
    <div style={{ flex: "1 1 0", minWidth: 0 }}>
      <h2
        style={{
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--color-rs-ink)",
          margin: "0 0 14px",
        }}
      >
        {title}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {products.map((product) => (
          <ProductRow key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
