import { html, SignalWatcher } from '@lit-labs/signals';
import '@tt/components/navigation-drawer';
import '@tt/components/navigation-item';
import { property } from '@tt/core/reactive';
import { LitElement } from 'lit';

export class SettingsNav extends SignalWatcher(LitElement) {
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
          href="/settings/profile"
          label="Profile"
          icon="person"></tt-navigation-item>

        <tt-navigation-item
          href="/settings/profile"
          label="Sign out"
          icon="logout"></tt-navigation-item>
      </nav>
    `;
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

customElements.define('app-settings-nav', SettingsNav);
