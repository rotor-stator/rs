import Fuse from "fuse.js";
import { getAllProducts, EnrichedProduct } from "./products";

let fuseInstance: Fuse<EnrichedProduct> | null = null;

function getFuse(): Fuse<EnrichedProduct> {
  if (!fuseInstance) {
    fuseInstance = new Fuse(getAllProducts(), {
      keys: [
        { name: "partNumber", weight: 0.5 },
        { name: "modelName", weight: 0.3 },
        { name: "name", weight: 0.2 },
      ],
      useExtendedSearch: true,
      ignoreLocation: true,
      threshold: 0.3,
    });
  }
  return fuseInstance;
}

/**
 * Case-insensitive partial match on part number / pump model / product name.
 * Prefixing the query with `'` switches Fuse into "include" mode, which
 * requires a literal substring match instead of typo-tolerant fuzzy scoring.
 */
export function searchProducts(query: string, limit?: number): EnrichedProduct[] {
  const q = query.trim();
  if (q.length < 2) return [];
  const results = getFuse().search(`'${q}`, limit ? { limit } : undefined);
  return results.map((r) => r.item);
}
