# @tt/core

## Resource (signals + async)

The `@tt/core/resource` entry exports a small async resource helper (inspired by Angular resource + `@lit/task` rendering).

```ts
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { SignalWatcher, signal } from '@lit-labs/signals';
import { resource } from '@tt/core/resource';

type Product = {
  name: string;
  price: number;
};

const productId = signal('123');

const productResource = resource({
  params: () => productId.get(),
  loader: async ({ params: id, abortSignal }) => {
    const response = await fetch(`/api/products/${id}`, { signal: abortSignal });
    if (!response.ok) throw new Error(response.statusText);
    return (await response.json()) as Product;
  },
});

@customElement('product-view')
export class ProductView extends SignalWatcher(LitElement) {
  render() {
    return html`
      ${productResource.renderer({
        initial: () => html`
          <p>Waiting...</p>
        `,
        pending: () => html`
          <p>Loading...</p>
        `,
        complete: product => html`
          <p>${product?.name}</p>
        `,
        error: err => html`
          <p>Error: ${String(err)}</p>
        `,
      })}
    `;
  }
}
```
