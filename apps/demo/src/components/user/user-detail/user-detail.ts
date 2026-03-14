import '@/components/select/gender-select';
import '@m3e/web/form-field';
import '@tt/components/card';
import '@tt/components/form';

import { safeDefine } from '@tt/core';
import { property } from '@tt/core/reactive';
import { formatDate } from '@tt/core/utils';
import type { UserModel } from '@tt/db';
import { html, LitElement } from 'lit';

import styles from './user-detail.css';

export class UserDetail extends LitElement {
  static override styles = [styles];

  user = property<UserModel | undefined>(undefined);

  override render() {
    return html`
      <tt-form>
         <tt-card variant="filled">
            <header class="header">
              <h2>Created on: ${formatDate(new Date(this.user?.dateCreated || ''))}</h2>
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
                <app-gender-select .value=${this.user?.gender}></app-gender-select>
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
      </tt-form>
    `;
  }
}

safeDefine('app-user-detail', UserDetail);

declare global {
  interface HTMLElementTagNameMap {
    'app-user-detail': UserDetail;
  }
}
