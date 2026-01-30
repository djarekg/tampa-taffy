import { LitElement, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import styles from './index.css?inline';
import { Task } from '@lit/task';
import { getUsers } from '@/api/user';

@customElement('app-index')
export class Index extends LitElement {
  static override styles = [unsafeCSS(styles)];

  #getUsers = new Task(
    this,
    async () => await getUsers(),
    () => []
  );

  render() {
    return html`
      ${this.#getUsers.render({
        pending: () => html`
          <p>Loading users...</p>
        `,
        complete: users => html`
          <ul>
            ${users.map(
              user => html`
                <li>${user.firstName} (${user.lastName})</li>
              `
            )}
          </ul>
        `,
        error: e => html`
          <p>Error loading users: ${e}</p>
        `,
      })}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-index': Index;
  }
}
