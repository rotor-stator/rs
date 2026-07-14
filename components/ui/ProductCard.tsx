"use client";

import { useTranslations } from "next-intl";
import { useCart } from "@/components/cart/CartContext";
import { Product } from "@/lib/types";
import { CheckCircle, Plus } from "lucide-react";
import { useState } from "react";

interface Props {
  product: Product;
  highlighted?: boolean;
}

export default function ProductCard({ product, highlighted = false }: Props) {
  const t = useTranslations("common");
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div
      style={{
        border: highlighted ? "1px solid var(--color-rs-orange)" : "1px solid var(--color-rs-border)",
        borderLeft: highlighted ? "3px solid var(--color-rs-orange)" : "1px solid var(--color-rs-border)",
        borderRadius: 4,
        padding: "20px 24px",
        backgroundColor: highlighted ? "#FDF3EC" : "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        transition: "background-color 0.2s, border-color 0.2s",
      }}
    >
      <div>
        <p
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "var(--color-rs-mid)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            margin: "0 0 4px",
          }}
        >
          {t("partNumber")}: {product.partNumber}
        </p>
        <h3
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "var(--color-rs-ink)",
            margin: "0 0 4px",
          }}
        >
          {product.name}
        </h3>
        <p style={{ fontSize: 13, color: "var(--color-rs-mid)", margin: 0 }}>
          {product.description}
          {product.material && (
            <> — <strong>{t("material")}:</strong> {product.material}</>
          )}
        </p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 8,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: 12,
            color: "var(--color-rs-mid)",
            fontWeight: 500,
          }}
        >
          {t("priceOnRequest")}
        </span>
        <button
          onClick={handleAdd}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 16px",
            backgroundColor: added ? "#16a34a" : "var(--color-rs-orange)",
            color: "#fff",
            border: "none",
            borderRadius: 2,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            cursor: "pointer",
            fontFamily: "var(--font-sans)",
            transition: "background-color 0.2s",
            minWidth: 130,
            justifyContent: "center",
          }}
        >
          {added ? <CheckCircle size={14} /> : <Plus size={14} />}
          {added ? "Added" : t("addToCart")}
        </button>
      </div>
    </div>
  );
}
