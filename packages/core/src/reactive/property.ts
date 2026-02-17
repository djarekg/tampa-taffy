import type { PropertyDeclaration } from 'lit';
import { ReactiveElement } from 'lit';

const PROPERTY_MARKER = Symbol('tt-property-marker');
let initializerInstalled = false;

type PropertyMarker<T> = {
  [PROPERTY_MARKER]: {
    options: PropertyDeclaration;
    defaultValue?: T;
    hasDefault: boolean;
  };
};

const isPropertyMarker = (value: unknown): value is PropertyMarker<unknown> =>
  typeof value === 'object' && value !== null && PROPERTY_MARKER in value;

const installInitializer = () => {
  if (initializerInstalled) {
    return;
  }

  initializerInstalled = true;

  ReactiveElement.addInitializer(instance => {
    const ctor = instance.constructor as typeof ReactiveElement;
    const keys = Object.keys(instance) as Array<keyof typeof instance>;
    const instanceAny = instance as unknown as Record<string, unknown>;

    for (const key of keys) {
      const value = instanceAny[key as string];

      if (!isPropertyMarker(value)) {
        continue;
      }

      const { options, defaultValue, hasDefault } = value[PROPERTY_MARKER];
      ctor.createProperty(key as string, options);

      delete instanceAny[key as string];

      if (hasDefault) {
        instanceAny[key as string] = defaultValue;
      }
    }
  });
};

export function property<T>(defaultValue: T, options?: PropertyDeclaration): T {
  installInitializer();

  const marker: PropertyMarker<T> = {
    [PROPERTY_MARKER]: {
      options: { type: String, ...options },
      defaultValue,
      hasDefault: true,
    },
  };

  return marker as unknown as T;
}
