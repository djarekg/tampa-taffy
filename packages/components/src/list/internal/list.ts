import { html, SignalWatcher } from '@lit-labs/signals';
import { property, query } from '@tt/core/reactive';
import { LitElement } from 'lit';

export class List extends SignalWatcher(LitElement) {
  /**
   * Note: aria-label and role are required on the list element for accessibility,
   * but we use data- attributes to avoid Lit's special handling of those attributes
   * which can cause issues with screen readers. See
   */
  override ariaLabel = property('', { reflect: true, attribute: 'data-aria-label' });
  /**
   * Similar to aria-label, we use a data- attribute for role to avoid Lit's special
   * handling which can cause issues with screen readers.
   */
  ariaRole = property('list', { reflect: true, attribute: 'data-aria-role' });
  /**
   * We set tabindex on the list to allow it to receive focus for keyboard navigation,
   * but we don't want it to be focusable by default since that can interfere with screen
   * readers. By default, the list itself is not focusable (tabindex=-1), but it can be
   * made focusable by setting listTabIndex to 0 or a positive value.
   */
  listTabIndex = property(0, { type: Number });
  /**
   * We use a query to get a reference to the list element in the render root. This allows
   * us to focus the list when the component itself is focused.
   */
  #listRoot = query<HTMLUListElement>('tt-list');

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
