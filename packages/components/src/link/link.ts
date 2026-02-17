import { html, SignalWatcher } from '@lit-labs/signals';
import { property } from '@tt/core/reactive';
import { css, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

const styles = css`
  :host {
    --_font-size: var(--tt-link-font-size, 0.875rem);
    --_font-weight: var(--tt-link-font-weight, 400);
    --_color: var(--tt-link-color, var(--md-sys-color-primary));
  }

  :host([color='primary']) {
    --_color: var(--md-sys-color-primary);
  }

  :host([color='secondary']) {
    --_color: var(--md-sys-color-secondary);
  }

  :host([color='error']) {
    --_color: var(--md-sys-color-error);
  }

  a {
    font-size: var(--_font-size);
    font-weight: var(--_font-weight);
    color: var(--_color);
    text-decoration: none;
    text-underline-offset: 3px;

    &:hover {
      text-decoration: underline;
    }
  }
`;

@customElement('tt-link')
export class Link extends SignalWatcher(LitElement) {
  static override styles = [styles];

  color = property<'primary' | 'secondary' | 'error' | ''>('primary', { reflect: true });

  href = property('#');

  override render() {
    return html`
      <a href="${this.href}">
        <slot></slot>
      </a>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tt-link': Link;
  }
}
