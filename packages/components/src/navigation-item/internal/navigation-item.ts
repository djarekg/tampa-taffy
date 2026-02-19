import { html, SignalWatcher } from '@lit-labs/signals';
import '@m3e/icon';
import { isNotEmpty } from '@tt/core';
import { property } from '@tt/core/reactive';
import { LitElement } from 'lit';

export class NavigationItem extends SignalWatcher(LitElement) {
  href = property('');
  label = property('');
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
