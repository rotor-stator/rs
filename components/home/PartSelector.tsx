"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { getManufacturers, ManufacturerOption } from "@/lib/catalog";
import { getProductsForModelGrouped, slugifyPartNumber, EnrichedProduct } from "@/lib/products";

interface Option {
  id: string;
  name: string;
}

const PANEL_TRANSITION = { duration: 0.35, ease: "easeOut" as const };

export default function PartSelector() {
  const t = useTranslations("home");

  const [manufacturers, setManufacturers] = useState<ManufacturerOption[]>([]);
  const [mfrId, setMfrId] = useState<string | null>(null);
  const [seriesId, setSeriesId] = useState<string | null>(null);
  const [modelId, setModelId] = useState<string | null>(null);

  useEffect(() => {
    getManufacturers().then(setManufacturers);
  }, []);

  const mfr = manufacturers.find((m) => m.id === mfrId) ?? null;
  const series = mfr?.series.find((s) => s.id === seriesId) ?? null;
  const model = series?.models.find((m) => m.id === modelId) ?? null;

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

  return (
    <>
      <div className="rs-selector-track">
        {mfr ? (
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
          <OptionPanel title={t("stepManufacturer")} items={manufacturers} onChoose={chooseMfr} />
        )}

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

        {model && <ResultsPanel modelId={model.id} />}
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
        .rs-results-groups {
          display: flex;
          gap: 28px;
        }
        @media (max-width: 860px) {
          .rs-results-groups {
            flex-direction: column;
            gap: 20px;
          }
        }
      `}</style>
    </>
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

function ResultsPanel({ modelId }: { modelId: string }) {
  const t = useTranslations("home");
  const tCategory = useTranslations("category");
  const tCommon = useTranslations("common");
  const tNav = useTranslations("nav");
  const locale = useLocale();

  const [loading, setLoading] = useState(true);
  const [rotors, setRotors] = useState<EnrichedProduct[]>([]);
  const [stators, setStators] = useState<EnrichedProduct[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getProductsForModelGrouped(modelId).then((data) => {
      if (cancelled) return;
      setRotors(data.rotors);
      setStators(data.stators);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [modelId]);

  const hasResults = rotors.length > 0 || stators.length > 0;

  return (
    <motion.div
      key={modelId}
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={PANEL_TRANSITION}
      style={{
        flex: "2 1 420px",
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
        {t("stepResults")}
      </h3>

      {loading ? (
        <p style={{ fontSize: 14, color: "var(--color-rs-mid)", margin: 0 }}>{tCommon("loading")}</p>
      ) : !hasResults ? (
        <p style={{ fontSize: 14, color: "var(--color-rs-mid)", margin: 0 }}>
          {tCategory("noProductsForModel")}
        </p>
      ) : (
        <div className="rs-results-groups">
          {rotors.length > 0 && (
            <ProductGroup title={tNav("rotor")} products={rotors} locale={locale} tCommon={tCommon} />
          )}
          {stators.length > 0 && (
            <ProductGroup title={tNav("stator")} products={stators} locale={locale} tCommon={tCommon} />
          )}
        </div>
      )}
    </motion.div>
  );
}

function ProductGroup({
  title,
  products,
  locale,
  tCommon,
}: {
  title: string;
  products: EnrichedProduct[];
  locale: string;
  tCommon: ReturnType<typeof useTranslations>;
}) {
  return (
    <div style={{ flex: "1 1 0" }}>
      <h4
        style={{
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--color-rs-ink)",
          margin: "0 0 10px",
        }}
      >
        {title}
      </h4>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/${locale}/product/${encodeURIComponent(slugifyPartNumber(product.partNumber))}`}
            style={{
              display: "block",
              padding: "10px 14px",
              border: "1.5px solid var(--color-rs-border)",
              borderRadius: 6,
              textDecoration: "none",
              transition: "border-color 0.15s, background-color 0.15s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = "var(--color-rs-orange)";
              el.style.backgroundColor = "var(--color-rs-light)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = "var(--color-rs-border)";
              el.style.backgroundColor = "transparent";
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-rs-ink)" }}>
              {product.material || product.name}
            </div>
            <div style={{ fontSize: 12, color: "var(--color-rs-mid)", marginTop: 2 }}>
              {tCommon("partNumber")}: {product.partNumber}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
