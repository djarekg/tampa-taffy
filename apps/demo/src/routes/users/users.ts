import { getUsers } from '@/api/user.api';
import { computed, html, SignalWatcher } from '@lit-labs/signals';
import { resource } from '@tt/core';
import { safeDefine } from '@tt/core/utils';
import { LitElement } from 'lit';

/**
 * @summary A simple users page that demonstrates fetching and displaying a list of users.
 *
 * @remarks
 * The `resource` function is used to manage the asynchronous loading of user data, and
 * the `computed` function creates a reactive view that updates based on the resource's
 * state (pending, error, complete).
 *
 * @note
 * This component is registered as 'app-users' and can be navigated to via the router.
 */
export class Users extends SignalWatcher(LitElement) {
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
      ${this.#usersView}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-users': Users;
  }
}

safeDefine('app-users', Users);
