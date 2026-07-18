import { supabase } from "./supabase";
import { Product, ProductCategory } from "./types";

export interface EnrichedProduct extends Product {
  manufacturerName: string;
  seriesName?: string;
  modelName: string;
  modelSlug: string;
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
    slug,
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
    slug: string;
    series: {
      id: string;
      name: string;
      manufacturers: { id: string; name: string } | null;
    } | null;
  } | null;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Turns a part number into a URL/DOM-id-safe token (spaces/runs of whitespace become dashes). */
export function slugifyPartNumber(partNumber: string): string {
  return partNumber.trim().replace(/\s+/g, "-");
}

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
    modelSlug: model?.slug ?? "",
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

export interface GroupedModelProducts {
  rotors: EnrichedProduct[];
  stators: EnrichedProduct[];
}

/** All products for a model, split into rotor/stator groups (one query, both categories). */
export async function getProductsForModelGrouped(modelId: string): Promise<GroupedModelProducts> {
  if (!UUID_RE.test(modelId)) return { rotors: [], stators: [] };

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("model_id", modelId)
    .returns<ProductRow[]>();

  if (error) throw new Error(`Failed to load products for model: ${error.message}`);
  const products = (data ?? []).map(toEnriched);
  return {
    rotors: products.filter((p) => p.category === "rotor"),
    stators: products.filter((p) => p.category === "stator"),
  };
}
