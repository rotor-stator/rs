"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Minus, Plus } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import { EnrichedProduct, slugifyPartNumber } from "@/lib/products";
import { formatPrice } from "@/lib/formatPrice";

interface Props {
  product: EnrichedProduct;
}

export default function ProductRow({ product }: Props) {
  const t = useTranslations("common");
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [highlighted, setHighlighted] = useState(false);

  const anchorId = slugifyPartNumber(product.partNumber);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash !== `#${anchorId}`) return;
    const el = document.getElementById(anchorId);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    setHighlighted(true);
    const timeout = setTimeout(() => setHighlighted(false), 2000);
    return () => clearTimeout(timeout);
  }, [anchorId]);

  function handleAdd() {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div
      id={anchorId}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 16,
        padding: "14px 18px",
        border: highlighted ? "1px solid var(--color-rs-orange)" : "1px solid var(--color-rs-border)",
        borderLeft: highlighted ? "3px solid var(--color-rs-orange)" : "1px solid var(--color-rs-border)",
        borderRadius: 4,
        backgroundColor: highlighted ? "#FDF3EC" : "#fff",
        transition: "background-color 0.3s, border-color 0.3s",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--color-rs-ink)" }}>
          {product.material || product.name}
        </div>
        <div style={{ fontSize: 12, color: "var(--color-rs-mid)", marginTop: 2 }}>
          {t("partNumber")}: {product.partNumber}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 18, flexShrink: 0 }}>
        <span style={{ fontSize: 12, color: "var(--color-rs-mid)", fontWeight: 500 }}>
          {formatPrice(product.price) ?? t("priceOnRequest")}
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            style={qtyBtnStyle}
          >
            <Minus size={12} />
          </button>
          <span style={{ minWidth: 22, textAlign: "center", fontSize: 14, fontWeight: 600 }}>
            {qty}
          </span>
          <button
            onClick={() => setQty((q) => q + 1)}
            aria-label="Increase quantity"
            style={qtyBtnStyle}
          >
            <Plus size={12} />
          </button>
        </div>

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
          {added ? <Check size={14} /> : <Plus size={14} />}
          {added ? "Added" : t("addToCart")}
        </button>
      </div>
    </div>
  );
}

const qtyBtnStyle: React.CSSProperties = {
  width: 26,
  height: 26,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid var(--color-rs-border)",
  borderRadius: 2,
  background: "#fff",
  cursor: "pointer",
  color: "var(--color-rs-ink)",
};
