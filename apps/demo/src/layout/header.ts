import { customElement } from 'lit/decorators.js';
import { css, html, LitElement } from 'lit';

const styles = css`
  header {
    color: var(--tt-color-primary);
  }
`;

@customElement('app-header')
export class Header extends LitElement {
  static override styles = [styles];

  render() {
    return html`
      <header>
        <h1>Welcome to the Demo App</h1>
      </header>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-header': Header;
  }
}
