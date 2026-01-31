import { LitElement, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import styles from './index.css?inline';
import { Task } from '@lit/task';
import { getStates } from '@/api/state';

@customElement('app-index')
export class Index extends LitElement {
  static override styles = [unsafeCSS(styles)];

  #getStates = new Task(
    this,
    async () => await getStates(),
    () => []
  );

  render() {
    return html`
      ${this.#getStates.render({
        pending: () => html`
          <p>Loading states...</p>
        `,
        complete: states => html`
          <ul>
            ${states.map(
              state => html`
                <li>${state.id} (${state.code})</li>
              `
            )}
          </ul>
        `,
        error: e => html`
          <p>Error loading users: ${e}</p>
        `,
      })}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-index': Index;
  }
}
