import '@/components/select/gender-select';
import '@m3e/web/button';
import '@m3e/web/form-field';
import '@m3e/web/progress-indicator';
import '@m3e/web/select';
import '@tt/components/card';

import { html } from '@lit-labs/signals';
import { consume } from '@lit/context';
import { Task } from '@lit/task';
import { formatDate, safeDefine } from '@tt/core';
import type { UserModel } from '@tt/db';
import { LitElement } from 'lit';
import type { UIRouterLit } from 'lit-ui-router';

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
              <h2>Created on: ${formatDate(new Date(user.dateCreated))}</h2>
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
                    autocomplete="given-name"
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
                    autocomplete="family-name"
                    required/>
                </m3e-form-field>
              </div>

              <div>
                <m3e-form-field variant="outlined">
                  <label
                    slot="label"
                    for="jobTitle">
                    Job Title
                  </label>
                  <input
                    id="jobTitle"
                    name="jobTitle"
                    autocomplete="organization-title"
                    required/>
                </m3e-form-field>
              </div>

              <div>
                <m3e-form-field variant="outlined">
                  <label
                    slot="label"
                    for="email">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autocomplete="email"
                    required/>
                </m3e-form-field>
                <m3e-form-field variant="outlined">
                  <label
                    slot="label"
                    for="phone">
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autocomplete="tel"
                    required/>
                </m3e-form-field>
              </div>

              <!-- <div>
                <app-gender-select .value=${user.gender}></app-gender-select>
              </div> -->
            </section>
          </tt-card>

          <tt-card variant="filled">
            <section>
              <div>
                <m3e-form-field variant="outlined">
                  <label
                    slot="label"
                    for="streetAddress">
                    Street Address
                  </label>
                  <input
                    id="streetAddress"
                    name="streetAddress"
                    autocomplete="street-address"
                    required/>
                </m3e-form-field>
              </div>

              <div>
                <m3e-form-field variant="outlined">
                  <label
                    slot="label"
                    for="streetAddress2">
                    Street Address 2
                  </label>
                  <input
                    id="streetAddress2"
                    name="streetAddress2"
                    autocomplete="address-line2"
                    required/>
                </m3e-form-field>
              </div>

              <div>
                <m3e-form-field variant="outlined">
                  <label
                    slot="label"
                    for="city">
                    City
                  </label>
                  <input
                    id="city"
                    name="city"
                    autocomplete="address-level2"
                    required/>
                </m3e-form-field>
                <m3e-form-field variant="outlined">
                  <label
                    slot="label"
                    for="state">
                    State
                  </label>
                  <input
                    id="state"
                    name="state"
                    autocomplete="address-level1"
                    required/>
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
