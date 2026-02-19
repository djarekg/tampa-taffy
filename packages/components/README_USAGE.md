# Taffy Reactive Components Guide

Quick start guide for building reactive components with Taffy's `property()` and `state()` functions.

## Minimal Example

```typescript
import { TaffyElement } from '@tt/core/reactive';
import { property } from '@tt/core/reactive';
import { html } from 'lit';

class Counter extends TaffyElement {
  // Reactive property - parent can set via attribute, child can update
  count = property(0, { type: Number });

  render() {
    return html`
      <div>${this.count}</div>
      <button
        @click="${() => {
          this.count++;
        }}">
        +
      </button>
    `;
  }
}

customElements.define('c-counter', Counter);
```

Usage in parent:

```html
<c-counter count="10"></c-counter>

<script>
  const counter = document.querySelector('c-counter');
  counter.count = 20; // Works!
  counter.dispatchEvent(new Event('change')); // Parent should listen for events
</script>
```

## Full Example: Navigation Drawer

Here's a complete example showing proper parent-child communication:

### Child Component (navigation-drawer.ts)

```typescript
import { TaffyElement } from '@tt/core/reactive';
import { property, state } from '@tt/core/reactive';
import { html } from 'lit';

export class NavigationDrawer extends TaffyElement {
  // Property: parent can control via attribute
  opened = property(false, { type: Boolean, reflect: true });

  // Internal state: animation progress
  private animating = state(false);

  render() {
    return html`
      <div
        class="drawer"
        ?opened="${this.opened}">
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
        </nav>
        <button @click="${this.close}">Close</button>
      </div>
    `;
  }

  close() {
    this.opened = false;
    // Notify parent that drawer closed internally
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
  }
}

customElements.define('nav-drawer', NavigationDrawer);
```

### Parent Component (app.ts)

```typescript
import { TaffyElement } from '@tt/core/reactive';
import { state } from '@tt/core/reactive';
import { html } from 'lit';

export class App extends TaffyElement {
  // Track drawer open state
  private drawerOpen = state(false);

  render() {
    return html`
      <header>
        <button @click="${() => this.drawerOpen.set(!this.drawerOpen.get())}">Menu</button>
      </header>

      <!-- Use attribute binding so MutationObserver picks up changes -->
      <nav-drawer
        ?opened="${this.drawerOpen.get()}"
        @close="${this.onDrawerClose}"></nav-drawer>

      <main>Content here</main>
    `;
  }

  private onDrawerClose = () => {
    this.drawerOpen.set(false);
  };
}

customElements.define('my-app', App);
```

## Component Patterns

### 1. Form Input Component

```typescript
class TextInput extends TaffyElement {
  // Value property synced from parent
  value = property('', { type: String, reflect: true });

  render() {
    return html`
      <input
        type="text"
        .value="${this.value}"
        @input="${(e: Event) => {
          const input = e.target as HTMLInputElement;
          this.value = input.value;
          this.dispatchEvent(new Event('input', { bubbles: true }));
        }}" />
    `;
  }
}

customElements.define('text-input', TextInput);
```

Parent usage:

```html
<text-input
  @input="${(e: Event) => {
  const value = (e.currentTarget as TextInput).value;
  console.log('Input changed:', value);
}}"></text-input>
```

### 2. Dialog Component

```typescript
class Dialog extends TaffyElement {
  // Dialog visibility
  open = property(false, { type: Boolean, reflect: true });

  // Animation state (internal)
  private animationProgress = state(0);

  render() {
    return html`
      <div
        class="dialog"
        ?hidden="${!this.open}">
        <div
          class="backdrop"
          @click="${this.close}"></div>
        <div class="content">
          <slot></slot>
          <button @click="${this.close}">Cancel</button>
        </div>
      </div>
    `;
  }

  close() {
    this.open = false;
    this.dispatchEvent(new CustomEvent('close'));
  }
}

customElements.define('c-dialog', Dialog);
```

### 3. Paginated List Component

```typescript
class PaginatedList extends TaffyElement {
  // Current page (can be set by parent)
  page = property(1, { type: Number, reflect: true });

  // Items per page
  pageSize = property(10, { type: Number });

  // Internal: total number of items
  private itemCount = state(0);

  private items: Item[] = [];

  render() {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    const pageItems = this.items.slice(start, end);

    return html`
      <div class="list">
        ${pageItems.map(
          item => html`
            <div>${item.name}</div>
          `
        )}
      </div>

      <div class="pagination">
        <button
          ?disabled="${this.page === 1}"
          @click="${() => this.page--}">
          Previous
        </button>
        <span>${this.page} / ${Math.ceil(this.itemCount / this.pageSize)}</span>
        <button @click="${() => this.page++}">Next</button>
      </div>
    `;
  }

  async updated(changes: PropertyValues) {
    // Fetch items when page changes
    if (changes.has('page')) {
      const response = await fetch(`/api/items?page=${this.page}&size=${this.pageSize}`);
      const data = await response.json();
      this.items = data.items;
      this.itemCount.set(data.total);
    }
  }
}

customElements.define('paginated-list', PaginatedList);
```

### 4. Tabs Component

```typescript
class Tabs extends TaffyElement {
  // Active tab index
  activeTab = property(0, { type: Number, reflect: true });

  // Internal: computed tabs (from slot)
  private tabs = state([]);

  connectedCallback() {
    super.connectedCallback();
    this.updateTabList();
  }

  render() {
    return html`
      <div class="tabs">
        <div class="tab-buttons">
          ${this.tabs.map(
            (tab, index) => html`
              <button
                class="${this.activeTab === index ? 'active' : ''}"
                @click="${() => (this.activeTab = index)}">
                ${tab.label}
              </button>
            `
          )}
        </div>
        <div class="tab-content">
          <slot name="content-${this.activeTab}"></slot>
        </div>
      </div>
    `;
  }

  private updateTabList() {
    // Parse tabs from slot
    const buttons = this.querySelectorAll('[data-tab]');
    this.tabs.set(
      Array.from(buttons).map(btn => ({
        label: btn.textContent || '',
      }))
    );
  }
}

customElements.define('c-tabs', Tabs);
```

Usage:

```html
<c-tabs active-tab="1">
  <button data-tab="Features">Features</button>
  <button data-tab="Pricing">Pricing</button>

  <div slot="content-0">Features content...</div>
  <div slot="content-1">Pricing content...</div>
</c-tabs>
```

## Tips for Success

### Tip 1: Use Signals for Advanced State

The underlying signal is available via `__${propertyName}_signal__`:

```typescript
class MyElement extends TaffyElement {
  count = property(0, { type: Number });

  increment() {
    // Get and set directly
    const signal = (this as any).__count_signal__;
    signal.set(signal.get() + 1);
  }
}
```

### Tip 2: Always Use Attribute Binding for Reflected Properties

```typescript
// ✅ Good: Attribute binding syncs properly
html`
  <my-drawer ?opened="${this.opened}"></my-drawer>
`;

// ❌ Wrong: Property binding doesn't use attributes
html`
  <my-drawer .opened="${this.opened}"></my-drawer>
`;
```

### Tip 3: Use Events for Parent Notifications

```typescript
// ✅ Good: Component tells parent about changes
close() {
  this.opened = false;
  this.dispatchEvent(new CustomEvent('close', { bubbles: true }));
}

// ❌ Wrong: Component tries to update parent directly
close() {
  // This won't work - can't access parent internals
  // parent.drawerOpen.set(false);
}
```

### Tip 4: Keep State Internal

```typescript
// ✅ Good: UI state stays internal
class Accordion extends TaffyElement {
  expanded = state(false); // Child only
}

// ❌ Wrong: Exposing implementation details
class Accordion extends TaffyElement {
  expanded = property(false); // Why expose this to parent?
}
```

## Testing Properties and State

```typescript
import { fixture, expect } from '@open-wc/testing';
import { TextInput } from './text-input';

describe('TextInput', () => {
  it('sets value from property', async () => {
    const el = await fixture<TextInput>(`<text-input></text-input>`);
    el.value = 'Hello';
    await el.updateComplete;
    expect(el.value).to.equal('Hello');
  });

  it('reflects value to attribute', async () => {
    const el = await fixture<TextInput>(`<text-input></text-input>`);
    el.value = 'World';
    await el.updateComplete;
    expect(el.getAttribute('value')).to.equal('World');
  });

  it('syncs attribute changes to property', async () => {
    const el = await fixture<TextInput>(`<text-input></text-input>`);
    el.setAttribute('value', 'Test');
    await el.updateComplete;
    expect(el.value).to.equal('Test');
  });

  it('fires input event on change', async () => {
    const el = await fixture<TextInput>(`<text-input></text-input>`);
    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;
    let eventFired = false;

    el.addEventListener('input', () => {
      eventFired = true;
    });

    input.value = 'Changed';
    input.dispatchEvent(new Event('input'));
    await el.updateComplete;

    expect(eventFired).to.be.true;
  });
});
```

## Troubleshooting

| Problem                                 | Solution                                                        |
| --------------------------------------- | --------------------------------------------------------------- |
| Property changes don't render           | Call `await el.updateComplete` before checking DOM              |
| Parent changes don't sync to child      | Use attribute binding `?opened="${value}"` not `.opened`        |
| Child can't notify parent of changes    | Dispatch events: `this.dispatchEvent(new CustomEvent('close'))` |
| Boolean attribute not appearing in HTML | Add `reflect: true` option                                      |
| Type errors with Number property        | Set `type: Number` in options                                   |
| State appears as attribute              | Don't use `state()` for values you want as attributes           |
| Infinite loops                          | Avoid circular event dispatching or property updates            |

## Next Steps

- Read [README_REACTIVE.md](./README_REACTIVE.md) for full API reference
- Check [property.test.ts](./src/reactive/property.test.ts) for real test examples
- See [navigation-drawer.ts](../components/src/navigation-drawer/navigation-drawer.ts) for production example
