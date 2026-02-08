import { signal, SignalWatcher } from '@lit-labs/signals';
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import '@tt/components/navigation-drawer';

import { isAuthenticated } from '@/api/auth.api';
import './layout/header.ts';
import styles from './index.css.ts';
import { router } from './router/router';

const authenticated = signal(await isAuthenticated());

@customElement('app-index')
export class Index extends SignalWatcher(LitElement) {
  static override styles = [styles];

  #router = router();
  #drawerOpen = signal(false);

  override render() {
    const drawerHtml = authenticated.get()
      ? html`
          <tt-navigation-drawer ?opened=${this.#drawerOpen.get()}></tt-navigation-drawer>
        `
      : null;

    return html`
      <ui-router .uiRouter=${this.#router}>
        <app-header @menu-click=${this.#handleMenuClick}></app-header>
        <main>
          <ui-view></ui-view>
          ${drawerHtml}
        </main>
      </ui-router>
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

if (import.meta.hot) {
  import.meta.hot.accept();
}
