import { html, SignalWatcher } from '@lit-labs/signals';
import '@m3e/icon';
import { isNotEmpty } from '@tt/core';
import { property } from '@tt/core/reactive';
import { LitElement } from 'lit';

export class NavigationItem extends SignalWatcher(LitElement) {
  /**
   * The URL that the navigation item points to. This is rendered as the href attribute
   * of the underlying anchor element.
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
   * @default null which means no icon will be rendered.
   */
  icon = property<string | null>(null);

  override render() {
    const iconHtml = isNotEmpty(this.icon)
      ? html`
          <m3e-icon name=${this.icon}></m3e-icon>
        `
      : null;

    return html`
      <a href=${this.href}>
        ${iconHtml}
        <span class="label">${this.label}</span>
        <div class="indicator"></div>
      </a>
    `;
  }
}
