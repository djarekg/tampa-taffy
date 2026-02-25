import { safeDefine } from '@tt/core';

import { Card } from './internal/card';
import styles from './internal/card.css';

declare global {
  interface HTMLElementTagNameMap {
    'tt-card': TtCard;
  }
}

/**
 * Cards contain content and actions about a single subject.
 */
export class TtCard extends Card {
  static override styles = [styles];
}

safeDefine('tt-card', TtCard);
