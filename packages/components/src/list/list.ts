import { safeDefine } from '@tt/core/utils';
import { List } from './internal/list';
import styles from './internal/list.css';

declare global {
  interface HTMLElementTagNameMap {
    'tt-list': TtList;
  }
}

export class TtList extends List {
  static override styles = [styles];
}

safeDefine('tt-list', TtList);
