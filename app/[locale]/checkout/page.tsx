"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useCart } from "@/components/cart/CartContext";
import { useRouter } from "next/navigation";

interface FormState {
  name: string;
  email: string;
  phone: string;
  company: string;
  notes: string;
}

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    company: "",
    notes: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  function update(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items, locale }),
      });
      if (!res.ok) throw new Error();
      clearCart();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div style={{ maxWidth: 600, margin: "80px auto", padding: "0 24px", textAlign: "center" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            backgroundColor: "#16a34a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            color: "#fff",
            fontSize: 28,
          }}
        >
          ✓
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--color-rs-ink)", marginBottom: 12 }}>
          {t("success")}
        </h2>
        <button
          onClick={() => router.push(`/${locale}`)}
          style={{
            marginTop: 16,
            padding: "10px 24px",
            backgroundColor: "var(--color-rs-orange)",
            color: "#fff",
            border: "none",
            borderRadius: 2,
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "var(--font-sans)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          ← Home
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "48px 24px" }}>
      <h1
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "var(--color-rs-ink)",
          marginBottom: 8,
        }}
      >
        {t("title")}
      </h1>

      {/* Order summary */}
      {items.length > 0 && (
        <div
          style={{
            marginBottom: 32,
            padding: 16,
            backgroundColor: "var(--color-rs-light)",
            borderRadius: 2,
            fontSize: 13,
            color: "var(--color-rs-mid)",
          }}
        >
          {items.map(({ product, quantity }) => (
            <div key={product.id} style={{ display: "flex", justifyContent: "space-between" }}>
              <span>{product.name}</span>
              <span style={{ fontWeight: 600 }}>× {quantity}</span>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <FieldGroup>
          <Label>{t("name")} *</Label>
          <Input
            required
            value={form.name}
            onChange={(v) => update("name", v)}
          />
        </FieldGroup>

        <FieldGroup>
          <Label>{t("email")} *</Label>
          <Input
            type="email"
            required
            value={form.email}
            onChange={(v) => update("email", v)}
          />
        </FieldGroup>

        <FieldGroup>
          <Label>{t("phone")} *</Label>
          <Input
            type="tel"
            required
            value={form.phone}
            onChange={(v) => update("phone", v)}
          />
        </FieldGroup>

        <FieldGroup>
          <Label>{t("company")}</Label>
          <Input value={form.company} onChange={(v) => update("company", v)} />
        </FieldGroup>

        <FieldGroup>
          <Label>{t("notes")}</Label>
          <textarea
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            rows={4}
            style={{
              ...inputStyle,
              resize: "vertical",
              minHeight: 100,
            }}
          />
        </FieldGroup>

        {status === "error" && (
          <p style={{ color: "#dc2626", fontSize: 13 }}>{t("error")}</p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          style={{
            padding: "14px 32px",
            backgroundColor: "var(--color-rs-orange)",
            color: "#fff",
            border: "none",
            borderRadius: 2,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            cursor: status === "submitting" ? "not-allowed" : "pointer",
            opacity: status === "submitting" ? 0.7 : 1,
            fontFamily: "var(--font-sans)",
            alignSelf: "flex-start",
          }}
        >
          {status === "submitting" ? t("submitting") : t("submit")}
        </button>
      </form>
    </div>
  );
}

function FieldGroup({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>{children}</div>;
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label
      style={{
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: "var(--color-rs-mid)",
      }}
    >
      {children}
    </label>
  );
}

function Input({
  type = "text",
  required,
  value,
  onChange,
}: {
  type?: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      type={type}
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={inputStyle}
      onFocus={(e) => (e.target.style.borderColor = "var(--color-rs-orange)")}
      onBlur={(e) => (e.target.style.borderColor = "var(--color-rs-border)")}
    />
  );
}

const inputStyle: React.CSSProperties = {
  padding: "10px 14px",
  fontSize: 14,
  border: "1px solid var(--color-rs-border)",
  borderRadius: 2,
  outline: "none",
  fontFamily: "var(--font-sans)",
  color: "var(--color-rs-ink)",
  width: "100%",
  transition: "border-color 0.15s",
};
