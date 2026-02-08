import type { ReactiveElement } from 'lit';

const queryCache = new WeakMap<ReactiveElement, Map<string, Element | null>>();

/**
 * Queries the component's render root for a given selector and caches the result.
 * The cache is updated after the component has updated at least once, ensuring that it reflects the latest DOM structure.
 * If the cache option is enabled, the query result will be stored and returned on subsequent calls with the same selector.
 * The cache is automatically invalidated when the component updates, ensuring that it always reflects the current state of the DOM.
 *
 * @param selector - The CSS selector to query for.
 * @param cache - Whether to cache the query result. Defaults to false.
 * @returns A function that takes a ReactiveElement and returns the queried Element or null.
 * @example
 * ```ts
 * import { LitElement, html } from 'lit';
 * import { customElement, query } from 'lit/decorators.js';
 *
 * class MyElement extends LitElement {
 *   myButton = query<HTMLButtonElement>('.my-button', true);
 * }
 * ```
 */
export const query = <T extends Element = Element>(selector: string, cache?: boolean) => {
  return (el: ReactiveElement): T | null => {
    if (cache) {
      let elementCache = queryCache.get(el);
      if (elementCache?.has(selector)) {
        return elementCache.get(selector) as T | null;
      }
    }

    const result = (el.renderRoot?.querySelector(selector) ?? null) as T | null;

    if (cache && (result !== null || el.hasUpdated)) {
      let elementCache = queryCache.get(el);
      if (!elementCache) {
        elementCache = new Map();
        queryCache.set(el, elementCache);
      }
      elementCache.set(selector, result);
    }

    return result;
  };
};
