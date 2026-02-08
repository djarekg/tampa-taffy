import '@material/web/iconbutton/icon-button';
import '@material/web/icon/icon';
import { html, signal, SignalWatcher } from '@lit-labs/signals';
import { customElement } from 'lit/decorators.js';
import { LitElement } from 'lit';

import styles from './header.css.ts';
import logoSvg from '../assets/candy.svg' with { type: 'svg' };
import { isAuthenticated } from '@/api/auth.api';

const authenticated = signal(await isAuthenticated());

@customElement('app-header')
export class Header extends SignalWatcher(LitElement) {
  static override styles = [styles];

  override render() {
    const menuButtonHtml = authenticated.get()
      ? html`
          <md-icon-button @click=${this.#handleMenuClick}>
            <md-icon>menu</md-icon>
          </md-icon-button>
        `
      : null;

    return html`
      <header>
        <div class="image">
          <a href="/">
            <img
              width="48"
              height="48"
              src=${logoSvg}
              alt="Tampa Taffy Logo" />
          </a>
        </div>
        <span class="title">Tampa Taffy</span>
        <div class="menu">${menuButtonHtml}</div>
      </header>
    `;
  }

  #handleMenuClick() {
    // The icon-button that triggers this event handle is supposed to notify the parent
    // listener so that the navigation drawer can be opened.
    this.dispatchEvent(
      new CustomEvent('menu-click', {
        bubbles: true,
        composed: true,
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-header': Header;
  }
}
