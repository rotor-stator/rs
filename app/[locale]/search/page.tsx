"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import PartSearchBox from "@/components/search/PartSearchBox";
import SearchResultCard from "@/components/search/SearchResultCard";
import { searchProducts } from "@/lib/search";
import { EnrichedProduct } from "@/lib/products";

const FILTER_THRESHOLD = 6;

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

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
      <div style={{ maxWidth: 640, marginBottom: 32 }}>
        <PartSearchBox initialQuery={initialQuery} onChangeQuery={handleChangeQuery} />
      </div>

      {!query && <p style={{ fontSize: 15, color: "var(--color-rs-mid)" }}>{t("emptyPrompt")}</p>}

      {query && (
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
                  style={{
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
                {t("browseCta")}
              </Link>
            </div>
          )}
        </>
      )}
    </div>
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
