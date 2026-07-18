"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useCart } from "@/components/cart/CartContext";
import { formatPrice } from "@/lib/formatPrice";
import { Trash2, Minus, Plus } from "lucide-react";

export default function CartPage() {
  const t = useTranslations("cart");
  const tCommon = useTranslations("common");
  const { items, removeItem, setQty, totalItems } = useCart();
  const locale = useLocale();

  const pricedItems = items.filter(({ product }) => product.price != null);
  const hasUnpricedItems = pricedItems.length < items.length;
  const total = pricedItems.reduce((sum, { product, quantity }) => sum + product.price! * quantity, 0);
  const totalDisplay = pricedItems.length > 0 ? formatPrice(total) : null;

  if (items.length === 0) {
    return (
      <div
        style={{
          maxWidth: 800,
          margin: "80px auto",
          padding: "0 24px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: 16, color: "var(--color-rs-mid)", marginBottom: 24 }}>
          {t("empty")}
        </p>
        <Link
          href={`/${locale}`}
          style={{
            display: "inline-block",
            padding: "10px 24px",
            backgroundColor: "var(--color-rs-orange)",
            color: "#fff",
            textDecoration: "none",
            borderRadius: 2,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {t("continueShopping")}
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      <h1
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "var(--color-rs-ink)",
          marginBottom: 32,
        }}
      >
        {t("title")}
      </h1>

      {/* Items */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Header row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 120px 80px 40px",
            gap: 16,
            padding: "8px 16px",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--color-rs-mid)",
            borderBottom: "2px solid var(--color-rs-border)",
          }}
        >
          <span>Product</span>
          <span style={{ textAlign: "center" }}>{t("quantity")}</span>
          <span style={{ textAlign: "right" }}>Price</span>
          <span />
        </div>

        {items.map(({ product, quantity }) => (
          <div
            key={product.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 120px 80px 40px",
              gap: 16,
              alignItems: "center",
              padding: "14px 16px",
              borderBottom: "1px solid var(--color-rs-light)",
            }}
          >
            {/* Product info */}
            <div>
              <p
                style={{
                  fontSize: 11,
                  color: "var(--color-rs-mid)",
                  margin: "0 0 2px",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                }}
              >
                {product.partNumber}
              </p>
              <p style={{ fontSize: 14, fontWeight: 600, margin: 0, color: "var(--color-rs-ink)" }}>
                {product.name}
              </p>
            </div>

            {/* Quantity */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
              <button
                onClick={() => setQty(product.id, quantity - 1)}
                style={qtyBtn}
              >
                <Minus size={12} />
              </button>
              <span style={{ fontSize: 14, fontWeight: 600, minWidth: 24, textAlign: "center" }}>
                {quantity}
              </span>
              <button
                onClick={() => setQty(product.id, quantity + 1)}
                style={qtyBtn}
              >
                <Plus size={12} />
              </button>
            </div>

            {/* Price */}
            <p
              style={{
                textAlign: "right",
                fontSize: 12,
                color: "var(--color-rs-mid)",
                margin: 0,
              }}
            >
              {product.price != null ? formatPrice(product.price * quantity) : tCommon("priceOnRequest")}
            </p>

            {/* Remove */}
            <button
              onClick={() => removeItem(product.id)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--color-rs-mid)",
                padding: 4,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Total */}
      <div
        style={{
          marginTop: 24,
          paddingTop: 16,
          borderTop: "2px solid var(--color-rs-border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--color-rs-ink)",
          }}
        >
          {t("total")}
        </span>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "var(--color-rs-ink)" }}>
            {totalDisplay ?? tCommon("priceOnRequest")}
          </div>
          {hasUnpricedItems && pricedItems.length > 0 && (
            <div style={{ fontSize: 12, color: "var(--color-rs-mid)", marginTop: 4 }}>
              {t("partialPricingNote")}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: 16,
          padding: "16px",
          backgroundColor: "var(--color-rs-light)",
          borderRadius: 2,
          fontSize: 13,
          color: "var(--color-rs-mid)",
        }}
      >
        {t("priceNote")}
      </div>

      <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
        <Link
          href={`/${locale}/checkout`}
          style={{
            display: "inline-block",
            padding: "14px 32px",
            backgroundColor: "var(--color-rs-orange)",
            color: "#fff",
            textDecoration: "none",
            borderRadius: 2,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {t("continueShopping")} →
        </Link>
      </div>
    </div>
  );
}

const qtyBtn: React.CSSProperties = {
  width: 28,
  height: 28,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid var(--color-rs-border)",
  borderRadius: 2,
  background: "#fff",
  cursor: "pointer",
  color: "var(--color-rs-ink)",
};
