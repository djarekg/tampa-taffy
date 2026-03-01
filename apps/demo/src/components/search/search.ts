import '@m3e/web/icon';
import '@tt/components/command-palette';
import '@tt/components/link';

import { html, signal, SignalWatcher } from '@lit-labs/signals';
import { Task } from '@lit/task';
import { safeDefine } from '@tt/core';
import { LitElement } from 'lit';

import { search } from '@/core/api/search.api';

import styles from './search.css';

export class Search extends SignalWatcher(LitElement) {
  static override styles = [styles];

  #open = signal(false);
  #query = signal('');

  #searchTask = new Task(
    this,
    async ([query]) => search(query),
    () => [this.#query.get()],
  );

  override connectedCallback() {
    super.connectedCallback();
    window.addEventListener('keydown', this.#handleKeyDown);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('keydown', this.#handleKeyDown);
  }

  override render() {
    return html`
      <div class="placeholder"></div>
      <tt-command-palette
        ?open=${this.#open.get()}
        @search=${this.#handleCommandPaletteSearch}
        @close=${this.#handleCommandPaletteClose}></tt-command-palette>
    `;
  }

  #handleKeyDown = (e: KeyboardEvent) => {
    // Open the command palette when Ctrl+K or / is pressed
    if (e.key === '/' || (e.ctrlKey && e.key === 'k')) {
      e.preventDefault();
      this.#open.set(true);
    }
  };

  #handleCommandPaletteSearch(event: CustomEvent<{ query: string }>) {
    const { query } = event.detail;
    this.#query.set(query);
  }

  #handleCommandPaletteClose() {
    this.#open.set(false);
  }
}

safeDefine('app-search', Search);

declare global {
  interface HTMLElementTagNameMap {
    'app-search': Search;
  }
}
