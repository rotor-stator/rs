import { supabase } from "./supabase";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface ManufacturerSummary {
  id: string;
  name: string;
  slug: string;
}

export interface SeriesSummary {
  id: string;
  name: string;
  slug: string;
}

export interface ModelSummary {
  id: string;
  name: string;
  slug: string;
}

/** Flat manufacturer list — no nested series/models, so this stays cheap at any catalog size. */
export async function getManufacturers(): Promise<ManufacturerSummary[]> {
  const { data, error } = await supabase
    .from("manufacturers")
    .select("id, name, slug")
    .order("name");

  if (error) throw new Error(`Failed to load manufacturers: ${error.message}`);
  return data ?? [];
}

export async function getManufacturerBySlug(slug: string): Promise<ManufacturerSummary | null> {
  const trimmed = slug.trim();
  if (!trimmed) return null;

  const { data, error } = await supabase
    .from("manufacturers")
    .select("id, name, slug")
    .eq("slug", trimmed)
    .maybeSingle();

  if (error) throw new Error(`Failed to load manufacturer: ${error.message}`);
  return data ?? null;
}

/** Series for one manufacturer — only fetched once a manufacturer is selected. */
export async function getSeriesForManufacturer(manufacturerId: string): Promise<SeriesSummary[]> {
  if (!UUID_RE.test(manufacturerId)) return [];

  const { data, error } = await supabase
    .from("series")
    .select("id, name, slug")
    .eq("manufacturer_id", manufacturerId)
    .order("name");

  if (error) throw new Error(`Failed to load series: ${error.message}`);
  return data ?? [];
}

/**
 * Models for one series — only fetched once a series is selected. Returned
 * flat (no per-model detail) so a 100+ model series stays a cheap, single
 * query filtered client-side rather than something that needs pagination.
 */
export async function getModelsForSeries(seriesId: string): Promise<ModelSummary[]> {
  if (!UUID_RE.test(seriesId)) return [];

  const { data, error } = await supabase
    .from("models")
    .select("id, name, slug")
    .eq("series_id", seriesId)
    .order("name");

  if (error) throw new Error(`Failed to load models: ${error.message}`);
  return data ?? [];
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
