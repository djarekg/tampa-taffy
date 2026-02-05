import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { resource } from '@tt/core';
import { getUsers } from '@/api/user.api';

@customElement('app-users')
export class AppUsers extends LitElement {
  #resource = resource(this, {
    loader: () => getUsers(),
  });

  render() {
    const { renderer } = this.#resource;

    return html`
      <h1>Users Page</h1>
      <p>Welcome to the users page!</p>
      ${renderer({
        loading: () => html`
          <p>Loading users...</p>
        `,
        error: error => html`
          <p>Error loading users: ${error}</p>
        `,
        complete: users => html`
          <ul>
            ${users.map(
              user => html`
                <li key=${user.id}>${user.firstName} ${user.lastName}</li>
              `
            )}
          </ul>
        `,
      })}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-users': AppUsers;
  }
}
