import { property } from '@tt/core/reactive';
import { html, LitElement } from 'lit';

import type { CardVariant } from './card-variant';

export class Card extends LitElement {
  /**
   * The variant of the card, which controls its visual style.
   */
  variant = property<CardVariant>('elevated', { reflect: true });

  override render() {
    return html`
      <slot></slot>
    `;
  }
}
