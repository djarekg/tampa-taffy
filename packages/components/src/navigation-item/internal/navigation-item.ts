import { html, SignalWatcher } from '@lit-labs/signals';
import '@m3e/icon';
import { isNotEmpty } from '@tt/core';
import { property } from '@tt/core/reactive';
import { LitElement, nothing } from 'lit';

export class NavigationItem extends SignalWatcher(LitElement) {
  /**
   * The URL that the link points to.
   *
   * @default '#'
   */
  href = property('#');
  /**
   * The label text to display for the navigation item.
   */
  label = property('');
  /**
   * The name of the Material icon to display for the navigation item. If not provided,
   * no icon will be rendered.
   *
   * @default null
   */
  icon = property<string | null>(null);

  override render() {
    return html`
      <a href=${this.href}>
        ${this.#renderIcon()}
        <span class="label">${this.label}</span>
        <div class="indicator"></div>
      </a>
    `;
  }

  #renderIcon() {
    if (isNotEmpty(this.icon)) {
      return html`
        <span class="icon">${this.icon}</span>
      `;
    }

    return nothing;
  }
}
