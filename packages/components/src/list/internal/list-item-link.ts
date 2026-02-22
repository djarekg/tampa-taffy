import { html } from '@lit-labs/signals';
import { property } from '@tt/core/reactive';
import '../../link/link.js';
import { ListItem } from './list-item';

export class ListItemLink extends ListItem {
  /**
   * The URL that the link points to.
   *
   * @default 'javascript:void(0)'
   */
  href = property('javascript:void(0)');
  /**
   * The target attribute specifies where to open the linked document.
   *
   * @default _self
   */
  target = property('_self');

  protected override renderContent(content: unknown) {
    return html`
      <a
        href=${this.href}
        target=${this.target}>
        ${content}
      </a>
    `;
  }
}
