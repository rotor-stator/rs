"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Mail, Phone, MapPin, User } from "lucide-react";

export default function ContactPage() {
  const t = useTranslations("contact");
  const tc = useTranslations("company");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px" }}>
      <h1
        style={{
          fontSize: 32,
          fontWeight: 700,
          color: "var(--color-rs-ink)",
          marginBottom: 8,
        }}
      >
        {t("title")}
      </h1>
      <p style={{ fontSize: 16, color: "var(--color-rs-mid)", marginBottom: 48, maxWidth: 500 }}>
        {t("subtitle")}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: 60,
          alignItems: "start",
        }}
      >
        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Field label={t("name")}>
            <Input
              required
              value={form.name}
              onChange={(v) => setForm((p) => ({ ...p, name: v }))}
            />
          </Field>
          <Field label={t("email")}>
            <Input
              type="email"
              required
              value={form.email}
              onChange={(v) => setForm((p) => ({ ...p, email: v }))}
            />
          </Field>
          <Field label={t("message")}>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
              style={{ ...inputStyle, resize: "vertical" }}
              onFocus={(e) => (e.target.style.borderColor = "var(--color-rs-orange)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--color-rs-border)")}
            />
          </Field>

          {status === "success" && (
            <p style={{ color: "#16a34a", fontSize: 14, fontWeight: 500 }}>{t("success")}</p>
          )}
          {status === "error" && (
            <p style={{ color: "#dc2626", fontSize: 14 }}>{t("error")}</p>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            style={{
              padding: "12px 28px",
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
            {status === "submitting" ? t("sending") : t("send")}
          </button>
        </form>

        {/* Contact info */}
        <div
          style={{
            backgroundColor: "var(--color-rs-light)",
            padding: 32,
            borderRadius: 4,
            borderLeft: "3px solid var(--color-rs-orange)",
          }}
        >
          <p
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "var(--color-rs-ink)",
              margin: "0 0 24px",
            }}
          >
            {tc("companyName")}
          </p>
          <ContactRow icon={<User size={16} />} label={t("contactPerson")}>
            <span>{tc("contactPersonName")}</span>
          </ContactRow>
          <ContactRow icon={<MapPin size={16} />} label={t("address")}>
            <span>{tc("companyAddress")}</span>
          </ContactRow>
          <ContactRow icon={<Phone size={16} />} label={t("phone")}>
            <a
              href={`tel:${tc("companyPhone").replace(/\s+/g, "")}`}
              style={{ color: "var(--color-rs-ink)", textDecoration: "none" }}
            >
              {tc("companyPhone")}
            </a>
          </ContactRow>
          <ContactRow icon={<Mail size={16} />} label={t("emailLabel")}>
            <a
              href={`mailto:${tc("companyEmail")}`}
              style={{ color: "var(--color-rs-orange)", textDecoration: "none" }}
            >
              {tc("companyEmail")}
            </a>
          </ContactRow>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label
        style={{
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "var(--color-rs-mid)",
        }}
      >
        {label}
      </label>
      {children}
    </div>
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

function ContactRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 4,
          color: "var(--color-rs-mid)",
        }}
      >
        {icon}
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
      </div>
      <div style={{ fontSize: 14, color: "var(--color-rs-ink)", paddingLeft: 24 }}>
        {children}
      </div>
    </div>
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
  backgroundColor: "#fff",
};
