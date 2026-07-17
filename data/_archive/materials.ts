import { ProductCategory } from "@/lib/types";

export interface MaterialConfig {
  id: string;
  name: string;
}

export const statorMaterials: MaterialConfig[] = [
  { id: "nbr", name: "NBR" },
  { id: "epdm", name: "EPDM" },
  { id: "fkm", name: "FKM (Viton)" },
];

export const rotorMaterials: MaterialConfig[] = [
  { id: "chrome-steel", name: "Chrome-Plated Steel" },
  { id: "stainless-316", name: "Stainless Steel 316" },
  { id: "duplex", name: "Duplex Steel" },
];

export function materialsFor(category: ProductCategory): MaterialConfig[] {
  return category === "stator" ? statorMaterials : rotorMaterials;
}
