const formatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR" });

/** Formats a price in EUR (e.g. "€1,234.00"), or null when no price is set. */
export function formatPrice(price: number | null | undefined): string | null {
  if (price == null) return null;
  return formatter.format(price);
}
