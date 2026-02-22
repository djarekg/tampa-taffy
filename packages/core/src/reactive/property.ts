import { signal } from '@lit-labs/signals';
import type { PropertyDeclaration } from 'lit';
import { ReactiveElement } from 'lit';

const PROPERTY_SIGNAL = Symbol.for('tt-property-signal');

type PropertySignal<T> = ReturnType<typeof signal<T>> & {
  [PROPERTY_SIGNAL]: PropertyDeclaration;
};

// Store map of property names to their signal backing keys per element class
const propertySignalMap = new WeakMap<Function, Map<string, string>>();

export function property<T>(defaultValue: T, options?: PropertyDeclaration): T {
  const sig = signal(defaultValue) as PropertySignal<T>;
  sig[PROPERTY_SIGNAL] = { type: String, ...options };
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
      sig.set(existingInstanceValue);
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
          return signal.get();
        },
        set(this: ReactiveElement, newValue: unknown) {
          const bk = `__${propertyName}_signal__`;

          // Check if newValue is a signal being assigned from constructor
          // This handles subsequent instances after the accessor is already on the prototype
          if (newValue && typeof newValue === 'object' && PROPERTY_SIGNAL in newValue) {
            (this as any)[bk] = newValue;
            return;
          }

          const signal = (this as any)[bk];
          if (!signal) {
            return;
          }
          const oldValue = signal.get();
          signal.set(newValue);

          // Trigger Lit update cycle
          if (oldValue !== newValue) {
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
                signal.set(newVal);
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
