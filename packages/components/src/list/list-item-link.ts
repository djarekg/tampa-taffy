import { safeDefine } from '@tt/core';
import { ListItemLink } from './internal/list-item-link';
import styles from './internal/list-item-link.css';
import baseStyles from './internal/list-item.css';

declare global {
  interface HTMLElementTagNameMap {
    'tt-list-item-link': ListItemLink;
  }
}

/**
 * The `tt-list-item-link` component represents a list item that functions as a link.
 * It can be used within a `tt-list` to create navigable items that direct users to
 * different sections of an application or external resources.
 */
export class TtListItemLink extends ListItemLink {
  static override styles = [baseStyles, styles];
}

safeDefine('tt-list-item-link', TtListItemLink);
