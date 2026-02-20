import { authenticatedContext } from '@/auth';
import { html, signal, SignalWatcher } from '@lit-labs/signals';
import { consume } from '@lit/context';
import '@m3e/button';
import '@m3e/icon';
import '@m3e/icon-button';
import { state } from '@tt/core/reactive';
import { safeDefine } from '@tt/core/utils';
import { LitElement } from 'lit';
import logoSvg from '../assets/candy.svg' with { type: 'svg' };
import styles from './header.css.ts';

/**
 * Header component that displays the application logo, title, and a menu button
 * for authenticated users.
 *
 * @remarks
 * The component uses a signal to track the state of the navigation drawer and
 * consumes the authentication context to conditionally render the menu button
 * and navigation drawer.
 */
export class Header extends SignalWatcher(LitElement) {
  static override styles = [styles];

  #drawerOpen = signal(false);

  @consume({ context: authenticatedContext, subscribe: true })
  private _authenticated = state(false);

  override render() {
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
        <div class="menu">${this.#renderMenuButton()}</div>
      </header>
      ${this.#renderSettingsNav()}
    `;
  }

  #renderMenuButton() {
    if (this._authenticated) {
      return html`
        <m3e-icon-button
          size="medium"
          @click=${this.#handleMenuClick}>
          <m3e-icon name="manage_accounts"></m3e-icon>
        </m3e-icon-button>
      `;
    }

    return null;
  }

  #renderSettingsNav() {
    if (this._authenticated) {
      return html`
        <app-settings-nav
          ?opened=${this.#drawerOpen.get()}
          @closed=${this.#handleSettingsNavClosed}></app-settings-nav>
      `;
    }

    return null;
  }

  #handleMenuClick() {
    this.#drawerOpen.set(true);
  }

  #handleSettingsNavClosed() {
    this.#drawerOpen.set(false);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-header': Header;
  }
}

safeDefine('app-header', Header);
