import { isAuthenticated } from '@/api/auth.api';
import { signal, SignalWatcher } from '@lit-labs/signals';
import { provide } from '@lit/context';
import '@m3e/theme';
import '@tt/components/navigation-drawer';
import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import styles from './index.css.ts';
import './layout/header.ts';
import { routerContext } from './router';
import { router } from './router/router';

const authenticated = signal(await isAuthenticated());

@customElement('app-index')
export class Index extends SignalWatcher(LitElement) {
  static override styles = [styles];

  #drawerOpen = signal(false);

  @provide({ context: routerContext })
  @state()
  private _router = router();

  override render() {
    const drawerHtml = authenticated.get()
      ? html`
          <tt-navigation-drawer ?opened=${this.#drawerOpen.get()}></tt-navigation-drawer>
        `
      : null;

    return html`
      <m3e-theme density="-3">
        <ui-router .uiRouter=${this._router}>
          <app-header @menu-click=${this.#handleMenuClick}></app-header>
          <main>
            <ui-view></ui-view>
            ${drawerHtml}
          </main>
        </ui-router>
      </m3e-theme>
    `;
  }

  #handleMenuClick() {
    this.#drawerOpen.set(true);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-index': Index;
  }
}
