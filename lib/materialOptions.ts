import { ProductCategory } from "./types";

/**
 * The Supabase schema stores `material` as free text on each product row —
 * there's no materials table. This list is just the picker vocabulary shown
 * in the selection flow, kept in code rather than the database.
 */
export interface MaterialOption {
  id: string;
  name: string;
}

const statorMaterials: MaterialOption[] = [
  { id: "nbr", name: "NBR" },
  { id: "epdm", name: "EPDM" },
  { id: "fkm", name: "FKM (Viton)" },
];

const rotorMaterials: MaterialOption[] = [
  { id: "chrome-steel", name: "Chrome-Plated Steel" },
  { id: "stainless-316", name: "Stainless Steel 316" },
  { id: "duplex", name: "Duplex Steel" },
];

export function materialsFor(category: ProductCategory): MaterialOption[] {
  return category === "stator" ? statorMaterials : rotorMaterials;
}
