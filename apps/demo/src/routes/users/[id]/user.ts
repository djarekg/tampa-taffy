import '@/components/user/user-detail/user-detail';
import '@m3e/web/progress-indicator';

import { html } from '@lit-labs/signals';
import { consume } from '@lit/context';
import { Task } from '@lit/task';
import { query, safeDefine } from '@tt/core';
import type { UserModel } from '@tt/db';
import { LitElement } from 'lit';
import type { UIRouterLit } from 'lit-ui-router';

import { getUser } from '@/core/api/user.api';
import { routerContext } from '@/router';

import styles from './user.css';

export class User extends LitElement {
  static override styles = [styles];

  #form = query<HTMLFormElement>('form', true);

  @consume({ context: routerContext, subscribe: true })
  private readonly _router!: UIRouterLit;

  readonly #userTask = new Task(
    this,
    async ([id]) => getUser(id),
    () => [this._router.globals.params!.id as string],
  );

  override render() {
    return html`
      ${this.#userTask.render({
        pending: () => this.#renderPending(),
        error: () => this.#renderError(),
        complete: user => this.#renderUser(user),
      })}
    `;
  }

  #renderUser(user: UserModel) {
    return html`
      <div class="page-content user-content">
        <app-user-detail .user=${user}></app-user-detail>
      </div>
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
}

declare global {
  interface HTMLElementTagNameMap {
    'app-user': User;
  }
}

safeDefine('app-user', User);
