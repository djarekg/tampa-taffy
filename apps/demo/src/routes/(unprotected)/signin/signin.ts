import '@material/web/button/outlined-button';
import '@material/web/textfield/filled-text-field';
import { html, SignalWatcher } from '@lit-labs/signals';
import { customElement } from 'lit/decorators.js';
import { LitElement } from 'lit';

import styles from './signin.css';

@customElement('app-signin')
export class SignInRoute extends SignalWatcher(LitElement) {
  static override styles = [styles];

  override render() {
    return html`
      <form class="form">
        <md-filled-text-field
          type="email"
          name="email"
          label="Email"
          required></md-filled-text-field>
        <md-filled-text-field
          type="password"
          name="password"
          label="Password"
          required></md-filled-text-field>
        <md-outlined-button type="submit">Sign In</md-outlined-button>
      </form>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-signin': SignInRoute;
  }
}
