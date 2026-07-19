"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ChevronRight } from "lucide-react";
import PartSearchBox from "@/components/search/PartSearchBox";
import SearchResultCard from "@/components/search/SearchResultCard";
import { searchProducts } from "@/lib/search";
import { EnrichedProduct } from "@/lib/products";
import {
  getManufacturers,
  getManufacturerBySlug,
  getSeriesForManufacturer,
  getModelsForSeries,
  ManufacturerSummary,
  SeriesSummary,
  ModelSummary,
} from "@/lib/catalog";

const FILTER_THRESHOLD = 6;
const MODEL_FILTER_DEBOUNCE_MS = 150;

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchPageContent />
    </Suspense>
  );
}

function SearchPageContent() {
  const t = useTranslations("search");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const initialManufacturerSlug = searchParams.get("manufacturer") ?? "";

  const [query, setQuery] = useState(initialQuery);
  const [manufacturerFilter, setManufacturerFilter] = useState<string | null>(null);
  const [materialFilter, setMaterialFilter] = useState<string | null>(null);

  const handleChangeQuery = useCallback(
    (q: string) => {
      setQuery(q);
      setManufacturerFilter(null);
      setMaterialFilter(null);
      router.replace(`/${locale}/search${q ? `?q=${encodeURIComponent(q)}` : ""}`, { scroll: false });
    },
    [locale, router]
  );

  const [allResults, setAllResults] = useState<EnrichedProduct[]>([]);

  useEffect(() => {
    let cancelled = false;
    searchProducts(query).then((results) => {
      if (!cancelled) setAllResults(results);
    });
    return () => {
      cancelled = true;
    };
  }, [query]);

  const manufacturerOptions = useMemo(
    () => Array.from(new Set(allResults.map((p) => p.manufacturerName))).sort(),
    [allResults]
  );
  const materialOptions = useMemo(
    () => Array.from(new Set(allResults.map((p) => p.material).filter((m): m is string => Boolean(m)))).sort(),
    [allResults]
  );

  const results = allResults.filter(
    (p) =>
      (!manufacturerFilter || p.manufacturerName === manufacturerFilter) &&
      (!materialFilter || p.material === materialFilter)
  );

  const showFilters = allResults.length > FILTER_THRESHOLD;
  const filtersActive = Boolean(manufacturerFilter || materialFilter);

  // ---- Browse state: manufacturer -> series -> model ----
  const [manufacturers, setManufacturers] = useState<ManufacturerSummary[]>([]);
  const [manufacturer, setManufacturer] = useState<ManufacturerSummary | null>(null);
  const [series, setSeries] = useState<SeriesSummary[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<SeriesSummary | null>(null);
  const [models, setModels] = useState<ModelSummary[]>([]);
  const [modelFilter, setModelFilter] = useState("");
  const [debouncedModelFilter, setDebouncedModelFilter] = useState("");

  useEffect(() => {
    getManufacturers().then(setManufacturers);
  }, []);

  useEffect(() => {
    if (!initialManufacturerSlug) return;
    let cancelled = false;
    getManufacturerBySlug(initialManufacturerSlug).then((m) => {
      if (!cancelled && m) setManufacturer(m);
    });
    return () => {
      cancelled = true;
    };
  }, [initialManufacturerSlug]);

  useEffect(() => {
    if (!manufacturer) {
      setSeries([]);
      setSelectedSeries(null);
      return;
    }
    let cancelled = false;
    getSeriesForManufacturer(manufacturer.id).then((data) => {
      if (!cancelled) setSeries(data);
    });
    return () => {
      cancelled = true;
    };
  }, [manufacturer]);

  useEffect(() => {
    if (!selectedSeries) {
      setModels([]);
      return;
    }
    let cancelled = false;
    getModelsForSeries(selectedSeries.id).then((data) => {
      if (!cancelled) setModels(data);
    });
    return () => {
      cancelled = true;
    };
  }, [selectedSeries]);

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedModelFilter(modelFilter), MODEL_FILTER_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [modelFilter]);

  const filteredModels = useMemo(() => {
    const q = debouncedModelFilter.trim().toLowerCase();
    if (!q) return models;
    return models.filter((m) => m.name.toLowerCase().includes(q));
  }, [models, debouncedModelFilter]);

  function chooseManufacturer(m: ManufacturerSummary) {
    setManufacturer(m);
    setSelectedSeries(null);
    setModelFilter("");
    router.replace(`/${locale}/search?manufacturer=${encodeURIComponent(m.slug)}`, { scroll: false });
  }

  function chooseSeries(s: SeriesSummary) {
    setSelectedSeries(s);
    setModelFilter("");
  }

  function chooseModel(m: ModelSummary) {
    router.push(`/${locale}/model/${encodeURIComponent(m.slug)}`);
  }

  function backToManufacturers() {
    setManufacturer(null);
    setSelectedSeries(null);
    setModelFilter("");
    router.replace(`/${locale}/search`, { scroll: false });
  }

  function goBrowse() {
    setQuery("");
    setManufacturerFilter(null);
    setMaterialFilter(null);
    backToManufacturers();
  }

  function backToSeries() {
    setSelectedSeries(null);
    setModelFilter("");
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
      <div style={{ maxWidth: 640, marginBottom: 32 }}>
        <PartSearchBox initialQuery={initialQuery} onChangeQuery={handleChangeQuery} />
      </div>

      {query ? (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
              marginBottom: 24,
            }}
          >
            <h2
              style={{
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-rs-mid)",
                margin: 0,
              }}
            >
              {t("resultsCount", { count: results.length, query })}
            </h2>

            {showFilters && (
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <FilterSelect
                  label={t("filterManufacturer")}
                  allLabel={t("allManufacturers")}
                  value={manufacturerFilter}
                  options={manufacturerOptions}
                  onChange={setManufacturerFilter}
                />
                {materialOptions.length > 0 && (
                  <FilterSelect
                    label={t("filterMaterial")}
                    allLabel={t("allMaterials")}
                    value={materialFilter}
                    options={materialOptions}
                    onChange={setMaterialFilter}
                  />
                )}
              </div>
            )}
          </div>

          {results.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: 20,
              }}
            >
              {results.map((p) => (
                <SearchResultCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {allResults.length > 0 && results.length === 0 && (
            <div style={{ padding: "32px 0", textAlign: "center" }}>
              <p style={{ fontSize: 14, color: "var(--color-rs-mid)", margin: "0 0 12px" }}>
                {t("noFilterResults")}
              </p>
              {filtersActive && (
                <button
                  onClick={() => {
                    setManufacturerFilter(null);
                    setMaterialFilter(null);
                  }}
                  style={resetFiltersButtonStyle}
                >
                  {t("resetFilters")}
                </button>
              )}
            </div>
          )}

          {allResults.length === 0 && (
            <div style={{ padding: "48px 0", textAlign: "center" }}>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--color-rs-ink)", margin: "0 0 10px" }}>
                {t("noResultsTitle")}
              </h3>
              <p style={{ fontSize: 15, color: "var(--color-rs-mid)", margin: "0 0 28px" }}>
                {t("noResultsBody", { query })}
              </p>
              <button onClick={goBrowse} style={browseCtaButtonStyle}>
                {t("browseCta")}
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          {manufacturer && (
            <Breadcrumb>
              <BreadcrumbButton onClick={backToManufacturers}>{manufacturer.name}</BreadcrumbButton>
              {selectedSeries && (
                <>
                  <ChevronRight size={12} />
                  <BreadcrumbButton onClick={backToSeries}>{selectedSeries.name}</BreadcrumbButton>
                </>
              )}
            </Breadcrumb>
          )}

          {!manufacturer && (
            <>
              <SectionTitle>{t("browseManufacturerHeading")}</SectionTitle>
              <CardGrid minWidth={180}>
                {manufacturers.map((m) => (
                  <GridCard key={m.id} label={m.name} onClick={() => chooseManufacturer(m)} />
                ))}
              </CardGrid>
            </>
          )}

          {manufacturer && !selectedSeries && (
            <>
              <SectionTitle>{t("browseSeriesHeading")}</SectionTitle>
              {series.length === 0 ? (
                <p style={{ fontSize: 14, color: "var(--color-rs-mid)" }}>{t("noSeriesForManufacturer")}</p>
              ) : (
                <CardGrid minWidth={200}>
                  {series.map((s) => (
                    <GridCard key={s.id} label={s.name} onClick={() => chooseSeries(s)} />
                  ))}
                </CardGrid>
              )}
            </>
          )}

          {selectedSeries && (
            <>
              <input
                type="text"
                value={modelFilter}
                onChange={(e) => setModelFilter(e.target.value)}
                placeholder={t("modelFilterPlaceholder")}
                style={modelFilterInputStyle}
              />

              {models.length === 0 ? (
                <p style={{ fontSize: 14, color: "var(--color-rs-mid)" }}>{t("noModelsInSeries")}</p>
              ) : filteredModels.length === 0 ? (
                <p style={{ fontSize: 14, color: "var(--color-rs-mid)" }}>{t("noModelsMatch")}</p>
              ) : (
                <div style={modelListContainerStyle}>
                  {filteredModels.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => chooseModel(m)}
                      style={modelRowStyle}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--color-rs-light)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                      }}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
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
        margin: "0 0 20px",
      }}
    >
      {children}
    </h2>
  );
}

function Breadcrumb({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: 12,
        color: "var(--color-rs-mid)",
        marginBottom: 24,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        fontWeight: 500,
        flexWrap: "wrap",
      }}
    >
      {children}
    </div>
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
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        padding: 0,
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--color-rs-orange)")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--color-rs-mid)")}
    >
      {children}
    </button>
  );
}

function CardGrid({ minWidth, children }: { minWidth: number; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth}px, 1fr))`,
        gap: 16,
        marginBottom: 8,
      }}
    >
      {children}
    </div>
  );
}

function GridCard({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "24px 20px",
        border: "1.5px solid var(--color-rs-border)",
        borderRadius: 4,
        background: "#fff",
        cursor: "pointer",
        fontFamily: "var(--font-sans)",
        fontSize: 15,
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

function FilterSelect({
  label,
  allLabel,
  value,
  options,
  onChange,
}: {
  label: string;
  allLabel: string;
  value: string | null;
  options: string[];
  onChange: (v: string | null) => void;
}) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value || null)}
      aria-label={label}
      style={{
        padding: "8px 12px",
        border: "1.5px solid var(--color-rs-border)",
        borderRadius: 4,
        backgroundColor: "#fff",
        fontFamily: "var(--font-sans)",
        fontSize: 13,
        fontWeight: 600,
        color: "var(--color-rs-ink)",
        cursor: "pointer",
      }}
    >
      <option value="">{allLabel}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

const resetFiltersButtonStyle: React.CSSProperties = {
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
};

const browseCtaButtonStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "14px 28px",
  backgroundColor: "var(--color-rs-ink)",
  color: "#fff",
  border: "none",
  borderRadius: 2,
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  cursor: "pointer",
  fontFamily: "var(--font-sans)",
};

const modelFilterInputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  maxWidth: 420,
  padding: "12px 16px",
  marginBottom: 20,
  border: "1.5px solid var(--color-rs-border)",
  borderRadius: 4,
  fontFamily: "var(--font-sans)",
  fontSize: 14,
  color: "var(--color-rs-ink)",
  outline: "none",
};

const modelListContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  maxHeight: 480,
  overflowY: "auto",
  border: "1px solid var(--color-rs-border)",
  borderRadius: 4,
  backgroundColor: "#fff",
};

const modelRowStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  textAlign: "left",
  padding: "14px 18px",
  border: "none",
  borderBottom: "1px solid var(--color-rs-light)",
  background: "none",
  cursor: "pointer",
  fontFamily: "var(--font-sans)",
  fontSize: 14,
  fontWeight: 600,
  color: "var(--color-rs-ink)",
};
