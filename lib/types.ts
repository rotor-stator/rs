export type ProductCategory = "stator" | "rotor";

export interface Product {
  id: string;
  partNumber: string;
  name: string;
  description: string;
  manufacturer: string;
  series?: string;
  model: string;
  category: ProductCategory;
  material?: string;
  price?: number | null;
  priceOnRequest: boolean;
  imageUrl?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Manufacturer {
  id: string;
  name: string;
  logoUrl?: string;
}

export interface ManufacturerModel {
  id: string;
  name: string;
  manufacturerId: string;
}
