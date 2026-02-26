import { safeDefine } from '@tt/core';

import { Breadcrumbs } from './internal/breadcrumbs';
import styles from './internal/breadcrumbs.css';

/**
 * The `tt-breadcrumbs` component is a container for breadcrumb navigation items.
 */
export class TtBreadcrumbs extends Breadcrumbs {
  static override styles = [styles];
}

safeDefine('tt-breadcrumbs', TtBreadcrumbs);

declare global {
  interface HTMLElementTagNameMap {
    'tt-breadcrumbs': TtBreadcrumbs;
  }
}
