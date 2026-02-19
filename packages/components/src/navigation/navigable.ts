export const NAVIGABLE_KEYS = {
  ArrowDown: 'ArrowDown',
  ArrowUp: 'ArrowUp',
  Home: 'Home',
  End: 'End',
} as const;

export type NavigableValues = (typeof NAVIGABLE_KEYS)[keyof typeof NAVIGABLE_KEYS];

export const navigableKeySet = new Set(Object.values(NAVIGABLE_KEYS));

/**
 * Utility function to check if a given key is one of the defined navigable keys.
 * This can be used in event handlers to determine if the key event should trigger
 * navigation behavior.
 */
export function isNavigableKey(key: string): key is NavigableValues {
  return navigableKeySet.has(key as NavigableValues);
}
