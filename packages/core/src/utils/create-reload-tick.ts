import { signal } from '@lit-labs/signals';

/**
 * Small shared helper for creating a signal-backed numeric reload trigger.
 *
 * Useful for forcing re-computation without changing other dependencies.
 */
export function createReloadTick(initialValue = 0) {
  return signal(initialValue);
}
