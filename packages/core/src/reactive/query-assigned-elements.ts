import type { ReactiveElement } from 'lit';

const QUERY_ASSIGNED_ELEMENTS = Symbol('tt-query-assigned-elements');

export interface QueryAssignedElementsOptions {
  /**
   * Name of the slot to query. Leave empty for the default slot.
   */
  slot?: string;
  /**
   * Whether to flatten the assigned elements.
   */
  flatten?: boolean;
  /**
   * CSS selector used to filter the elements returned.
   */
  selector?: string;
}

interface QueryAssignedElementsDescriptor {
  key: string | symbol;
  slot?: string;
  flatten?: boolean;
  selector?: string;
}

type QueryAssignedElementsMarker = {
  __queryAssignedElements: true;
  __slot?: string;
  __flatten?: boolean;
  __selector?: string;
};

function escapeSlotName(slot: string): string {
  if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
    return CSS.escape(slot);
  }

  return slot.replace(/"/g, '\\"');
}

/**
 * Creates a query descriptor for assigned elements in a slot.
 * When used as a class field initializer, automatically sets up a getter
 * that returns the assigned elements.
 *
 * @param options - Query options for slot, flattening, and selector filtering
 * @returns The query descriptor (converted to getter during initialization)
 *
 * @example
 * ```ts
 * class MyElement extends LitElement {
 *   readonly listItems = queryAssignedElements<HTMLElement>({ slot: 'list' });
 *   readonly unnamedSlotEls = queryAssignedElements<HTMLElement>();
 *
 *   override firstUpdated() {
 *     console.log(this.listItems.length);
 *   }
 * }
 * ```
 */
export const queryAssignedElements = <T extends Element = Element>(
  options?: QueryAssignedElementsOptions,
): T[] => {
  return {
    __queryAssignedElements: true,
    __slot: options?.slot,
    __flatten: options?.flatten,
    __selector: options?.selector,
  } as unknown as T[];
};

/**
 * Initializes all queryAssignedElements descriptors on an element.
 * Scans for query markers and converts them to getters.
 *
 * Called automatically during connectedCallback.
 *
 * @internal
 */
export const initializeQueryAssignedElements = (
  element: ReactiveElement,
): void => {
  const queries: QueryAssignedElementsDescriptor[] = [];
  const keys = Object.getOwnPropertyNames(element);

  for (const key of keys) {
    const descriptor = Object.getOwnPropertyDescriptor(element, key);
    const value = descriptor?.value as QueryAssignedElementsMarker | undefined;

    if (value?.__queryAssignedElements === true) {
      queries.push({
        key,
        slot: value.__slot,
        flatten: value.__flatten,
        selector: value.__selector,
      });
    }
  }

  if (queries.length === 0) {
    return;
  }

  (element as unknown as Record<symbol, QueryAssignedElementsDescriptor[]>)[
    QUERY_ASSIGNED_ELEMENTS
  ] = queries;

  for (const { key, slot, flatten, selector } of queries) {
    delete (element as unknown as Record<string | symbol, unknown>)[key];

    const slotSelector = slot
      ? `slot[name="${escapeSlotName(slot)}"]`
      : 'slot:not([name])';

    Object.defineProperty(element, key, {
      get(this: ReactiveElement): Element[] {
        const slotEl =
          this.renderRoot.querySelector<HTMLSlotElement>(slotSelector);
        const assigned =
          slotEl?.assignedElements({ flatten: Boolean(flatten) }) ?? [];

        if (!selector) {
          return assigned;
        }

        return assigned.filter(node => node.matches(selector));
      },
      enumerable: true,
      configurable: true,
    });
  }
};
