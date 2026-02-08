import { customElement } from 'lit/decorators.js';
import { css, html, LitElement } from 'lit';

@customElement('app-home')
export class Home extends LitElement {
  static override styles = [
    css`
      :host {
        display: grid;
        place-content: center;
        block-size: 100%;
      }
    `,
  ];

  override render() {
    return html`
      <h1>Welcome to the Home Page</h1>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-home': Home;
  }
}
