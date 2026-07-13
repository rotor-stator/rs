"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import manufacturers from "@/data/manufacturers";
import productsData from "@/data/products.json";
import ProductCard from "@/components/ui/ProductCard";
import { Product } from "@/lib/types";
import { ChevronRight } from "lucide-react";

export default function RotorPage() {
  const t = useTranslations("category");
  const [selectedMfr, setSelectedMfr] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const mfr = manufacturers.find((m) => m.id === selectedMfr);
  const products: Product[] = (() => {
    if (!selectedMfr || !selectedModel) return [];
    const data = (productsData as Record<string, Record<string, { rotor: Omit<Product, "id" | "manufacturer" | "model" | "category">[] }>>);
    const raw = data[selectedMfr]?.[selectedModel]?.rotor ?? [];
    return raw.map((p) => ({
      ...p,
      id: p.partNumber,
      manufacturer: selectedMfr,
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
        }}
      >
        <span>Rotor</span>
        {selectedMfr && (
          <>
            <ChevronRight size={12} />
            <button
              onClick={() => { setSelectedModel(null); }}
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
              {mfr?.name}
            </button>
          </>
        )}
        {selectedModel && (
          <>
            <ChevronRight size={12} />
            <span>{mfr?.models.find((m) => m.id === selectedModel)?.name}</span>
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

      {/* Step 2: Model */}
      {selectedMfr && !selectedModel && mfr && (
        <>
          <SectionTitle>{t("selectModel")}</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
            {mfr.models.map((m) => (
              <SelectCard key={m.id} label={m.name} onClick={() => setSelectedModel(m.id)} />
            ))}
          </div>
          <BackButton onClick={() => setSelectedMfr(null)} />
        </>
      )}

      {/* Step 3: Products */}
      {selectedMfr && selectedModel && (
        <>
          <SectionTitle>{t("availableProducts")}</SectionTitle>
          {products.length === 0 ? (
            <p style={{ color: "var(--color-rs-mid)", fontSize: 15 }}>
              {t("noProductsForModel")}
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
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
