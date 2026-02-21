import { html, SignalWatcher } from '@lit-labs/signals';
import { property, query } from '@tt/core/reactive';
import { LitElement } from 'lit';

export class List extends SignalWatcher(LitElement) {
  #listRoot = query<HTMLUListElement>('tt-list');

  /**
   * The aria-label attribute provides an accessible name for the list, which
   * can be read by screen readers.
   */
  override ariaLabel = property('');
  /**
   * The role attribute is set to "list" to indicate that this element is a list, which
   * can be used by assistive technologies to understand the structure of the content.
   *
   * @default list
   */
  ariaRole = property('list');
  /**
   * The alignment property determines the layout of the list items. It can be set to
   * "horizontal" for a horizontal list or "vertical" for a vertical list.
   *
   * @default vertical
   */
  alignment = property<'horizontal' | 'vertical'>('vertical', { reflect: true });
  /**
   * We set tabindex on the list to allow it to receive focus for keyboard navigation,
   * but we don't want it to be focusable by default since that can interfere with screen
   * readers. By default, the list itself is not focusable (tabindex=-1), but it can be
   * made focusable by setting listTabIndex to 0 or a positive value.
   *
   * @default 0
   */
  listTabIndex = property(0, { type: Number });

  override render() {
    return html`
      <ul
        class="tt-list"
        ariaLabel=${this.ariaLabel}
        role=${this.ariaRole}
        tabindex=${this.listTabIndex}>
        <slot @click=${(e: Event) => e.stopPropagation()}></slot>
      </ul>
    `;
  }

  override focus() {
    this.#listRoot?.focus();
  }
}
