import { LitElement, html } from 'lit';
import { computed, watch } from '@lit-labs/signals';
import { customElement } from 'lit/decorators.js';
import { resource } from '@tt/core';
import { getUsers } from '@/api/user.api';

@customElement('app-users')
export class AppUsers extends LitElement {
  #resource = resource({
    loader: () => getUsers(),
  });

  #usersView = computed(() =>
    this.#resource.renderer({
      pending: () => html`
        <p>Loading users...</p>
      `,
      error: error => html`
        <p>Error loading users: ${error}</p>
      `,
      complete: users => html`
        <ul>
          ${users?.map(
            user => html`
              <li key=${user.id}>${user.firstName} ${user.lastName}</li>
            `
          )}
        </ul>
      `,
    })
  );

  render() {
    return html`
      <h1>Users Page</h1>
      <p>Welcome to the users page!</p>
      ${watch(this.#usersView)}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-users': AppUsers;
  }
}
