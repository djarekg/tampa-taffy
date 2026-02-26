import { safeDefine } from '@tt/core/utils';

import { Link } from './internal/link';
import styles from './internal/link.css';

/**
 * The `tt-link` component is a customizable link element.
 */
export class TtLink extends Link {
  static override styles = [styles];
}

safeDefine('tt-link', TtLink);

declare global {
  interface HTMLElementTagNameMap {
    'tt-link': TtLink;
  }
}
