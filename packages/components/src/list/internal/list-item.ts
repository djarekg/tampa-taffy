import { html, SignalWatcher } from '@lit-labs/signals';
import { property } from '@tt/core/reactive';
import { LitElement, nothing } from 'lit';
import { when } from 'lit/directives/when.js';

export class ListItem extends SignalWatcher(LitElement) {
  /**
   * The ARIA checked attribute for the list item.
   *
   * @default false
   */
  ariaCheckedOverride = property<'true' | 'false'>('false');
  /**
   * The ARIA selected attribute for the list item.
   *
   * @default false
   */
  ariaCSelected = property<'true' | 'false'>('false');
  /**
   * The ARIA role attribute for the list item.
   *
   * @default listitem
   */
  ariaRole = property('listitem');
  /**
   * The tabindex attribute for the list item. This determines whether the list item is focusable
   * and its position in the tab order. By default, list items are not focusable (tabindex=-1)
   * to prevent them from being focusable by screen readers, but they can be made focusable
   * by setting itemTabIndex to 0 or a positive value.
   *
   * @default -1
   */
  itemTabIndex = property(-1, { type: Number });
  /**
   * Whether the list item is active. An active list item is typically styled
   * differently to indicate that it is currently selected or highlighted.
   *
   * @default false
   */
  active = property(false, { type: Boolean });
  /**
   * Whether the list item is disabled. A disabled list item cannot be interacted with.
   *
   * @default false
   */
  disabled = property(false, { type: Boolean });
  /**
   * The headline text to display for the list item.
   */
  headline = property('');
  /**
   * The supporting text to display for the list item. This is rendered
   * below the headline in a smaller font size.
   */
  supportingText = property('');
  /**
   * The type of indicator to display for the list item. The indicator is a visual
   * element that can be used to highlight the list item on hover or focus. The
   * 'background' indicator displays a background color behind the list item, while
   * the 'underline' indicator displays a line underneath the headline. The 'none' option
   * disables the indicator.
   *
   * @default 'background'
   */
  indicator = property<'background' | 'underline' | 'none'>('background');

  override render() {
    const indicator = this.#getIndicator();
    return html`
      <li
        class="list-item"
        aria-checked=${this.ariaCheckedOverride || nothing}
        aria-selected=${this.ariaCSelected || nothing}
        tabindex=${this.disabled ? -1 : this.itemTabIndex}
        role=${this.ariaRole}>
        ${this.#renderListItemContent()} ${this.#renderIndicator(indicator)}
      </li>
    `;
  }

  #renderListItemContent() {
    const content = html`
      <div class="content">${this.#renderStart()} ${this.#renderBody()} ${this.#renderEnd()}</div>
    `;

    return this.renderContent(content);
  }

  protected renderContent(content: unknown) {
    return html`
      ${content}
    `;
  }

  #renderStart() {
    return html`
      <slot name="start"></slot>
    `;
  }

  #renderBody() {
    const headline = this.#getHeadline();
    const supportingText = this.#getSupportingText();
    return html`
      <div class="body">
        <span class="headline">${headline}</span>
        ${when(supportingText, () => this.#renderSupportingText(supportingText))}
      </div>
    `;
  }

  #renderSupportingText(supportingText: string) {
    return html`
      <span class="supporting-text">${supportingText}</span>
    `;
  }

  #renderEnd() {
    return html`
      <slot name="end"></slot>
    `;
  }

  #renderIndicator(indicator: string) {
    return when(
      indicator === 'background',
      () => html`
        <div class="indicator"></div>
      `
    );
  }

  #getHeadline() {
    return this.headline ?? this.getAttribute('headline') ?? '';
  }

  #getSupportingText() {
    return this.supportingText ?? this.getAttribute('supportingtext') ?? '';
  }

  #getIndicator() {
    return this.indicator ?? this.getAttribute('indicator') ?? 'background';
  }
}
