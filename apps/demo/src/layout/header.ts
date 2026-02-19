import { authenticatedContext } from '@/auth';
import { html, signal, SignalWatcher } from '@lit-labs/signals';
import { consume } from '@lit/context';
import '@m3e/button';
import '@m3e/icon';
import '@m3e/icon-button';
import { state, TaffyMixin } from '@tt/core/reactive';
import { LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import logoSvg from '../assets/candy.svg' with { type: 'svg' };
import styles from './header.css.ts';

@customElement('app-header')
export class Header extends TaffyMixin(SignalWatcher(LitElement)) {
  static override styles = [styles];

  #drawerOpen = signal(false);

  @consume({ context: authenticatedContext, subscribe: true })
  private _authenticated = state(false);

  override render() {
    const menuButtonHtml = this._authenticated
      ? html`
          <m3e-icon-button @click=${this.#handleMenuClick}>
            <m3e-icon name="menu"></m3e-icon>
          </m3e-icon-button>
        `
      : null;

    const drawerHtml = this._authenticated
      ? html`
          <app-settings-nav
            ?opened=${this.#drawerOpen.get()}
            @closed=${this.#handleSettingsNavClosed}></app-settings-nav>
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
      ${drawerHtml}
    `;
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
