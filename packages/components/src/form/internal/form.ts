import { html, SignalWatcher } from '@lit-labs/signals';
import { LitElement } from 'lit';

export class Form extends SignalWatcher(LitElement) {
  override render() {
    return html`
      <form>
        <slot></slot>
      </form>
    `;
  }
}
