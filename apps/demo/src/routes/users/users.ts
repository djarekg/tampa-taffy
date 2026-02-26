import '@m3e/web/icon';
import '@m3e/web/progress-indicator';
import '@tt/components/card';

import { html } from '@lit-labs/signals';
import { consume } from '@lit/context';
import { Task } from '@lit/task';
import { safeDefine } from '@tt/core/utils';
import type { UserModel } from '@tt/db';
import { LitElement } from 'lit';
import type { UIRouterLit } from 'lit-ui-router';
import { repeat } from 'lit/directives/repeat.js';

import { getUsers } from '@/core/api/user.api';
import { routerContext } from '@/router';

import styles from './users.css';

/**
 * A simple users page that demonstrates fetching and displaying a list of users.
 */
export class Users extends LitElement {
  static override styles = [styles];

  @consume({ context: routerContext, subscribe: true })
  private _router!: UIRouterLit;

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
      <tt-card key=${index} @click=${async () => this.#handleUserClick(user.id)}>
        <div class="header">
          <m3e-icon
            name=${user.gender === 'FEMALE' ? 'face_3' : 'face'}
            filled
            ?female=${user.gender === 'FEMALE'}
            ?male=${user.gender !== 'FEMALE'}></m3e-icon>
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

  async #handleUserClick(id: string) {
    await this._router.stateService.go('user', { id });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-users': Users;
  }
}

safeDefine('app-users', Users);
