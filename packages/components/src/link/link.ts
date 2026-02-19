import { Link } from './internal/link';
import styles from './internal/link.css';

declare global {
  interface HTMLElementTagNameMap {
    'tt-link': TtLink;
  }
}

export class TtLink extends Link {
  static override styles = [styles];
}

customElements.define('tt-link', TtLink);
