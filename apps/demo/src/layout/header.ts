import { customElement } from 'lit/decorators.js';
import { html, LitElement, unsafeCSS } from 'lit';
import styles from './header.css?inline';

@customElement('app-header')
export class Header extends LitElement {
  static override styles = [unsafeCSS(styles)];

  render() {
    return html`
      <header>
        <div class="image">
          <a href="/">
            <img
              width="48"
              height="48"
              src="/candy.svg"
              alt="Tampa Taffy Logo" />
          </a>
        </div>
        <span class="title">Tampa Taffy</span>
        <div class="menu"></div>
      </header>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-header': Header;
  }
}
