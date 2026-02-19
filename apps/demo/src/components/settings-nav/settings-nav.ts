import { html, SignalWatcher } from '@lit-labs/signals';
import '@tt/components/navigation-drawer';
import { property, TaffyMixin } from '@tt/core/reactive';
import { LitElement } from 'lit';

export class SettingsNav extends TaffyMixin(SignalWatcher(LitElement)) {
  opened = property(false, { type: Boolean });

  override render() {
    return html`
      <tt-navigation-drawer
        ?opened=${this.opened}
        @drawer-closed=${this.#handleClose}></tt-navigation-drawer>
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
