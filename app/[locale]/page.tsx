import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import SearchBar from "@/components/ui/SearchBar";
import CategoryCard from "@/components/ui/CategoryCard";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return { title: `RotorStator — ${t("headline")}` };
}

export default function HomePage() {
  const t = useTranslations("home");

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "60px 24px",
      }}
    >
      {/* Headline */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h1
          style={{
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 700,
            color: "var(--color-rs-ink)",
            letterSpacing: "-0.02em",
            marginBottom: 12,
          }}
        >
          {t("headline")}
        </h1>
        <p
          style={{
            fontSize: 16,
            color: "var(--color-rs-mid)",
            maxWidth: 540,
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          {t("subline")}
        </p>
      </div>

      {/* Search */}
      <div style={{ maxWidth: 640, margin: "0 auto 56px" }}>
        <SearchBar />
      </div>

      {/* Category cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        <CategoryCard
          href="stator"
          title={t("statorCard")}
          description={t("statorDesc")}
          icon="stator"
        />
        <CategoryCard
          href="rotor"
          title={t("rotorCard")}
          description={t("rotorDesc")}
          icon="rotor"
        />
      </div>
    </div>
  );
}
