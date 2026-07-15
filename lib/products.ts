import manufacturers from "@/data/manufacturers";
import productsData from "@/data/products.json";
import { Product, ProductCategory } from "./types";

type RawProduct = Omit<Product, "id" | "manufacturer" | "model" | "category">;
type ProductsData = Record<
  string,
  Record<string, { stator?: RawProduct[]; rotor?: RawProduct[] }>
>;

export interface EnrichedProduct extends Product {
  manufacturerName: string;
  seriesName?: string;
  modelName: string;
}

const CATEGORIES: ProductCategory[] = ["stator", "rotor"];

export function getAllProducts(): EnrichedProduct[] {
  const data = productsData as ProductsData;
  const products: EnrichedProduct[] = [];

  for (const mfr of manufacturers) {
    for (const series of mfr.series) {
      for (const model of series.models) {
        const entry = data[mfr.id]?.[model.id];
        if (!entry) continue;
        for (const category of CATEGORIES) {
          for (const p of entry[category] ?? []) {
            products.push({
              ...p,
              id: p.partNumber,
              manufacturer: mfr.id,
              series: series.id,
              model: model.id,
              category,
              manufacturerName: mfr.name,
              seriesName: series.name,
              modelName: model.name,
            });
          }
        }
      }
    }
  }

  return products;
}

export function getProductById(id: string): EnrichedProduct | null {
  return getAllProducts().find((p) => p.id === id) ?? null;
}
