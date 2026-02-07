import { customElement, property } from 'lit/decorators.js';
import { LitElement } from 'lit';
import { html, SignalWatcher } from '@lit-labs/signals';
import { classMap } from 'lit/directives/class-map.js';
import styles from './navigation-drawer.css';

@customElement('tt-navigation-drawer')
export class NavigationDrawer extends SignalWatcher(LitElement) {
  static override styles = [styles];

  @property({ type: Boolean, reflect: true })
  opened = false;

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
