import { ReactiveElement } from 'lit';
import { initializeProperties } from './property';
import { initializeStates } from './state';

type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * Mixin that initializes properties and states created with the property() and state() functions.
 * Apply this to your base class to enable automatic property/state initialization.
 *
 * @example
 * ```typescript
 * import { LitElement } from 'lit';
 * import { TaffyMixin } from '@tt/core/reactive';
 *
 * class MyElement extends TaffyMixin(LitElement) {
 *   opened = property(false, { type: Boolean, reflect: true });
 *   count = state(0);
 * }
 * ```
 */
export function TaffyMixin<T extends Constructor<ReactiveElement>>(base: T) {
  return class extends base {
    constructor(...args: any[]) {
      super(...args);

      // Defer initialization to next microtask to ensure field initializers have run
      // Field initializers run AFTER constructor completes in JavaScript
      queueMicrotask(() => {
        initializeProperties(this);
        initializeStates(this);
      });
    }
  };
}

/**
 * Base class that extends ReactiveElement with automatic property/state initialization.
 * Use this as your base class if you don't need other mixins.
 *
 * @example
 * ```typescript
 * import { TaffyElement } from '@tt/core/reactive';
 *
 * class MyElement extends TaffyElement {
 *   opened = property(false, { type: Boolean, reflect: true });
 *   count = state(0);
 * }
 * ```
 */
export class TaffyElement extends ReactiveElement {
  constructor() {
    super();

    // Defer initialization to next microtask to ensure field initializers have run
    queueMicrotask(() => {
      initializeProperties(this);
      initializeStates(this);
      this.requestUpdate();
    });
  }
}
