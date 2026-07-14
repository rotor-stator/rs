"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import manufacturers from "@/data/manufacturers";
import { rotorMaterials } from "@/data/materials";
import productsData from "@/data/products.json";
import ProductCard from "@/components/ui/ProductCard";
import { Product } from "@/lib/types";
import { ChevronRight } from "lucide-react";

type ProductsData = Record<
  string,
  Record<string, { rotor: Omit<Product, "id" | "manufacturer" | "model" | "category">[] }>
>;

export default function RotorPage() {
  return (
    <Suspense fallback={null}>
      <RotorPageContent />
    </Suspense>
  );
}

function RotorPageContent() {
  const t = useTranslations("category");
  const params = useSearchParams();

  const initialMfr = manufacturers.find((m) => m.id === params.get("mfr"))?.id ?? null;
  const initialMfrData = manufacturers.find((m) => m.id === initialMfr);
  const initialSeries =
    initialMfrData?.series.find((s) => s.id === params.get("series"))?.id ?? null;
  const initialSeriesData = initialMfrData?.series.find((s) => s.id === initialSeries);
  const initialModel =
    initialSeriesData?.models.find((m) => m.id === params.get("model"))?.id ?? null;
  const materialHintName =
    rotorMaterials.find((m) => m.id === params.get("material"))?.name ?? null;

  const [selectedMfr, setSelectedMfr] = useState<string | null>(initialMfr);
  const [selectedSeries, setSelectedSeries] = useState<string | null>(initialSeries);
  const [selectedModel, setSelectedModel] = useState<string | null>(initialModel);

  const mfr = manufacturers.find((m) => m.id === selectedMfr);
  const series = mfr?.series.find((s) => s.id === selectedSeries);
  const model = series?.models.find((m) => m.id === selectedModel);

  const products: Product[] = (() => {
    if (!selectedMfr || !selectedModel) return [];
    const data = productsData as ProductsData;
    const raw = data[selectedMfr]?.[selectedModel]?.rotor ?? [];
    return raw.map((p) => ({
      ...p,
      id: p.partNumber,
      manufacturer: selectedMfr,
      series: selectedSeries ?? undefined,
      model: selectedModel,
      category: "rotor" as const,
    }));
  })();

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
      {/* Breadcrumb */}
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
        <span>Rotor</span>
        {selectedMfr && (
          <>
            <ChevronRight size={12} />
            <BreadcrumbButton
              onClick={() => {
                setSelectedSeries(null);
                setSelectedModel(null);
              }}
            >
              {mfr?.name}
            </BreadcrumbButton>
          </>
        )}
        {selectedSeries && (
          <>
            <ChevronRight size={12} />
            <BreadcrumbButton onClick={() => setSelectedModel(null)}>
              {series?.name}
            </BreadcrumbButton>
          </>
        )}
        {selectedModel && (
          <>
            <ChevronRight size={12} />
            <span>{model?.name}</span>
          </>
        )}
      </div>

      {/* Step 1: Manufacturer */}
      {!selectedMfr && (
        <>
          <SectionTitle>{t("selectManufacturer")}</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
            {manufacturers.map((m) => (
              <SelectCard key={m.id} label={m.name} onClick={() => setSelectedMfr(m.id)} />
            ))}
          </div>
        </>
      )}

      {/* Step 2: Series */}
      {selectedMfr && !selectedSeries && mfr && (
        <>
          <SectionTitle>{t("selectSeries")}</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
            {mfr.series.map((s) => (
              <SelectCard key={s.id} label={s.name} onClick={() => setSelectedSeries(s.id)} />
            ))}
          </div>
          <BackButton onClick={() => setSelectedMfr(null)} />
        </>
      )}

      {/* Step 3: Model */}
      {selectedSeries && !selectedModel && series && (
        <>
          <SectionTitle>{t("selectModel")}</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
            {series.models.map((m) => (
              <SelectCard key={m.id} label={m.name} onClick={() => setSelectedModel(m.id)} />
            ))}
          </div>
          <BackButton onClick={() => setSelectedSeries(null)} />
        </>
      )}

      {/* Step 4: Products */}
      {selectedModel && (
        <>
          <SectionTitle>{t("availableProducts")}</SectionTitle>
          {products.length === 0 ? (
            <p style={{ color: "var(--color-rs-mid)", fontSize: 15 }}>
              {t("noProductsForModel")}
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[...products]
                .sort((a, b) => {
                  const aMatch = materialHintName && a.material?.toLowerCase() === materialHintName.toLowerCase() ? 0 : 1;
                  const bMatch = materialHintName && b.material?.toLowerCase() === materialHintName.toLowerCase() ? 0 : 1;
                  return aMatch - bMatch;
                })
                .map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    highlighted={
                      !!materialHintName && p.material?.toLowerCase() === materialHintName.toLowerCase()
                    }
                  />
                ))}
            </div>
          )}
          <BackButton onClick={() => setSelectedModel(null)} />
        </>
      )}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "var(--color-rs-mid)",
        marginBottom: 20,
      }}
    >
      {children}
    </h2>
  );
}

function SelectCard({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "28px 20px",
        border: "2px solid var(--color-rs-border)",
        borderRadius: 4,
        background: "#fff",
        cursor: "pointer",
        fontFamily: "var(--font-sans)",
        fontSize: 16,
        fontWeight: 600,
        color: "var(--color-rs-ink)",
        textAlign: "center",
        transition: "border-color 0.15s, color 0.15s",
        width: "100%",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-rs-orange)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--color-rs-orange)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-rs-border)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--color-rs-ink)";
      }}
    >
      {label}
    </button>
  );
}

function BreadcrumbButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "var(--color-rs-mid)",
        fontFamily: "var(--font-sans)",
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        padding: 0,
      }}
    >
      {children}
    </button>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  const t = useTranslations("common");
  return (
    <button
      onClick={onClick}
      style={{
        marginTop: 32,
        background: "none",
        border: "1px solid var(--color-rs-border)",
        borderRadius: 2,
        padding: "8px 16px",
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        cursor: "pointer",
        fontFamily: "var(--font-sans)",
        color: "var(--color-rs-mid)",
      }}
    >
      ← {t("back")}
    </button>
  );
}
