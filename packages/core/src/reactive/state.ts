import type { PropertyDeclaration } from 'lit';
import { ReactiveElement } from 'lit';

const STATE_MARKER = Symbol('tt-state-marker');
let initializerInstalled = false;

type StateMarker<T> = {
  [STATE_MARKER]: {
    options: PropertyDeclaration;
    defaultValue?: T;
    hasDefault: boolean;
  };
};

const isStateMarker = (value: unknown): value is StateMarker<unknown> =>
  typeof value === 'object' && value !== null && STATE_MARKER in value;

const installInitializer = () => {
  if (initializerInstalled) {
    return;
  }

  initializerInstalled = true;

  ReactiveElement.addInitializer(instance => {
    let processed = false;
    const instanceAny = instance as unknown as Record<string, unknown>;
    const instanceWithUpdate = instance as unknown as {
      connectedCallback?: () => void;
      update?: (...args: unknown[]) => unknown;
      performUpdate: (...args: unknown[]) => unknown;
    };

    const processMarkers = () => {
      if (processed) {
        return;
      }

      processed = true;

      const ctor = instance.constructor as typeof ReactiveElement;
      const keys = Object.keys(instance) as Array<keyof typeof instance>;

      for (const key of keys) {
        const value = instanceAny[key as string];

        if (!isStateMarker(value)) {
          continue;
        }

        const { options, defaultValue, hasDefault } = value[STATE_MARKER];
        ctor.createProperty(key as string, options);

        delete instanceAny[key as string];

        if (hasDefault) {
          instanceAny[key as string] = defaultValue;
        }
      }
    };

    const originalConnectedCallback = instanceWithUpdate.connectedCallback;
    if (originalConnectedCallback) {
      instanceWithUpdate.connectedCallback = () => {
        processMarkers();
        return originalConnectedCallback.call(instance);
      };
    }

    const originalUpdate = instanceWithUpdate.update;
    if (originalUpdate) {
      instanceWithUpdate.update = (...args) => {
        processMarkers();
        return originalUpdate.apply(instance, args);
      };
    }

    const originalPerformUpdate = instanceWithUpdate.performUpdate;
    instanceWithUpdate.performUpdate = (...args) => {
      processMarkers();
      return originalPerformUpdate.apply(instance, args);
    };
  });
};

export function state<T>(defaultValue: T, options?: PropertyDeclaration): T {
  installInitializer();

  const marker: StateMarker<T> = {
    [STATE_MARKER]: {
      options: { state: true, attribute: false, ...options },
      defaultValue,
      hasDefault: true,
    },
  };

  return marker as unknown as T;
}
