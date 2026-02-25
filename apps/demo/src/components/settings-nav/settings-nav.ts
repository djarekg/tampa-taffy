import { SignalWatcher, html } from '@lit-labs/signals';
import '@m3e/web/icon';
import '@tt/components/list';
import '@tt/components/navigation-drawer';
import { property } from '@tt/core/reactive';
import { isBrowser, safeDefine } from '@tt/core/utils';
import { LitElement } from 'lit';

import { signout } from '@/core/api/auth.api';
import { getUserId } from '@/core/api/profile.api';

/**
 * The `SettingsNav` component is a navigation drawer that provides links to user
 * options and tasks. It can be toggled open or closed and emits a 'closed' event
 * when the drawer is closed.
 */
export class SettingsNav extends SignalWatcher(LitElement) {
  readonly #userId = getUserId();

  /**
   * Controls whether the navigation drawer is open or closed.
   *
   * @default false
   */
  opened = property(false, { type: Boolean });

  override render() {
    return html`
      <tt-navigation-drawer
        headline="Settings"
        ?opened=${this.opened}
        @drawer-closed=${this.#handleClose}>
        ${this.#renderDrawerContent()}
      </tt-navigation-drawer>
    `;
  }

  #renderDrawerContent() {
    return html`
      <tt-list
        ariaRole="navigation"
        ariaLabel="Settings nav">
        <tt-list-item-link
          href="/users/${this.#userId}/settings"
          headline="Profile">
          <m3e-icon
            slot="start"
            name="person"></m3e-icon>
        </tt-list-item-link>
        <tt-list-item-link
          headline="Sign out"
          @click=${this.#handleSignoutClick}>
          <m3e-icon
            slot="start"
            name="logout"></m3e-icon>
        </tt-list-item-link>
      </tt-list>
    `;
  }

  async #handleSignoutClick() {
    await signout();

    if (isBrowser()) {
      window.location.reload();
    }
  }

  #handleClose() {
    this.opened = false;

    this.dispatchEvent(
      new CustomEvent('closed', {
        bubbles: true,
        composed: true,
      }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'settings-nav': SettingsNav;
  }
}

safeDefine('app-settings-nav', SettingsNav);
