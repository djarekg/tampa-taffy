# Query Usage Guide

The `query` function provides a reactive way to query elements in your component, similar to Lit's `@query` decorator.

## Important: Use Public Fields (or readonly)

Due to JavaScript limitations, **private fields (`#field`) cannot be accessed via reflection** and therefore won't work with the query system. Instead, use:

- **Public readonly fields** (recommended for encapsulation)
- **Public fields with underscore prefix** (private by convention)

## Basic Usage

```typescript
import { LitElement, html } from 'lit';
import { query } from '@tt/core/reactive';

export class MyComponent extends LitElement {
  // Use readonly for encapsulation - field can be read but not reassigned
  readonly drawerRoot = query<HTMLElement>('aside');
  readonly button = query<HTMLButtonElement>('button.primary');

  override firstUpdated() {
    // Query results are available in firstUpdated() and later
    console.log(this.drawerRoot?.tagName); // 'ASIDE' or null
    console.log(this.button?.textContent); // button text
  }

  override render() {
    return html`
      <aside></aside>
      <button class="primary">Click me</button>
    `;
  }
}
```

## Why Not Private Fields?

JavaScript private fields (using `#`) are not accessible via reflection APIs outside the class. This includes:

- `Object.getOwnPropertyNames()`
- `Object.getOwnPropertySymbols()`
- `Reflect.ownKeys()`

The query system needs to discover and initialize queries using reflection, so private fields cannot be supported.

## Key Features

- **Automatic Initialization**: No manual setup needed - just extend `ReactiveElement` or `LitElement`
- **Reactive**: Uses signals internally to track DOM changes and trigger component updates
- **Direct Access**: Access the queried element directly as a property, not as a function
- **Lifecycle Aware**: Query results are available in `firstUpdated()` and beyond
- **Memory Efficient**: Single mutation observer per element, regardless of number of queries
- **Type Safe**: Full TypeScript support with generic type parameter

## How It Works

1. Define a query using `readonly element = query<T>(selector)` as a public field
2. During `connectedCallback`, the framework automatically initializes the query
3. A getter is installed that returns the queried element (or `null` if not found)
4. Internal signals track the queried element and trigger updates when DOM changes
5. Accessing the property returns the element directly (not the signal)

## Performance Considerations

- Queries are performed once on initialization and again whenever the DOM changes
- A single `MutationObserver` monitors all queries for an element
- Results are immediate - no waiting for component updates
- Use CSS selectors that are specific and fast (e.g., prefer IDs over complex selectors)

## Comparison with Lit's Query Decorator

| Feature                   | Tampa Taffy Query               | Lit Query Decorator |
| ------------------------- | ------------------------------- | ------------------- |
| Syntax                    | `readonly element = query<T>()` | `@query(selector)`  |
| Type Safe                 | ✓ Yes                           | ✓ Yes               |
| Reactive                  | ✓ Yes (via signals)             | ✓ Yes (via Lit)     |
| Available in firstUpdated | ✓ Yes                           | ✓ Yes               |
| Internal Implementation   | Signals-based                   | Property descriptor |

The Tampa Taffy implementation is fully compatible with your existing component patterns and integrates seamlessly with the `property` and `state` reactive primitives.
