import { signal, SignalWatcher } from '@lit-labs/signals';
import { provide } from '@lit/context';
import '@m3e/theme';
import '@tt/components/navigation-drawer';
import { state, TaffyMixin } from '@tt/core/reactive';
import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { authenticated, authenticatedContext } from './auth';
import styles from './index.css.ts';
import './layout/header.ts';
import { routerContext } from './router';
import { router } from './router/router';

/**
 * Root application component that wires up global providers, routing, and layout.
 *
 * @remarks
 * The `authenticated` signal is read during rendering so `SignalWatcher` can
 * track it and keep the template reactive.
 *
 * @note
 * The line that updates authentication state (line 29 in your snippet)
 * should stay in {@link render} to preserve signal tracking; moving it to
 * `constructor` or `connectedCallback` would break reactivity.
 */
@customElement('app-index')
export class Index extends TaffyMixin(SignalWatcher(LitElement)) {
  static override styles = [styles];

  #drawerOpen = signal(false);

  @provide({ context: authenticatedContext })
  private _authenticated = state(false);

  @provide({ context: routerContext })
  private _router = router();

  override render() {
    // Update authenticated state from signal - SignalWatcher will track this.
    // It should stay in {@link render} to preserve signal tracking; moving it to
    // `constructor` or `connectedCallback` would break reactivity.
    this._authenticated = authenticated.get();

    const drawerHtml = this._authenticated
      ? html`
          <tt-navigation-drawer
            ?opened=${this.#drawerOpen.get()}
            @drawer-closed=${this.#handleClose}>
            <button @click=${this.#handleClose}>Close Drawer</button>
          </tt-navigation-drawer>
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

  #handleClose() {
    this.#drawerOpen.set(false);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-index': Index;
  }
}
