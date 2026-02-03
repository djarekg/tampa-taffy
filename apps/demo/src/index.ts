import { LitElement, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import styles from './index.css?inline';
import './layout/header.js';
import { resource } from '@tt/core/resource';
import { getUsers } from '@/api/user.api';

@customElement('app-index')
export class Index extends LitElement {
  static override styles = [unsafeCSS(styles)];

  #usersResource = resource({
    host: this,
    loader: () => getUsers(),
  });

  render() {
    const { renderer } = this.#usersResource;

    return html`
      <app-header></app-header>
      <main>
        <h2 class="tt-color-brand-gradient">Demo Application</h2>
        <p>This is a demo application showcasing the Tampa Taffy design system.</p>
        <section>
          <h3 class="tt-color-brand-gradient">User List</h3>
          ${renderer({
            pending: () => html`
              <p>Loading users...</p>
            `,
            complete: users => html`
              <ul>
                ${users.map(
                  user => html`
                    <li>${user.firstName} (${user.lastName})</li>
                  `
                )}
              </ul>
            `,
            error: err => html`
              <p class="error">Error loading users: ${err}</p>
            `,
          })}
        </section>
      </main>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-index': Index;
  }
}
