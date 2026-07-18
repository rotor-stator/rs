import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ChevronRight } from "lucide-react";
import { getModelBySlug } from "@/lib/catalog";
import { getProductsForModelGrouped } from "@/lib/products";
import ProductRow from "@/components/model/ProductRow";
import { ProductCategory } from "@/lib/types";

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
            <ProductGroup category="rotor" title={tNav("rotor")} products={rotors} />
          )}
          {stators.length > 0 && (
            <ProductGroup category="stator" title={tNav("stator")} products={stators} />
          )}
        </div>
      )}

      <style>{`
        .rs-model-groups {
          display: flex;
        }
        .rs-model-group {
          flex: 1 1 0;
          min-width: 0;
          padding: 0 32px;
        }
        .rs-model-group:first-child {
          padding-left: 0;
        }
        .rs-model-group:last-child {
          padding-right: 0;
        }
        .rs-model-group:not(:last-child) {
          border-right: 1px solid rgba(90, 100, 120, 0.2);
        }
        @media (max-width: 720px) {
          .rs-model-groups {
            flex-direction: column;
          }
          .rs-model-group {
            padding: 0;
          }
          .rs-model-group:not(:last-child) {
            border-right: none;
            border-bottom: 1px solid rgba(90, 100, 120, 0.2);
            padding-bottom: 28px;
            margin-bottom: 28px;
          }
        }
      `}</style>
    </div>
  );
}

const GROUP_IMAGE: Record<ProductCategory, { src: string; alt: string; width: number; height: number }> = {
  rotor: { src: "/rotor-sketch.png", alt: "Rotor", width: 762, height: 182 },
  stator: { src: "/stator-sketch.png", alt: "Stator", width: 715, height: 200 },
};

function ProductGroup({
  category,
  title,
  products,
}: {
  category: ProductCategory;
  title: string;
  products: Awaited<ReturnType<typeof getProductsForModelGrouped>>["rotors"];
}) {
  const image = GROUP_IMAGE[category];

  return (
    <div className="rs-model-group">
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          style={{ height: 56, width: "auto", margin: "0 auto 14px", display: "block" }}
        />
        <h2
          style={{
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--color-rs-ink)",
            margin: 0,
          }}
        >
          {title}
        </h2>
        <div
          style={{
            width: 48,
            height: 3,
            backgroundColor: "var(--color-rs-orange)",
            borderRadius: 2,
            margin: "10px auto 0",
          }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {products.map((product) => (
          <ProductRow key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
