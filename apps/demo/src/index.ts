import { SignalWatcher } from '@lit-labs/signals';
import { provide } from '@lit/context';
import '@m3e/theme';
import { state, TaffyMixin } from '@tt/core/reactive';
import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import { authenticated, authenticatedContext } from '@/auth';
import '@/components/settings-nav/settings-nav';
import '@/layout/header';
import { routerContext } from '@/router';
import { router } from '@/router/router';
import styles from './index.css.ts';

/**
 * @summary Root application component that wires up global providers, routing, and layout.
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

  @provide({ context: authenticatedContext })
  private _authenticated = state(false);

  @provide({ context: routerContext })
  private _router = router();

  override render() {
    // Update authenticated state from signal - SignalWatcher will track this.
    // It should stay in {@link render} to preserve signal tracking; moving it to
    // `constructor` or `connectedCallback` would break reactivity.
    this._authenticated = authenticated.get();
    console.debug(this._authenticated);

    return html`
      <m3e-theme density="-3">
        <ui-router .uiRouter=${this._router}>
          <app-header></app-header>
          <main>
            <ui-view></ui-view>
          </main>
        </ui-router>
      </m3e-theme>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-index': Index;
  }
}
