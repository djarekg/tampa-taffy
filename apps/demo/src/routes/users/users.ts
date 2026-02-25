import type { UserModel } from '@tt/db';

import { Task } from '@lit/task';
import '@m3e/icon';
import '@m3e/progress-indicator';
import '@tt/components/card';
import { safeDefine } from '@tt/core/utils';
import { html, LitElement } from 'lit';
import { repeat } from 'lit/directives/repeat.js';

import { getUsers } from '@/api/user.api';

import styles from './users.css';

/**
 * A simple users page that demonstrates fetching and displaying a list of users.
 */
export class Users extends LitElement {
  static override styles = [styles];

  readonly #usersTask = new Task(
    this,
    async () => getUsers(),
    () => [],
  );

  override render() {
    return html`
      ${this.#usersTask.render({
        pending: () => this.#renderPending(),
        error: () => this.#renderError(),
        complete: users => this.#renderUserList(users),
      })}
    `;
  }

  #renderPending() {
    return html`
      <div class="page-content">
        <m3e-circular-progress-indicator
          indeterminate></m3e-circular-progress-indicator>
      </div>
    `;
  }

  #renderError() {
    return html`
      <div class="page-content">
        <p>Encountered an error loading users</p>
      </div>
    `;
  }

  #renderUserList(users: UserModel[]) {
    return html`
      <div class="user-list">
        ${repeat(
          users,
          ({ id }) => id,
          (user, index) => this.#renderUserCard(user, index),
        )}
      </div>
    `;
  }

  #renderUserCard(user: UserModel, index: number) {
    return html`
      <tt-card key=${index}>
        <div class="header">
          <m3e-icon name="person" filled></m3e-icon>
          <span class="fullname">${user.firstName}&nbsp;${user.lastName}</span>
        </div>
        <div class="content">
          <div>
            <m3e-icon name="label" filled></m3e-icon>
            ${user.jobTitle}
          </div>
            <div>
              <m3e-icon name="email" filled></m3e-icon>
              ${user.email}
          </div>
        </div>
      </tt-card>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-users': Users;
  }
}

safeDefine('app-users', Users);
