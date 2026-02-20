import { safeDefine } from '@tt/core/utils';
import { css, html, LitElement } from 'lit';

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

safeDefine('app-home', Home);
