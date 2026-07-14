"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Check, ChevronRight } from "lucide-react";
import manufacturers from "@/data/manufacturers";
import { materialsFor } from "@/data/materials";
import { ProductCategory } from "@/lib/types";

interface Option {
  id: string;
  name: string;
}

const PANEL_TRANSITION = { duration: 0.35, ease: "easeOut" as const };

export default function PartSelector() {
  const t = useTranslations("home");
  const locale = useLocale();
  const router = useRouter();

  const [category, setCategory] = useState<ProductCategory | null>(null);
  const [mfrId, setMfrId] = useState<string | null>(null);
  const [seriesId, setSeriesId] = useState<string | null>(null);
  const [modelId, setModelId] = useState<string | null>(null);

  const mfr = manufacturers.find((m) => m.id === mfrId) ?? null;
  const series = mfr?.series.find((s) => s.id === seriesId) ?? null;
  const model = series?.models.find((m) => m.id === modelId) ?? null;
  const materials = category ? materialsFor(category) : [];

  function chooseCategory(c: ProductCategory) {
    setCategory(c);
    setMfrId(null);
    setSeriesId(null);
    setModelId(null);
  }
  function chooseMfr(id: string) {
    setMfrId(id);
    setSeriesId(null);
    setModelId(null);
  }
  function chooseSeries(id: string) {
    setSeriesId(id);
    setModelId(null);
  }
  function chooseModel(id: string) {
    setModelId(id);
  }
  function chooseMaterial(materialId: string) {
    if (!category || !mfrId || !seriesId || !modelId) return;
    const qs = new URLSearchParams({
      mfr: mfrId,
      series: seriesId,
      model: modelId,
      material: materialId,
    });
    router.push(`/${locale}/${category}?${qs.toString()}`);
  }

  return (
    <section
      id="part-selector"
      style={{ backgroundColor: "var(--color-rs-light)", padding: "88px 0", scrollMarginTop: 24 }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
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

        <div className="rs-selector-track">
          {category ? (
            <DockedChip
              sub={t("stepCategory")}
              label={category === "rotor" ? "Rotor" : "Stator"}
              onReopen={() => {
                setCategory(null);
                setMfrId(null);
                setSeriesId(null);
                setModelId(null);
              }}
            />
          ) : (
            <CategoryPanel onChoose={chooseCategory} />
          )}

          {category &&
            (mfr ? (
              <DockedChip
                sub={t("stepManufacturer")}
                label={mfr.name}
                onReopen={() => {
                  setMfrId(null);
                  setSeriesId(null);
                  setModelId(null);
                }}
              />
            ) : (
              <OptionPanel
                title={t("stepManufacturer")}
                items={manufacturers}
                onChoose={chooseMfr}
              />
            ))}

          {mfr &&
            (series ? (
              <DockedChip
                sub={t("stepSeries")}
                label={series.name}
                onReopen={() => {
                  setSeriesId(null);
                  setModelId(null);
                }}
              />
            ) : (
              <OptionPanel title={t("stepSeries")} items={mfr.series} onChoose={chooseSeries} />
            ))}

          {series &&
            (model ? (
              <DockedChip
                sub={t("stepModel")}
                label={model.name}
                onReopen={() => setModelId(null)}
              />
            ) : (
              <OptionPanel title={t("stepModel")} items={series.models} onChoose={chooseModel} />
            ))}

          {model && (
            <OptionPanel
              title={t("stepMaterial")}
              items={materials}
              onChoose={chooseMaterial}
            />
          )}
        </div>
      </div>

      <style>{`
        .rs-selector-track {
          display: flex;
          align-items: stretch;
          gap: 16px;
        }
        @media (max-width: 860px) {
          .rs-selector-track {
            flex-direction: column;
          }
        }
      `}</style>
    </section>
  );
}

function DockedChip({
  label,
  sub,
  onReopen,
}: {
  label: string;
  sub: string;
  onReopen: () => void;
}) {
  return (
    <button
      onClick={onReopen}
      style={{
        flex: "0 0 auto",
        width: 176,
        textAlign: "left",
        padding: "16px 18px",
        border: "2px solid var(--color-rs-orange)",
        borderRadius: 4,
        backgroundColor: "#fff",
        cursor: "pointer",
        fontFamily: "var(--font-sans)",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
      className="rs-docked-chip"
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--color-rs-mid)",
          }}
        >
          {sub}
        </span>
        <Check size={14} color="var(--color-rs-orange)" />
      </div>
      <span
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: "var(--color-rs-ink)",
          lineHeight: 1.25,
        }}
      >
        {label}
      </span>
    </button>
  );
}

function OptionPanel({
  title,
  items,
  onChoose,
}: {
  title: string;
  items: Option[];
  onChoose: (id: string) => void;
}) {
  return (
    <motion.div
      key={title}
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={PANEL_TRANSITION}
      style={{
        flex: "1 1 260px",
        minWidth: 0,
        padding: 24,
        border: "1px solid var(--color-rs-border)",
        borderRadius: 4,
        backgroundColor: "#fff",
      }}
    >
      <h3
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--color-rs-mid)",
          margin: "0 0 16px",
        }}
      >
        {title}
      </h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onChoose(item.id)}
            style={{
              padding: "10px 18px",
              border: "1.5px solid var(--color-rs-border)",
              borderRadius: 999,
              background: "#fff",
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              fontSize: 14,
              fontWeight: 600,
              color: "var(--color-rs-ink)",
              transition: "border-color 0.15s, color 0.15s, background-color 0.15s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.borderColor = "var(--color-rs-orange)";
              el.style.color = "var(--color-rs-orange)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.borderColor = "var(--color-rs-border)";
              el.style.color = "var(--color-rs-ink)";
            }}
          >
            {item.name}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function CategoryPanel({ onChoose }: { onChoose: (c: ProductCategory) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={PANEL_TRANSITION}
      style={{
        flex: "1 1 auto",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16,
      }}
    >
      <CategoryCardButton category="rotor" onChoose={onChoose} />
      <CategoryCardButton category="stator" onChoose={onChoose} />
    </motion.div>
  );
}

function CategoryCardButton({
  category,
  onChoose,
}: {
  category: ProductCategory;
  onChoose: (c: ProductCategory) => void;
}) {
  return (
    <button
      onClick={() => onChoose(category)}
      style={{
        border: "2px solid var(--color-rs-border)",
        borderRadius: 6,
        padding: 0,
        background: "#fff",
        cursor: "pointer",
        overflow: "hidden",
        textAlign: "left",
        transition: "border-color 0.15s, box-shadow 0.15s",
        fontFamily: "var(--font-sans)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.borderColor = "var(--color-rs-orange)";
        el.style.boxShadow = "0 8px 28px rgba(212,98,26,0.14)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.borderColor = "var(--color-rs-border)";
        el.style.boxShadow = "none";
      }}
    >
      <div
        style={{
          height: 140,
          background: "linear-gradient(155deg, #2B3140, #141820)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {category === "stator" ? <StatorGlyph /> : <RotorGlyph />}
      </div>
      <div style={{ padding: "20px 24px" }}>
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: "0.03em",
            textTransform: "uppercase",
            color: "var(--color-rs-ink)",
          }}
        >
          {category}
        </div>
        <ChevronRight size={16} color="var(--color-rs-orange)" style={{ marginTop: 6 }} />
      </div>
    </button>
  );
}

function StatorGlyph() {
  return (
    <svg width="88" height="88" viewBox="0 0 64 64" fill="none">
      <rect x="8" y="8" width="48" height="48" rx="8" stroke="#C8CDD7" strokeWidth="2.5" fill="none" />
      <ellipse cx="32" cy="32" rx="16" ry="16" stroke="var(--color-rs-orange)" strokeWidth="2.5" fill="none" />
      <ellipse cx="32" cy="32" rx="5" ry="5" stroke="var(--color-rs-orange)" strokeWidth="2" fill="none" />
    </svg>
  );
}

function RotorGlyph() {
  return (
    <svg width="88" height="88" viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="32" rx="10" ry="24" stroke="var(--color-rs-orange)" strokeWidth="2.5" fill="none" />
      <path d="M20 16 Q32 8 44 16" stroke="#C8CDD7" strokeWidth="2" fill="none" />
      <path d="M20 32 Q32 24 44 32" stroke="#C8CDD7" strokeWidth="2" fill="none" />
      <path d="M20 48 Q32 40 44 48" stroke="#C8CDD7" strokeWidth="2" fill="none" />
    </svg>
  );
}
