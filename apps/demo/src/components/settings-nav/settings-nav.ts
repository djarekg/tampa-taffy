import { signout } from '@/api/auth.api';
import { getUserId } from '@/api/profile.api';
import { html, SignalWatcher } from '@lit-labs/signals';
import '@tt/components/navigation-drawer';
import '@tt/components/navigation-item';
import { property } from '@tt/core/reactive';
import { isBrowser, safeDefine } from '@tt/core/utils';
import { LitElement } from 'lit';

/**
 * The `SettingsNav` component is a navigation drawer that provides links to user
 * options and tasks. It can be toggled open or closed and emits a 'closed' event
 * when the drawer is closed.
 */
export class SettingsNav extends SignalWatcher(LitElement) {
  #userId = getUserId();

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
      <nav>
        <tt-navigation-item
          href="/users/${this.#userId}/settings"
          label="Profile"
          icon="person"></tt-navigation-item>

        <tt-navigation-item
          label="Sign out"
          icon="logout"
          @click=${this.#handleSignoutClick}></tt-navigation-item>
      </nav>
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
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'settings-nav': SettingsNav;
  }
}

safeDefine('app-settings-nav', SettingsNav);
