import Fuse from "fuse.js";
import { getAllProducts, EnrichedProduct } from "./products";

const CACHE_TTL_MS = 60_000;

let fuseInstance: Fuse<EnrichedProduct> | null = null;
let cachedAt = 0;
let loadPromise: Promise<Fuse<EnrichedProduct>> | null = null;

async function getFuse(): Promise<Fuse<EnrichedProduct>> {
  const isStale = !fuseInstance || Date.now() - cachedAt > CACHE_TTL_MS;
  if (isStale && !loadPromise) {
    loadPromise = getAllProducts()
      .then((products) => {
        fuseInstance = new Fuse(products, {
          keys: [
            { name: "partNumber", weight: 0.5 },
            { name: "modelName", weight: 0.3 },
            { name: "name", weight: 0.2 },
          ],
          useExtendedSearch: true,
          ignoreLocation: true,
          threshold: 0.3,
        });
        cachedAt = Date.now();
        return fuseInstance;
      })
      .finally(() => {
        loadPromise = null;
      });
  }
  return loadPromise ?? fuseInstance!;
}

/**
 * Case-insensitive partial match on part number / pump model / product name.
 * Prefixing the query with `'` switches Fuse into "include" mode, which
 * requires a literal substring match instead of typo-tolerant fuzzy scoring.
 */
export async function searchProducts(query: string, limit?: number): Promise<EnrichedProduct[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  const fuse = await getFuse();
  const results = fuse.search(`'${q}`, limit ? { limit } : undefined);
  return results.map((r) => r.item);
}
