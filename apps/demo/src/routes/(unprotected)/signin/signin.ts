import { signin } from '@/auth';
import { routerContext } from '@/router';
import { html, signal, SignalWatcher } from '@lit-labs/signals';
import { consume } from '@lit/context';
import '@m3e/button';
import '@m3e/form-field';
import '@tt/components/link';
import { throwIfEmpty, type TypeEvent } from '@tt/core';
import { state } from '@tt/core/reactive';
import { safeDefine } from '@tt/core/utils';
import { LitElement, nothing } from 'lit';
import type { UIRouterLit } from 'lit-ui-router';
import styles from './signin.css';

/**
 * Extracts email and password from the form data, throwing an error if either is missing.
 *
 * @param form - The HTMLFormElement containing the email and password fields.
 * @returns An object with email and password properties.
 * @throws Will throw an error if email or password is missing.
 */
const extractCredentials = (form: HTMLFormElement) => {
  const formData = new FormData(form);
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();

  throwIfEmpty(email, 'Email is required');
  throwIfEmpty(password, 'Password is required');

  return { email, password };
};

/**
 * SignIn component that renders a sign-in form and handles authentication.
 *
 * @remarks
 * The component uses a signal to track invalid credentials and conditionally
 * renders an error message. It also consumes the router context to navigate
 * on successful sign-in.
 */
export class SignIn extends SignalWatcher(LitElement) {
  static override styles = [styles];

  #invalidCredentials = signal(false);

  @consume({ context: routerContext, subscribe: true })
  private _router = state<UIRouterLit | undefined>(undefined);

  override render() {
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
            required
            @keydown=${this.#handleInputKeyDown} />
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
            required
            @keydown=${this.#handleInputKeyDown} />
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

        ${this.#renderError()}

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

  #renderError() {
    if (this.#invalidCredentials.get()) {
      return html`
        <span class="error">Invalid email or password. Please try again.</span>
      `;
    }

    return nothing;
  }

  #handleInputKeyDown(e: KeyboardEvent) {
    // If the user presses Enter while focused on an input, submit the form.
    if (e.key === 'Enter') {
      e.target instanceof HTMLInputElement && e.target.closest('form')?.requestSubmit();
    }
  }

  async #handleSubmit(e: TypeEvent<HTMLFormElement>) {
    e.preventDefault();

    this.#invalidCredentials.set(false);

    try {
      const { email, password } = extractCredentials(e.target);
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
    'app-signin': SignIn;
  }
}

safeDefine('app-signin', SignIn);
