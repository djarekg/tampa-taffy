import '@m3e/web/icon';
import '@m3e/web/icon-button';
import '@tt/components/breadcrumbs';
import '@tt/components/list';

import { html, SignalWatcher } from '@lit-labs/signals';
import { consume } from '@lit/context';
import { state } from '@tt/core/reactive';
import { safeDefine } from '@tt/core/utils';
import { LitElement, nothing } from 'lit';
import type { UIRouterLit } from 'lit-ui-router';

import { authenticatedContext } from '@/core/auth';
import { routerContext } from '@/router';

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

  @consume({ context: authenticatedContext, subscribe: true })
  private _authenticated = state(false);

  @consume({ context: routerContext })
  private _router = state<UIRouterLit | null>(null);

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
            <span class="title">Tampa Taffy</span>
          </a>
        </div>
        <div class="site-menu">${this.#renderSiteMenu()}</div>
        <div class="settings-nav-button">${this.#renderSettingsNavButton()}</div>
      </header>
      <section class="breadcrumbs-gutter">
        ${this.#renderBreadcrumbs()}
      </section>
    `;
  }

  #renderSiteMenu() {
    if (this._authenticated) {
      return html`
        <tt-list
          ariaRole="navigation"
          ariaLabel="Site menu"
          alignment="horizontal">
          <tt-list-item-link
            href="/"
            headline="Home"
            indicator="underline"></tt-list-item-link>
          <tt-list-item-link
            href="/users"
            headline="Users"
            indicator="underline"></tt-list-item-link>
        </tt-list>
      `;
    }

    return nothing;
  }

  #renderSettingsNavButton() {
    if (this._authenticated) {
      return html`
        <m3e-icon-button
          size="medium"
          @click=${this.#handleMenuClick}>
          <m3e-icon name="manage_accounts"></m3e-icon>
        </m3e-icon-button>
      `;
    }

    return nothing;
  }

  #renderBreadcrumbs() {
    if (this._authenticated) {
      return html`
        <tt-breadcrumbs .router=${this._router}></tt-breadcrumbs>
      `;
    }

    return nothing;
  }

  #handleMenuClick() {
    this.dispatchEvent(new CustomEvent('open-settings-nav', { bubbles: true }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-header': Header;
  }
}

safeDefine('app-header', Header);
