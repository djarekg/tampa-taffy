import { getUsers } from '@/api/user.api';
import { Task } from '@lit/task';
import { safeDefine } from '@tt/core/utils';
import { html, LitElement } from 'lit';

/**
 * @summary A simple users page that demonstrates fetching and displaying a list of users.
 *
 * @note
 * This component is registered as 'app-users' and can be navigated to via the router.
 */
export class Users extends LitElement {
  #usersTask = new Task(
    this,
    async () => getUsers(),
    () => []
  );

  override render() {
    return html`
      ${this.#usersTask.render({
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
      })}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-users': Users;
  }
}

safeDefine('app-users', Users);
