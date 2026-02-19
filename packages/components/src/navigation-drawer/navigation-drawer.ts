import { NavigationDrawer } from './internal/navigation-drawer';
import styles from './internal/navigation-drawer.css';

declare global {
  interface HTMLElementTagNameMap {
    'tt-navigation-drawer': TtNavigationDrawer;
  }
}

/**
 * The `tt-navigation-drawer` component is a UI element that provides a side panel for navigation.
 *
 * @remarks
 * This component extends the base `NavigationDrawer` class and applies custom styles.
 * It can be toggled open or closed, and emits a `drawer-closed` event when the drawer is closed.
 */
export class TtNavigationDrawer extends NavigationDrawer {
  static override styles = [styles];
}

customElements.define('tt-navigation-drawer', TtNavigationDrawer);
