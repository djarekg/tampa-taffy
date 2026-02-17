import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('app-products')
export class AppProducts extends LitElement {
  override render() {
    return html`
      <h1>Products Page</h1>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-products': AppProducts;
  }
}
