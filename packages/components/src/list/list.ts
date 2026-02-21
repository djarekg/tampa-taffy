import { safeDefine } from '@tt/core/utils';
import { List } from './internal/list';
import styles from './internal/list.css';

declare global {
  interface HTMLElementTagNameMap {
    'tt-list': TtList;
  }
}

/**
 * The `tt-list` component is a customizable list element that can be used to
 * display a collection of items. It supports various styles and configurations
 * to suit different use cases.
 */
export class TtList extends List {
  static override styles = [styles];
}

safeDefine('tt-list', TtList);
