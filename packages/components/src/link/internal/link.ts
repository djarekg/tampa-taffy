import { html, SignalWatcher } from '@lit-labs/signals';
import { property, TaffyMixin } from '@tt/core/reactive';
import { LitElement } from 'lit';

export class Link extends TaffyMixin(SignalWatcher(LitElement)) {
  color = property<'primary' | 'secondary' | 'error' | ''>('primary', { reflect: true });
  href = property('#');

  override render() {
    return html`
      <a href="${this.href}">
        <slot></slot>
      </a>
    `;
  }
}
