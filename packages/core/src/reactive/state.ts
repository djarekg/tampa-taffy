import { signal } from '@lit-labs/signals';
import type { PropertyDeclaration } from 'lit';
import { ReactiveElement } from 'lit';

const STATE_SIGNAL = Symbol('tt-state-signal');

type StateSignal<T> = ReturnType<typeof signal<T>> & {
  [STATE_SIGNAL]: PropertyDeclaration;
};

export function state<T>(defaultValue: T, options?: PropertyDeclaration): T {
  const sig = signal(defaultValue) as StateSignal<T>;
  sig[STATE_SIGNAL] = { state: true, attribute: false, ...options };
  return sig as unknown as T;
}

export function initializeStates(element: ReactiveElement): void {
  const keys = Object.getOwnPropertyNames(element);

  for (const key of keys) {
    const value = (element as any)[key];

    if (value && typeof value === 'object' && STATE_SIGNAL in value) {
      const sig = value as StateSignal<unknown>;
      const backingKey = `__${key}_signal__`;

      // Store the signal in a backing field on the instance
      (element as any)[backingKey] = sig;

      // Check if the parent already set this property before initialization
      const existingInstanceValue = (element as any)[key];
      if (existingInstanceValue !== sig) {
        // Migrate existing value to the signal
        sig.set(existingInstanceValue);
      }

      // Delete the instance property
      delete (element as any)[key];

      // Install accessor on the PROTOTYPE
      const proto = Object.getPrototypeOf(element);

      // Only install if not already present (avoid reinstalling for multiple instances)
      if (
        !Object.getOwnPropertyDescriptor(proto, key) ||
        Object.getOwnPropertyDescriptor(proto, key)?.configurable
      ) {
        Object.defineProperty(proto, key, {
          get(this: ReactiveElement) {
            const bk = `__${key}_signal__`;
            const signal = (this as any)[bk];
            if (!signal) {
              return undefined;
            }
            return signal.get();
          },
          set(this: ReactiveElement, newValue: unknown) {
            const bk = `__${key}_signal__`;
            const signal = (this as any)[bk];
            if (!signal) {
              return;
            }
            const oldValue = signal.get();
            signal.set(newValue);

            if (oldValue !== newValue) {
              this.requestUpdate(key, oldValue);
            }
          },
          enumerable: true,
          configurable: true,
        });
      }
    }
  }
}
