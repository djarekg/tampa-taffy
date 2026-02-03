import { customElement } from 'lit/decorators.js';
import { html, LitElement } from 'lit';

@customElement('app-home')
export class Home extends LitElement {
  render() {
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
