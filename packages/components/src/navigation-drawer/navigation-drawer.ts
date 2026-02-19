import { NavigationDrawer } from './internal/navigation-drawer';
import styles from './internal/navigation-drawer.css';

declare global {
  interface HTMLElementTagNameMap {
    'tt-navigation-drawer': TtNavigationDrawer;
  }
}

export class TtNavigationDrawer extends NavigationDrawer {
  static override styles = [styles];
}

customElements.define('tt-navigation-drawer', TtNavigationDrawer);
