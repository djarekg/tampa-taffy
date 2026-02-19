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
        ?opened=${this.opened}
        @drawer-closed=${this.#handleClose}>
        ${this.#renderDrawerContent()}
      </tt-navigation-drawer>
    `;
  }

  #renderDrawerContent() {
    return html`
      <nav>
        <ul>
          <li><a href="/settings/profile">Profile</a></li>
          <li><a href="/settings/account">Account</a></li>
          <li><a href="/settings/notifications">Notifications</a></li>
          <li><a href="/settings/privacy">Privacy</a></li>
        </ul>
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
