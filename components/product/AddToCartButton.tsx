"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle, Plus } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import { Product } from "@/lib/types";

interface Props {
  product: Product;
}

export default function AddToCartButton({ product }: Props) {
  const t = useTranslations("common");
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      onClick={handleAdd}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "16px 32px",
        backgroundColor: added ? "#16a34a" : "var(--color-rs-ink)",
        color: "#fff",
        border: "none",
        borderRadius: 2,
        fontSize: 14,
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        cursor: "pointer",
        fontFamily: "var(--font-sans)",
        transition: "background-color 0.2s",
        minWidth: 220,
      }}
      onMouseEnter={(e) => {
        if (!added) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--color-rs-orange)";
      }}
      onMouseLeave={(e) => {
        if (!added) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--color-rs-ink)";
      }}
    >
      {added ? <CheckCircle size={16} /> : <Plus size={16} />}
      {added ? "Added" : t("addToCart")}
    </button>
  );
}
