import { safeDefine } from '@tt/core';

import { FormCard } from './internal/form-card';
import styles from './internal/form-card.css';

export class TtFormCard extends FormCard {
  static override styles = [styles];
}

safeDefine('tt-form-card', TtFormCard);

declare global {
  interface HTMLElementTagNameMap {
    'tt-form-card': TtFormCard;
  }
}
