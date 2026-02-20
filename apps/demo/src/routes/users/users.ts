import { getUsers } from '@/api/user.api';
import { computed, watch } from '@lit-labs/signals';
import { resource } from '@tt/core';
import { safeDefine } from '@tt/core/utils';
import { LitElement, html } from 'lit';

export class Users extends LitElement {
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

  override render() {
    return html`
      <h1>Users Page</h1>
      <p>Welcome to the users page!</p>
      ${watch(this.#usersView)}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-users': Users;
  }
}

safeDefine('app-users', Users);
