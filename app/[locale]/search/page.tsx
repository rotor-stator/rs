import { useTranslations } from "next-intl";
import productsData from "@/data/products.json";
import manufacturers from "@/data/manufacturers";
import { Product } from "@/lib/types";
import SearchBar from "@/components/ui/SearchBar";
import ProductCard from "@/components/ui/ProductCard";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

function getAllProducts(): Product[] {
  const products: Product[] = [];
  for (const mfr of manufacturers) {
    for (const series of mfr.series) {
      for (const model of series.models) {
        const data = (productsData as Record<string, Record<string, { stator: Omit<Product, "id" | "manufacturer" | "model" | "category">[]; rotor: Omit<Product, "id" | "manufacturer" | "model" | "category">[] }>>);
        const entry = data[mfr.id]?.[model.id];
        if (!entry) continue;
        for (const p of entry.stator ?? []) {
          products.push({ ...p, id: p.partNumber, manufacturer: mfr.id, series: series.id, model: model.id, category: "stator" });
        }
        for (const p of entry.rotor ?? []) {
          products.push({ ...p, id: p.partNumber, manufacturer: mfr.id, series: series.id, model: model.id, category: "rotor" });
        }
      }
    }
  }
  return products;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const t = useTranslations("search");
  const tCommon = useTranslations("common");

  const query = q?.trim() ?? "";
  const results = query
    ? getAllProducts().filter(
        (p) =>
          p.partNumber.toLowerCase().includes(query.toLowerCase()) ||
          p.name.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 24px" }}>
      <div style={{ maxWidth: 640, marginBottom: 40 }}>
        <SearchBar />
      </div>

      {query && (
        <h2
          style={{
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--color-rs-mid)",
            marginBottom: 20,
          }}
        >
          {results.length > 0
            ? t("resultsFor", { query })
            : t("noResults", { query })}
        </h2>
      )}

      {results.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
