import { supabase } from "./supabase";

export interface ModelOption {
  id: string;
  name: string;
  slug: string;
}

export interface SeriesOption {
  id: string;
  name: string;
  models: ModelOption[];
}

export interface ManufacturerOption {
  id: string;
  name: string;
  series: SeriesOption[];
}

interface ManufacturerRow {
  id: string;
  name: string;
  series: {
    id: string;
    name: string;
    models: { id: string; name: string; slug: string }[];
  }[];
}

/** Manufacturers with their series and models nested, sourced from Supabase. */
export async function getManufacturers(): Promise<ManufacturerOption[]> {
  const { data, error } = await supabase
    .from("manufacturers")
    .select("id, name, series ( id, name, models ( id, name, slug ) )")
    .returns<ManufacturerRow[]>();

  if (error) throw new Error(`Failed to load manufacturers: ${error.message}`);

  return (data ?? [])
    .map((m) => ({
      id: m.id,
      name: m.name,
      series: (m.series ?? [])
        .map((s) => ({
          id: s.id,
          name: s.name,
          models: [...(s.models ?? [])].sort((a, b) => a.name.localeCompare(b.name)),
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export interface ModelDetail {
  id: string;
  name: string;
  manufacturerName: string;
  seriesName: string;
}

interface ModelDetailRow {
  id: string;
  name: string;
  series: {
    name: string;
    manufacturers: { name: string } | null;
  } | null;
}

/** A model's own name plus its parent series/manufacturer names, looked up by slug. */
export async function getModelBySlug(slug: string): Promise<ModelDetail | null> {
  const trimmed = slug.trim();
  if (!trimmed) return null;

  const { data, error } = await supabase
    .from("models")
    .select("id, name, series ( name, manufacturers ( name ) )")
    .eq("slug", trimmed)
    .maybeSingle()
    .returns<ModelDetailRow>();

  if (error) throw new Error(`Failed to load model: ${error.message}`);
  if (!data) return null;

  return {
    id: data.id,
    name: data.name,
    manufacturerName: data.series?.manufacturers?.name ?? "",
    seriesName: data.series?.name ?? "",
  };
}
