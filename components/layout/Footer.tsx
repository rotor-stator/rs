import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer
      style={{
        backgroundColor: "var(--color-rs-steel)",
        borderTop: "1px solid var(--color-rs-mid)",
        marginTop: "auto",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "32px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <p
          style={{
            color: "var(--color-rs-border)",
            fontSize: 13,
            margin: 0,
          }}
        >
          {t("tagline")}
        </p>
        <p
          style={{
            color: "var(--color-rs-mid)",
            fontSize: 12,
            margin: 0,
          }}
        >
          © {new Date().getFullYear()} RotorStator. {t("rights")}
        </p>
      </div>
    </footer>
  );
}
