import { html, SignalWatcher } from '@lit-labs/signals';
import { property } from '@tt/core/reactive';
import { LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';

export class NavigationDrawer extends SignalWatcher(LitElement) {
  /**
   * Whether the drawer is open or closed. When true, the drawer is visible and the
   * scrim is active. When false, the drawer is hidden and the scrim is inactive.
   * This property is reflected to an attribute so it can be styled with CSS.
   */
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
        id="drawer"
        role="dialog"
        aria-expanded="${ariaExpanded}"
        aria-hidden="${ariaHidden}"
        class=${classMap(this.#getDrawerClasses())}>
        <div>test</div>
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
