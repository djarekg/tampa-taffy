import { ReactiveElement } from 'lit';
import { initializeProperties } from './property';
import { initializeQueries } from './query';
import { initializeStates } from './state';

// Track which elements have been initialized to avoid duplicate initialization
const initializedElements = new WeakSet<ReactiveElement>();

/**
 * Ensures a reactive element has been initialized (properties, states, and queries set up).
 * This is called automatically in connectedCallback.
 *
 * @internal
 */
export function ensureInitialized(element: ReactiveElement): void {
  if (initializedElements.has(element)) {
    return;
  }

  initializeProperties(element);
  initializeStates(element);
  initializeQueries(element);
  initializedElements.add(element);
}

// Hook into ReactiveElement.connectedCallback to auto-initialize
// This allows users to just extend LitElement without any special setup
const originalConnectedCallback = ReactiveElement.prototype.connectedCallback;
ReactiveElement.prototype.connectedCallback = function (this: ReactiveElement) {
  ensureInitialized(this);
  originalConnectedCallback.call(this);
};
