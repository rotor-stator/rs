"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchBar() {
  const t = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/${locale}/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <form onSubmit={handleSearch} style={{ display: "flex", gap: 0 }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("search")}
        style={{
          flex: 1,
          padding: "14px 18px",
          fontSize: 15,
          border: "2px solid var(--color-rs-border)",
          borderRight: "none",
          borderRadius: "2px 0 0 2px",
          outline: "none",
          fontFamily: "var(--font-sans)",
          color: "var(--color-rs-ink)",
          backgroundColor: "#fff",
          transition: "border-color 0.15s",
        }}
        onFocus={(e) =>
          (e.target.style.borderColor = "var(--color-rs-orange)")
        }
        onBlur={(e) =>
          (e.target.style.borderColor = "var(--color-rs-border)")
        }
      />
      <button
        type="submit"
        style={{
          padding: "14px 22px",
          backgroundColor: "var(--color-rs-orange)",
          color: "#fff",
          border: "2px solid var(--color-rs-orange)",
          borderRadius: "0 2px 2px 0",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          fontFamily: "var(--font-sans)",
          transition: "background-color 0.15s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "var(--color-rs-orange-hover)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "var(--color-rs-orange)";
        }}
      >
        <Search size={16} />
        {t("searchButton")}
      </button>
    </form>
  );
}
