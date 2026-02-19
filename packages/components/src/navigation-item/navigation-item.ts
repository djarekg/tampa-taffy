import { NavigationItem } from './internal/navigation-item';
import styles from './internal/navigation-item.css';

declare global {
  interface HTMLElementTagNameMap {
    'tt-navigation-item': TtNavigationItem;
  }
}

export class TtNavigationItem extends NavigationItem {
  static override styles = [styles];
}

customElements.define('tt-navigation-item', TtNavigationItem);
