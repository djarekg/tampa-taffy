import { safeDefine } from '@tt/core';
import { html, LitElement } from 'lit';

import styles from './product.css';

export class Product extends LitElement {
  static override styles = [styles];

  override render() {
    return html``;
  }
}

safeDefine('app-product', Product);

declare global {
  interface HTMLElementTagNameMap {
    'app-product': Product;
  }
}
