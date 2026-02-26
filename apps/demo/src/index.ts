import '@/components/settings-nav/settings-nav';
import '@/layout/header';
import '@tt/components/styles/index.css';
import '@m3e/web/theme';

import { signal, SignalWatcher } from '@lit-labs/signals';
import { provide } from '@lit/context';
import { state } from '@tt/core/reactive';
import { safeDefine } from '@tt/core/utils';
import { html, LitElement, nothing } from 'lit';

import { authenticated, authenticatedContext } from '@/core/auth';
import { routerContext } from '@/router';
import { router } from '@/router/router';

import styles from './index.css.ts';
import scrollStyles from './styles/scroll.css.ts';

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
export class Index extends SignalWatcher(LitElement) {
  static override styles = [scrollStyles, styles];

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
    console.debug(this._authenticated);

    return html`
      <m3e-theme
        color="#bb5fff"
        scheme="dark"
        density="-3"
        motion="expressive"
        variant="rainbow"
        strong-focus>
        <ui-router .uiRouter=${this._router}>
          <div
            class="body"
            scrollable>
            <app-header @open-settings-nav=${this.#handleMenuClick}></app-header>
            <main>
              <ui-view></ui-view>
            </main>
          </div>
          ${this.#renderSettingsNav()}
        </ui-router>
      </m3e-theme>
    `;
  }

  #renderSettingsNav() {
    if (this._authenticated) {
      return html`
        <app-settings-nav
          ?opened=${this.#drawerOpen.get()}
          @closed=${this.#handleSettingsNavClosed}></app-settings-nav>
      `;
    }

    return nothing;
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
    'app-index': Index;
  }
}

safeDefine('app-index', Index);
