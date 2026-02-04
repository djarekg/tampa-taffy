import { customElement } from 'lit/decorators.js';
import { html, LitElement } from 'lit';

@customElement('app-products')
export class AppProducts extends LitElement {
  render() {
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
