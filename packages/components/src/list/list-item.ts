import { safeDefine } from '@tt/core';
import { ListItem } from './internal/list-item';
import styles from './internal/list-item.css';

declare global {
  interface HTMLElementTagNameMap {
    'tt-list-item': ListItem;
  }
}

/**
 * The `tt-list-item` component represents an individual item within a list. It can be used
 * to display content such as text, images, or other elements. It is designed to be used
 * within a `tt-list` component and can be styled and configured to fit various use cases.
 */
export class TtListItem extends ListItem {
  static override styles = [styles];
}

safeDefine('tt-list-item', TtListItem);
