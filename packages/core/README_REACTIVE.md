# Taffy Reactive System

The Taffy reactive system provides decorator-free reactive properties and state using pure functions and Lit signals. This enables clean, expressive component logic without relying on TypeScript decorators.

## Core Concepts

### Properties vs State

- **Properties**: Bidirectional communication with parents. Parent → Child via attributes, Child → Parent via events.
- **State**: Internal-only. Never exposed to parent. Changes trigger re-renders locally only.

### Pure Functions

Both `property()` and `state()` are pure functions that return their default values. They are marked with metadata symbols internally so the auto-initialization system can identify them when the element connects to the DOM.

## Usage

### Basic Setup

Just extend `LitElement` directly - initialization happens automatically:

```typescript
import { html, LitElement } from 'lit';
import { property, state } from '@tt/core/reactive';

class MyDrawer extends LitElement {
  // Properties: can be set by parent, emit events to notify parent of changes
  opened = property(false, { type: Boolean, reflect: true });

  // State: internal only, never exposed to parent
  private drawerAnimation = state('idle');

  render() {
    return html`
      <div
        class="drawer"
        ?opened="${this.opened}">
        <button @click="${this.close}">Close</button>
      </div>
    `;
  }

  close() {
    this.opened = false;
    // Notify parent of change
    this.dispatchEvent(new CustomEvent('close'));
  }
}

customElements.define('my-drawer', MyDrawer);
```

### Types of Properties

#### Boolean Properties with Reflection

```typescript
class MyElement extends LitElement {
  // Reflects to HTML attribute
  active = property(false, { type: Boolean, reflect: true });

  // Also reflects
  visible = property(true, { type: Boolean, reflect: true });
}
```

When `active` is `true`, the element has `active=""` attribute. When `false`, the attribute is removed.

#### String Properties

```typescript
class MyElement extends LitElement {
  // Default string
  title = property('Untitled');

  // With reflection
  placeholder = property('Enter text...', { type: String, reflect: true });
}
```

#### Number Properties

```typescript
class MyElement extends LitElement {
  count = property(0, { type: Number });
  priority = property(5, { type: Number, reflect: true });
}
```

#### State Properties

```typescript
class MyElement extends LitElement {
  // Internal state, never exposed to parent
  isLoading = state(false);
  error = state('');
  cachedData = state([]);
}
```

## How It Works

### Initialization Process

1. **Field Declaration**: Properties/states are declared as class fields with `property()` or `state()` calls
2. **Constructor Runs**: Regular Lit constructor executes
3. **Field Initializers Run**: JavaScript field initializers set up the signal-backed properties
4. **Element Connects**: When `connectedCallback` fires, auto-initialization kicks in
5. **Accessor Installation**: Prototype accessors are installed to sync with signals
6. **Lit Registration**: `createProperty()` tells Lit about the property
7. **MutationObserver Setup**: Watches for attribute changes from the parent and syncs to signals

### Attribute → Property Sync (Parent → Child)

When a parent uses attribute binding:

```lit
html`<my-drawer ?opened="${isOpen}"></my-drawer>`
```

The flow is:

1. Parent's signal updates → template re-evaluates
2. Lit binding sets `opened=""` attribute or removes it
3. MutationObserver detects attribute change
4. Child's `opened` signal updates
5. Child's getter returns new value
6. Child re-renders with new value

### Property → Event Sync (Child → Parent)

When the child needs to notify the parent:

```typescript
close() {
  this.opened = false; // Internal change
  this.dispatchEvent(new CustomEvent('close')); // Notify parent
}
```

Parent listens:

```lit
html`<my-drawer @close="${() => (this.isOpen.set(false))}"></my-drawer>`
```

## Advanced Usage

### Custom Attribute Names

```typescript
class MyElement extends LitElement {
  // Uses "data-value" attribute instead of "myValue"
  myValue = property(0, { attribute: 'data-value', type: Number });
}
```

### Accessing the Signal

The underlying signal is accessible for advanced use cases:

```typescript
class MyElement extends LitElement {
  count = property(0);

  incrementAsync() {
    // Get current value from signal
    const currentCount = (this as any).__count_signal__.get();

    // Update signal
    (this as any).__count_signal__.set(currentCount + 1);
  }
}
```

### Computed Properties

You can create computed properties using Lit's `@query` or by computing in the getter:

```typescript
class MyElement extends LitElement {
  firstName = property('');
  lastName = property('');

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
```

## Best Practices

### 1. Always Use Events for Bidirectional Communication

```typescript
// ✅ Good: Child notifies parent via event
close() {
  this.opened = false;
  this.dispatchEvent(new CustomEvent('close', { bubbles: true }));
}

// ❌ Avoid: Trying to update parent directly
close() {
  // This won't work! Can't access parent internals
  // parent.someSignal.set(false);
}
```

### 2. Use State for Internal Data

```typescript
// ✅ Good: Internal UI state as state
class MyElement extends LitElement {
  isMenuOpen = state(false);

  render() {
    return html`
      <menu ?open="${this.isMenuOpen}"></menu>
    `;
  }
}

// ❌ Avoid: Exposing internal state as properties
class MyElement extends LitElement {
  isMenuOpen = property(false); // Don't expose menu state to parent
}
```

### 3. Reflect Only User-Facing Boolean States

```typescript
// ✅ Good: User-facing state
disabled = property(false, { type: Boolean, reflect: true });

// ❌ Avoid: Internal implementation details
animating = property(false, { type: Boolean, reflect: true });
```

### 4. Use Proper Types

```typescript
// ✅ Good
count = property(0, { type: Number });
enabled = property(false, { type: Boolean });

// ❌ Avoid: Type will be inferred as String from HTML
count = property(0); // Sets type: String by default!
```

## Migration from Decorators

If you're familiar with `@property` decorators, here's the translation:

```typescript
// Before (Lit Decorators)
import { property } from 'lit/decorators.js';

class MyElement extends LitElement {
  @property({ type: Boolean, reflect: true })
  opened = false;

  @property({ type: String })
  title = 'Default';

  @state()
  private isLoading = false;
}

// After (Taffy Pure Functions)
import { property, state } from '@tt/core/reactive';
import { LitElement } from 'lit';

class MyElement extends LitElement {
  opened = property(false, { type: Boolean, reflect: true });
  title = property('Default', { type: String });
  isLoading = state(false);
}
```

## Common Issues

### Issue: Property Changes Don't Update

**Cause**: Forget to await `updateComplete`

```typescript
// ❌ Wrong
el.count = 5;
console.log(el.count); // 5, but might not be rendered yet

// ✅ Correct
el.count = 5;
await el.updateComplete;
console.log(el.renderRoot.textContent); // Safely access rendered content
```

### Issue: Boolean Attribute Not Reflecting

**Cause**: Forgot `reflect: true` option

```typescript
// ❌ Won't reflect
enabled = property(false, { type: Boolean });

// ✅ Will reflect
enabled = property(false, { type: Boolean, reflect: true });
```

### Issue: Parent Changes Don't Sync to Child

**Cause**: Parent isn't using attribute binding

```typescript
// ❌ Property binding (bypasses attributes)
html`
  <my-element .opened="${isOpen}"></my-element>
`;

// ✅ Attribute binding (syncs properly)
html`
  <my-element ?opened="${isOpen}"></my-element>
`;

// ✅ Also works
html`
  <my-element opened="${isOpen ? '' : undefined}"></my-element>
`;
```

## API Reference

### `property<T>(defaultValue: T, options?: PropertyDeclaration): T`

Creates a reactive property that can be set by parent via attributes.

**Parameters:**

- `defaultValue`: The initial value (type is inferred)
- `options`: Lit PropertyDeclaration options
  - `type`: Constructor (String, Number, Boolean). Default: String
  - `reflect`: Whether to reflect to attribute. Default: false
  - `attribute`: Attribute name. Default: property name

**Returns:** The default value (typed)

**Example:**

```typescript
title = property('Untitled', { type: String, reflect: true });
count = property(0, { type: Number });
active = property(false, { type: Boolean, reflect: true });
```

### `state<T>(defaultValue: T, options?: PropertyDeclaration): T`

Creates internal reactive state that never appears as attributes.

**Parameters:**

- `defaultValue`: The initial value
- `options`: Lit PropertyDeclaration options (state: true, attribute: false are forced)

**Returns:** The default value (typed)

**Example:**

```typescript
isLoading = state(false);
errorMessage = state('');
```

### Direct LitElement Usage

No special base class needed. Just extend `LitElement` directly - initialization happens automatically when the element connects to the DOM.

**Example:**

```typescript
class MyElement extends LitElement {
  title = property('');
  isOpen = state(false);
}
```

### Auto-initialization

Initialization happens automatically via a hook into `ReactiveElement.connectedCallback()`. No special setup required - just use `property()` and `state()` in any `LitElement` class.

**Works anywhere:**

```typescript
class MyElement extends LitElement {
  title = property('');
}

class MyElementMixed extends OtherMixin(LitElement) {
  title = property('');
}
```

## Testing

Properties and states work with standard Lit testing patterns:

```typescript
import { fixture, expect } from '@open-wc/testing';

describe('MyElement', () => {
  it('renders with property', async () => {
    const el = await fixture(`<my-element></my-element>`);
    el.title = 'New Title';
    await el.updateComplete;
    expect(el.renderRoot.textContent).toContain('New Title');
  });

  it('syncs attribute changes', async () => {
    const el = await fixture(`<my-element></my-element>`);
    el.setAttribute('opened', '');
    await el.updateComplete;
    expect(el.opened).toBe(true);
  });
});
```

## Performance Considerations

- **Signal Overhead**: Minimal. Signals only compute when `.get()` or `.set()` is called
- **Attribute Observation**: Uses `MutationObserver`, which is efficient for the typical number of properties
- **Re-renders**: Only triggered when values actually change (equality check)

## Browser Support

Works in all modern browsers supporting:

- Web Components (ES2015+)
- `MutationObserver`
- `Symbol`
- `Proxy` (for Lit signals)

IE11 is not supported.
