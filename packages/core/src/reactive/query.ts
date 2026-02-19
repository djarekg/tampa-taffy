import type { ReactiveElement } from 'lit';

const QUERY_DESCRIPTORS = Symbol('tt-query-descriptors');

interface QueryDescriptor {
  key: string | symbol;
  selector: string;
}

/**
 * Creates a query descriptor for a DOM element selector.
 * When used as a class field initializer, automatically sets up a getter
 * that queries the renderRoot.
 *
 * @param selector - CSS selector to query
 * @returns The query descriptor (converted to getter during initialization)
 *
 * @example
 * ```ts
 * class MyElement extends LitElement {
 *   readonly drawerRoot = query<HTMLElement>('#drawer');
 *
 *   override firstUpdated() {
 *     console.log(this.drawerRoot?.tagName);
 *   }
 * }
 * ```
 */
export function query<T extends Element = Element>(selector: string): T | null {
  // Return a sentinel object that marks this as a query
  return { __querySelector: selector } as unknown as T | null;
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
    const value = (element as any)[key];

    // Check if this is a query descriptor (has __querySelector)
    if (value && typeof value === 'object' && '__querySelector' in value) {
      queries.push({
        key,
        selector: value.__querySelector,
      });
    }
  }

  if (queries.length === 0) {
    return;
  }

  // Store queries for later reference
  (element as any)[QUERY_DESCRIPTORS] = queries;

  // Install getters for each query
  for (const { key, selector } of queries) {
    // Delete the placeholder value
    delete (element as any)[key];

    // Install a simple getter that queries the renderRoot
    Object.defineProperty(element, key, {
      get(this: ReactiveElement) {
        return this.renderRoot?.querySelector(selector) ?? null;
      },
      enumerable: true,
      configurable: true,
    });
  }
}
