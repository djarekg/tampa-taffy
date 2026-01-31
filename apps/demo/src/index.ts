import { LitElement, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import styles from './index.css?inline';
import './layout/header.js';

@customElement('app-index')
export class Index extends LitElement {
  static override styles = [unsafeCSS(styles)];

  render() {
    return html`
      <app-header></app-header>
      <main>
        <h2 class="tt-color-brand-gradient">Demo Application</h2>
        <p>This is a demo application showcasing the Tampa Taffy design system.</p>
      </main>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-index': Index;
  }
}
