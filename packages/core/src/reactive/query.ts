import type { ReactiveElement } from 'lit';

const QUERY_DESCRIPTORS = Symbol('tt-query-descriptors');

interface QueryDescriptor {
  key: string | symbol;
  selector: string;
  cache: boolean;
}

/**
 * Creates a query descriptor for a DOM element selector.
 * When used as a class field initializer, automatically sets up a getter
 * that queries the renderRoot.
 *
 * @param selector - CSS selector to query
 * @param cache - Optional boolean that when true performs the DOM query only once and caches the result
 * @returns The query descriptor (converted to getter during initialization)
 *
 * @example
 * ```ts
 * class MyElement extends LitElement {
 *   readonly drawerRoot = query<HTMLElement>('#drawer');
 *   readonly cachedInput = query<HTMLInputElement>('input', true);
 *
 *   override firstUpdated() {
 *     console.log(this.drawerRoot?.tagName);
 *   }
 * }
 * ```
 */
export function query<T extends Element = Element>(
  selector: string,
  cache = false,
): T | null {
  // Return a sentinel object that marks this as a query
  return { __querySelector: selector, __cache: cache } as unknown as T | null;
}

/**
 * Initializes all query descriptors on an element.
 * Scans for query markers and converts them to getters.
 *
 * Called automatically during connectedCallback.
 *
 * @internal
 */
export function initializeQueries(element: ReactiveElement): void {
  // Collect all queries from public fields
  const queries: QueryDescriptor[] = [];
  const keys = Object.getOwnPropertyNames(element);

  for (const key of keys) {
    const descriptor = Object.getOwnPropertyDescriptor(element, key);
    const value = descriptor?.value;

    // Check if this is a query descriptor (has __querySelector)
    if (
      value &&
      typeof value === 'object' &&
      '__querySelector' in value &&
      typeof (value as Record<string, unknown>).__querySelector === 'string'
    ) {
      queries.push({
        key,
        selector: (value as Record<string, string>).__querySelector,
        cache: (value as Record<string, unknown>).__cache === true,
      });
    }
  }

  if (queries.length === 0) {
    return;
  }

  // Store queries for later reference
  (element as unknown as Record<symbol, QueryDescriptor[]>)[QUERY_DESCRIPTORS] =
    queries;

  // Create a map to track cached values per instance
  const cacheMap = new Map<symbol, Element | null>();

  // Install getters for each query
  for (const { key, selector, cache } of queries) {
    // Delete the placeholder value
    delete (element as unknown as Record<string | symbol, unknown>)[key];

    // Create a cache key for this property
    const cacheKey = Symbol(`${String(key)}.cache`);

    // Install a getter that queries the renderRoot
    Object.defineProperty(element, key, {
      get(this: ReactiveElement): Element | null {
        // Return cached value if caching is enabled
        if (cache) {
          if (cacheMap.has(cacheKey)) {
            return cacheMap.get(cacheKey) ?? null;
          }

          const result = this.renderRoot.querySelector(selector);
          cacheMap.set(cacheKey, result);
          return result;
        }

        // Query on every access if not caching
        return this.renderRoot.querySelector(selector);
      },
      enumerable: true,
      configurable: true,
    });
  }
}
