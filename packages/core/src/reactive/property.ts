import { signal } from '@lit-labs/signals';
import type { PropertyDeclaration } from 'lit';
import { ReactiveElement } from 'lit';

const PROPERTY_SIGNAL = Symbol.for('tt-property-signal');

export interface PropertyOptions extends PropertyDeclaration {
  changed?: (newValue: unknown) => void;
}

type PropertySignal<T> = ReturnType<typeof signal<T>> & {
  [PROPERTY_SIGNAL]: PropertyOptions;
};

// Store map of property names to their signal backing keys per element class
const propertySignalMap = new WeakMap<Function, Map<string, string>>();

export function property<T>(defaultValue: T, options?: PropertyOptions): T {
  const sig = signal(defaultValue) as PropertySignal<T>;

  // Automatically infer type from default value if not explicitly provided
  let inferredType = String;
  if (typeof defaultValue === 'boolean') {
    inferredType = Boolean;
  } else if (typeof defaultValue === 'number') {
    inferredType = Number;
  } else if (Array.isArray(defaultValue)) {
    inferredType = Array;
  } else if (typeof defaultValue === 'object' && defaultValue !== null) {
    inferredType = Object;
  }

  sig[PROPERTY_SIGNAL] = { type: inferredType, ...options };
  return sig as unknown as T;
}

export function initializeProperties(element: ReactiveElement): void {
  const ctor = element.constructor as typeof ReactiveElement;

  // Get or create the property-to-backingKey map for this class
  let propMap = propertySignalMap.get(ctor);
  if (!propMap) {
    propMap = new Map();
    propertySignalMap.set(ctor, propMap);
  }

  // Get all own properties, not just enumerable ones
  const keys = Object.getOwnPropertyNames(element);

  for (const key of keys) {
    let propertyName: string;
    let backingKey: string;
    let sig: PropertySignal<unknown> | undefined;

    // Check if this is a backing field (from constructor hitting the setter on 2nd+ instance)
    if (key.startsWith('__') && key.endsWith('_signal__')) {
      // Extract property name from backing field: __ariaRole_signal__ -> ariaRole
      propertyName = key.slice(2, -9);
      backingKey = key;
      sig = (element as any)[backingKey];

      // Verify it's actually a signal
      if (!sig || !(PROPERTY_SIGNAL in sig)) {
        continue;
      }
    } else {
      // Regular property - check if it's a signal
      propertyName = key;
      backingKey = `__${key}_signal__`;

      // Check if the backing field already exists
      sig = (element as any)[backingKey];

      // If not in backing field, check if it's on the instance property itself
      if (!sig || !(PROPERTY_SIGNAL in sig)) {
        const value = (element as any)[key];
        if (value && typeof value === 'object' && PROPERTY_SIGNAL in value) {
          sig = value as PropertySignal<unknown>;
        } else {
          continue; // Not a property signal, skip it
        }
      }
    }

    const options = sig[PROPERTY_SIGNAL];

    // Store the signal in a backing field on the instance (if not already there)
    if ((element as any)[backingKey] !== sig) {
      (element as any)[backingKey] = sig;
    }

    // Record this mapping for attribute change handling
    propMap.set(propertyName, backingKey);

    // Check if the parent already set this property before initialization
    const existingInstanceValue = (element as any)[propertyName];
    if (existingInstanceValue !== sig) {
      // Parent set the property to something - migrate that value to the signal
      const oldValue = sig.get();
      const hasChanged = options?.hasChanged
        ? options.hasChanged.call(element, existingInstanceValue, oldValue)
        : existingInstanceValue !== oldValue;

      if (hasChanged) {
        console.log('[property] value changed (init)', {
          propertyName,
          oldValue,
          newValue: existingInstanceValue,
        });
        sig.set(existingInstanceValue);
        options?.changed?.call(element, existingInstanceValue);
      }
    }

    // Delete the instance field
    delete (element as any)[propertyName];

    // Tell Lit about this property so it sets up attribute observation
    ctor.createProperty(propertyName, options);

    // Check if there's an existing attribute value and sync it to the signal
    // This handles attributes that were set before initialization (e.g., in HTML)
    const attributeName =
      options.attribute === false
        ? null
        : typeof options.attribute === 'string'
          ? options.attribute
          : propertyName.toLowerCase();

    if (attributeName) {
      const attrValue = element.getAttribute(attributeName);
      if (attrValue !== null) {
        // Convert string attribute to the correct type
        let newVal: unknown = attrValue;
        if (options.type === Boolean) {
          newVal = true; // Presence of attribute means true
        } else if (options.type === Number) {
          newVal = Number(attrValue);
        }
        sig.set(newVal);
      }
    }

    // Now install our signal-syncing accessor on top of Lit's property
    const proto = Object.getPrototypeOf(element);
    if (
      // oxlint-disable-next-line typescript/prefer-optional-chain
      !Object.getOwnPropertyDescriptor(proto, propertyName) ||
      Object.getOwnPropertyDescriptor(proto, propertyName)?.configurable
    ) {
      Object.defineProperty(proto, propertyName, {
        get(this: ReactiveElement) {
          const bk = `__${propertyName}_signal__`;
          const signal = (this as any)[bk];
          if (!signal) {
            return undefined;
          }
          // oxlint-disable-next-line typescript/no-unsafe-return
          return signal.get();
        },
        set(this: ReactiveElement, newValue: unknown) {
          const bk = `__${propertyName}_signal__`;

          // Check if newValue is a signal being assigned from constructor
          // This handles subsequent instances after the accessor is already on the prototype
          if (
            newValue &&
            typeof newValue === 'object' &&
            PROPERTY_SIGNAL in newValue
          ) {
            (this as any)[bk] = newValue;
            return;
          }

          const signal = (this as any)[bk];
          if (!signal) {
            return;
          }
          const oldValue = signal.get();
          const propOptions = signal[PROPERTY_SIGNAL];
          const hasChanged = propOptions?.hasChanged
            ? propOptions.hasChanged.call(this, newValue, oldValue)
            : oldValue !== newValue;

          if (hasChanged) {
            console.log('[property] value changed', {
              propertyName,
              oldValue,
              newValue,
            });
            signal.set(newValue);
            propOptions?.changed?.call(this, newValue);
            // Trigger Lit update cycle
            this.requestUpdate(propertyName, oldValue);
          }
        },
        enumerable: true,
        configurable: true,
      });
    }
  }

  // Set up MutationObserver to watch attribute changes on this element instance
  // We use this instead of attributeChangedCallback because observedAttributes
  // must be set at class definition time, not dynamically at instance time
  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes' && mutation.attributeName) {
        const attrName = mutation.attributeName;

        // Find the property that corresponds to this attribute
        // oxlint-disable-next-line typescript/no-unnecessary-condition
        if (propMap) {
          for (const [propName, backingKey] of propMap) {
            const propOptions = (ctor as any).getPropertyOptions?.(propName);
            // Check if this attribute name matches this property's attribute name
            if (propOptions?.attribute === attrName || propName === attrName) {
              const attrValue = (element as any).getAttribute(attrName);
              const signal = (element as any)[backingKey];
              if (signal) {
                // Convert string attribute to the correct type
                let newVal: unknown = attrValue;
                if (propOptions?.type === Boolean) {
                  newVal = attrValue !== null;
                } else if (propOptions?.type === Number && attrValue !== null) {
                  newVal = Number(attrValue);
                }
                const oldVal = signal.get();
                const shouldUpdate = propOptions?.hasChanged
                  ? propOptions.hasChanged.call(element, newVal, oldVal)
                  : oldVal !== newVal;

                if (shouldUpdate) {
                  console.log('[property] value changed (attribute)', {
                    propertyName: propName,
                    oldValue: oldVal,
                    newValue: newVal,
                    attributeName: attrName,
                  });
                  signal.set(newVal);
                  propOptions?.changed?.call(element, newVal);
                }
              }
              break;
            }
          }
        }
      }
    }
  });

  // Watch all attribute changes on this element
  observer.observe(element, { attributes: true });
}
