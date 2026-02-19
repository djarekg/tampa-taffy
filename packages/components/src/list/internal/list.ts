import { html, SignalWatcher } from '@lit-labs/signals';
import { property } from '@tt/core/reactive';
import { LitElement } from 'lit';

export class List extends SignalWatcher(LitElement) {
  override ariaLabel = property('', { reflect: true, attribute: 'data-aria-label' });
  ariaRole = property('list', { reflect: true, attribute: 'data-aria-role' });
  listTabIndex = property(0, { type: Number });

  override render() {
    return html`
      <ul
        ariaLabel=${this.ariaLabel}
        role=${this.ariaRole}
        tabindex=${this.listTabIndex}>
        <slot @click=${(e: Event) => e.stopPropagation()}></slot>
      </ul>
    `;
  }
}
