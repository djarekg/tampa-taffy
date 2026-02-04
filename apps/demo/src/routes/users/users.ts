import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('app-users')
export class AppUsers extends LitElement {
  render() {
    return html`
      <h1>Users Page</h1>
      <p>Welcome to the users page!</p>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-users': AppUsers;
  }
}
