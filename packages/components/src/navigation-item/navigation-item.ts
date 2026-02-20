import { safeDefine } from '@tt/core/utils';
import { NavigationItem } from './internal/navigation-item';
import styles from './internal/navigation-item.css';

declare global {
  interface HTMLElementTagNameMap {
    'tt-navigation-item': TtNavigationItem;
  }
}

/**
 * The `tt-navigation-item` component represents an individual item within a
 * list or navigation element. It can be used to create links or buttons that
 * navigate to different sections of an application.
 */
export class TtNavigationItem extends NavigationItem {
  static override styles = [styles];
}

safeDefine('tt-navigation-item', TtNavigationItem);
