import '@m3e/button';
import '@m3e/form-field';
import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import { signin } from '@/api/auth.api';
import { throwIfEmpty } from '@tt/core';
import styles from './signin.css';

@customElement('app-signin')
export class SignInRoute extends LitElement {
  static override styles = [styles];

  override render() {
    return html`
      <form
        class="form"
        method="post"
        @submit=${this.#handleSubmit}>
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
            required />
        </m3e-form-field>
        <m3e-form-field variant="outlined">
          <label
            slot="label"
            for="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required />
        </m3e-form-field>
        <m3e-button
          variant="outlined"
          type="submit">
          Sign In
        </m3e-button>
      </form>
    `;
  }

  async #handleSubmit(e: Event) {
    e.preventDefault();

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const email = formData.get('email')?.toString();
      const password = formData.get('password')?.toString();

      throwIfEmpty(email, 'Email is required');
      throwIfEmpty(password, 'Password is required');

      const result = await signin(email, password);
      console.log(result);
    } catch (err) {
      console.error('Failed to sign in', err);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-signin': SignInRoute;
  }
}
