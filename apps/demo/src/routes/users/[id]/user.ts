import type { UserModel } from '@tt/db';
import type { UIRouterLit } from 'lit-ui-router';

import { html } from '@lit-labs/signals';
import { consume } from '@lit/context';
import { Task } from '@lit/task';
import '@m3e/web/button';
import '@m3e/web/form-field';
import '@m3e/web/progress-indicator';
import '@m3e/web/select';
import '@tt/components/card';
import { safeDefine } from '@tt/core';
import { LitElement } from 'lit';

import { getUser } from '@/core/api/user.api';
import { routerContext } from '@/router';

import styles from './user.css';

export class User extends LitElement {
  static override styles = [styles];

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
      <form class="page-content user-content">
        <tt-card variant="filled">
            <header class="header">
              <m3e-icon name="person" filled></m3e-icon>
              <h2>Created on:${user.dateCreated}</h2>
            </header>
            <section>
              <div>
                <m3e-form-field variant="outlined">
                  <label
                    slot="label"
                    for="firstName">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    required/>
                </m3e-form-field>
                <m3e-form-field variant="outlined">
                  <label
                    slot="label"
                    for="lastName">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    required/>
                </m3e-form-field>
              </div>

              <div>
              <m3e-form-field variant="outlined">
  <label slot="label" for="select">Gender</label>
  <m3e-select id="select">

    <m3e-option>Grapes</m3e-option>
  </m3e-select>
</m3e-form-field>
              </div>
            </section>
          </tt-card>
      </form>
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
