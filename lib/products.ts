import { supabase } from "./supabase";
import { Product, ProductCategory } from "./types";

export interface EnrichedProduct extends Product {
  manufacturerName: string;
  seriesName?: string;
  modelName: string;
}

const PART_TYPE_LABEL: Record<ProductCategory, string> = {
  rotor: "Rotor",
  stator: "Stator",
};

const PRODUCT_SELECT = `
  id,
  part_number,
  part_type,
  material,
  price,
  models (
    id,
    name,
    series (
      id,
      name,
      manufacturers ( id, name )
    )
  )
`;

interface ProductRow {
  id: string;
  part_number: string;
  part_type: string;
  material: string;
  price: number | null;
  models: {
    id: string;
    name: string;
    series: {
      id: string;
      name: string;
      manufacturers: { id: string; name: string } | null;
    } | null;
  } | null;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function toEnriched(row: ProductRow): EnrichedProduct {
  const model = row.models;
  const series = model?.series ?? null;
  const manufacturer = series?.manufacturers ?? null;
  const category = row.part_type as ProductCategory;
  const modelName = model?.name ?? "";
  const partLabel = PART_TYPE_LABEL[category] ?? row.part_type;

  return {
    id: row.id,
    partNumber: row.part_number,
    name: [modelName, partLabel, row.material].filter(Boolean).join(" "),
    description: [manufacturer?.name, modelName, `${category}, ${row.material}`]
      .filter(Boolean)
      .join(" "),
    manufacturer: manufacturer?.id ?? "",
    series: series?.id,
    model: model?.id ?? "",
    category,
    material: row.material,
    price: row.price,
    priceOnRequest: row.price == null,
    manufacturerName: manufacturer?.name ?? "",
    seriesName: series?.name,
    modelName,
  };
}

export async function getAllProducts(): Promise<EnrichedProduct[]> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .returns<ProductRow[]>();

  if (error) throw new Error(`Failed to load products: ${error.message}`);
  return (data ?? []).map(toEnriched);
}

export async function getProductsForModel(
  modelId: string,
  category: ProductCategory
): Promise<EnrichedProduct[]> {
  if (!UUID_RE.test(modelId)) return [];

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("model_id", modelId)
    .eq("part_type", category)
    .returns<ProductRow[]>();

  if (error) throw new Error(`Failed to load products for model: ${error.message}`);
  return (data ?? []).map(toEnriched);
}

export async function getProductById(id: string): Promise<EnrichedProduct | null> {
  if (!UUID_RE.test(id)) return null;

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("id", id)
    .maybeSingle()
    .returns<ProductRow>();

  if (error) throw new Error(`Failed to load product: ${error.message}`);
  return data ? toEnriched(data) : null;
}
