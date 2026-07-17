import { supabase } from "./supabase";

export interface ModelOption {
  id: string;
  name: string;
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
    models: { id: string; name: string }[];
  }[];
}

/** Manufacturers with their series and models nested, sourced from Supabase. */
export async function getManufacturers(): Promise<ManufacturerOption[]> {
  const { data, error } = await supabase
    .from("manufacturers")
    .select("id, name, series ( id, name, models ( id, name ) )")
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
