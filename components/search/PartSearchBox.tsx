"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Search, X } from "lucide-react";
import { searchProducts } from "@/lib/search";
import { EnrichedProduct, slugifyPartNumber } from "@/lib/products";

const DEBOUNCE_MS = 300;
const SUGGESTION_LIMIT = 5;

interface Props {
  initialQuery?: string;
  /** Fires ~300ms after the user stops typing, with the debounced query. */
  onChangeQuery?: (query: string) => void;
}

export default function PartSearchBox({ initialQuery = "", onChangeQuery }: Props) {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [focused, setFocused] = useState(false);
  const blurTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [query]);

  useEffect(() => {
    onChangeQuery?.(debouncedQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  useEffect(() => {
    return () => {
      if (blurTimeout.current) clearTimeout(blurTimeout.current);
    };
  }, []);

  const [allMatches, setAllMatches] = useState<EnrichedProduct[]>([]);

  useEffect(() => {
    let cancelled = false;
    if (debouncedQuery.trim().length >= 2) {
      searchProducts(debouncedQuery).then((results) => {
        if (!cancelled) setAllMatches(results);
      });
    } else {
      setAllMatches([]);
    }
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  const suggestions = allMatches.slice(0, SUGGESTION_LIMIT);
  const dropdownOpen = focused && debouncedQuery.trim().length >= 2;

  const goToSearch = useCallback(
    (q: string) => {
      const trimmed = q.trim();
      if (!trimmed) return;
      router.push(`/${locale}/search?q=${encodeURIComponent(trimmed)}`);
    },
    [locale, router]
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    goToSearch(query);
  }

  function handleSelect(product: EnrichedProduct) {
    setFocused(false);
    router.push(
      `/${locale}/model/${encodeURIComponent(product.modelSlug)}#${slugifyPartNumber(product.partNumber)}`
    );
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setFocused(false);
      (e.target as HTMLInputElement).blur();
    }
  }

  return (
    <div style={{ position: "relative" }}>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          border: `2px solid ${focused ? "var(--color-rs-orange)" : "var(--color-rs-border)"}`,
          borderRadius: 4,
          backgroundColor: "#fff",
          padding: "0 16px",
          transition: "border-color 0.15s",
        }}
      >
        <Search size={18} color="var(--color-rs-mid)" style={{ flexShrink: 0 }} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (blurTimeout.current) clearTimeout(blurTimeout.current);
            setFocused(true);
          }}
          onBlur={() => {
            blurTimeout.current = setTimeout(() => setFocused(false), 150);
          }}
          onKeyDown={handleKeyDown}
          placeholder={tCommon("searchPlaceholder")}
          style={{
            flex: 1,
            minWidth: 0,
            padding: "14px 0",
            border: "none",
            outline: "none",
            fontSize: 15,
            fontFamily: "var(--font-sans)",
            color: "var(--color-rs-ink)",
            backgroundColor: "transparent",
          }}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setDebouncedQuery("");
            }}
            aria-label="Clear"
            style={{
              display: "flex",
              padding: 4,
              border: "none",
              background: "none",
              cursor: "pointer",
              color: "var(--color-rs-mid)",
              flexShrink: 0,
            }}
          >
            <X size={16} />
          </button>
        )}
      </form>

      {dropdownOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            right: 0,
            backgroundColor: "#fff",
            border: "1px solid var(--color-rs-border)",
            borderRadius: 4,
            boxShadow: "0 12px 32px rgba(20,24,32,0.14)",
            overflow: "hidden",
            zIndex: 30,
          }}
        >
          {suggestions.length === 0 ? (
            <div style={{ padding: "16px 18px", fontSize: 13, color: "var(--color-rs-mid)" }}>
              {tCommon("noMatches")}
            </div>
          ) : (
            suggestions.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  width: "100%",
                  padding: "12px 18px",
                  border: "none",
                  borderBottom: "1px solid var(--color-rs-light)",
                  background: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "var(--font-sans)",
                  transition: "background-color 0.1s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--color-rs-light)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                }}
              >
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 14, fontWeight: 600, color: "var(--color-rs-ink)" }}>
                    {item.name}
                  </span>
                  <span style={{ display: "block", fontSize: 12, color: "var(--color-rs-mid)" }}>
                    {tCommon("partNumber")}: {item.partNumber}
                  </span>
                </span>
                <span
                  style={{
                    flexShrink: 0,
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--color-rs-mid)",
                    backgroundColor: "var(--color-rs-light)",
                    padding: "4px 10px",
                    borderRadius: 999,
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.manufacturerName} · {item.modelName}
                </span>
              </button>
            ))
          )}

          <button
            type="button"
            onClick={() => goToSearch(query)}
            style={{
              display: "block",
              width: "100%",
              padding: "12px 18px",
              border: "none",
              borderTop: "1px solid var(--color-rs-border)",
              background: "none",
              cursor: "pointer",
              textAlign: "left",
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.04em",
              color: "var(--color-rs-orange)",
            }}
          >
            {t("viewAllResults", { count: allMatches.length })} →
          </button>
        </div>
      )}
    </div>
  );
}
