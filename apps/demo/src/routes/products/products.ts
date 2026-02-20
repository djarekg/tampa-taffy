import { safeDefine } from '@tt/core/utils';
import { html, LitElement } from 'lit';

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

safeDefine('app-products', AppProducts);
