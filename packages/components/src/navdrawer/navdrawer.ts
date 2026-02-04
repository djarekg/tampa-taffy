import { customElement, property } from 'lit/decorators.js';
import { LitElement } from 'lit';
import { html, SignalWatcher } from '@lit-labs/signals';

@customElement('tt-nav-drawer')
export class NavDrawer extends SignalWatcher(LitElement) {
  @property
  override render() {
    return html``;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tt-nav-drawer': NavDrawer;
  }
}
