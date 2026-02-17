import { signin } from '@/api/auth.api';
import { routerContext } from '@/router';
import { html, signal, SignalWatcher } from '@lit-labs/signals';
import { consume } from '@lit/context';
import '@m3e/button';
import '@m3e/form-field';
import '@tt/components/link';
import { throwIfEmpty } from '@tt/core';
import { LitElement } from 'lit';
import type { UIRouterLit } from 'lit-ui-router';
import { customElement, state } from 'lit/decorators.js';
import styles from './signin.css';

@customElement('app-signin')
export class SignInRoute extends SignalWatcher(LitElement) {
  static override styles = [styles];

  #invalidCredentials = signal(false);

  @consume({ context: routerContext })
  @state()
  private _router?: UIRouterLit;

  override render() {
    const errorHtml = this.#invalidCredentials.get()
      ? html`
          <span class="error">Invalid email or password. Please try again.</span>
        `
      : null;

    return html`
      <form
        class="form"
        method="post"
        @submit=${this.#handleSubmit}>
        <h2 class="title">Sign In</h2>
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
        <m3e-form-field
          variant="outlined"
          hide-subscript="never">
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
          <div
            class="password-hint"
            slot="hint">
            <tt-link
              href="/change-password"
              color="secondary">
              Forgot password?
            </tt-link>
          </div>
        </m3e-form-field>

        <m3e-button
          variant="outlined"
          type="submit">
          Sign In
        </m3e-button>

        ${errorHtml}

        <div class="account-actions">
          <tt-link href="/signup">Don't have an account? Sign Up</tt-link>
          <img
            class="ghost-icon"
            width="24"
            height="24"
            src="/ghost.svg"
            alt="Ghost Icon" />
        </div>
      </form>
    `;
  }

  async #handleSubmit(e: Event) {
    e.preventDefault();

    this.#invalidCredentials.set(false);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const email = formData.get('email')?.toString();
      const password = formData.get('password')?.toString();

      throwIfEmpty(email, 'Email is required');
      throwIfEmpty(password, 'Password is required');

      const success = await signin(email, password);

      // If signin succeeds without throwing, navigate to home
      if (success) {
        return this._router?.stateService.go('home');
      }
    } catch (err) {
      console.error('Failed to sign in', err);
    }

    this.#invalidCredentials.set(true);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-signin': SignInRoute;
  }
}
