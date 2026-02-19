import { html, SignalWatcher } from '@lit-labs/signals';
import { property, TaffyMixin } from '@tt/core/reactive';
import { LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './navigation-drawer.css';

@customElement('tt-navigation-drawer')
export class NavigationDrawer extends TaffyMixin(SignalWatcher(LitElement)) {
  static override styles = [styles];

  opened = property(false, { type: Boolean, reflect: true });

  override render() {
    const open = this.opened;
    const ariaExpanded = open ? 'true' : 'false';
    const ariaHidden = !open ? 'true' : 'false';

    return html`
      <div
        class="scrim ${classMap(this.#getScrimClasses())}"
        @click=${this.close}></div>
      <aside
        role="dialog"
        aria-expanded="${ariaExpanded}"
        aria-hidden="${ariaHidden}"
        class=${classMap(this.#getDrawerClasses())}>
        <slot></slot>
      </aside>
    `;
  }

  open() {
    this.opened = true;
  }

  close() {
    this.opened = false;

    this.dispatchEvent(
      new CustomEvent('drawer-closed', {
        bubbles: true,
        composed: true,
      })
    );
  }

  #getDrawerClasses() {
    return {
      visible: this.opened,
    };
  }

  #getScrimClasses() {
    return {
      visible: this.opened,
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tt-navigation-drawer': NavigationDrawer;
  }
}
