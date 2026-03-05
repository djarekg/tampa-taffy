import '@m3e/web/icon';
import '@tt/components/command-palette';

import { computed, html, signal, SignalWatcher } from '@lit-labs/signals';
import { isNotEmpty, resource, safeDefine } from '@tt/core';
import type { SearchResult } from '@tt/db';
import { LitElement, nothing } from 'lit';

import { search } from '@/core/api/search.api';

import { parseSearchResults } from './parse-utils';
import styles from './search.css';

export class Search extends SignalWatcher(LitElement) {
  static override styles = [styles];

  #open = signal(false);
  #query = signal('');
  #resource = resource({
    defaultValue: new Array<SearchResult>(),
    params: () => ({ query: this.#query.get() }),
    loader: async ({ params }) => search(params.query),
  });
  #items = computed(() => {
    const results = this.#resource.value.get();

    if (isNotEmpty(results)) {
      const parsedResults = parseSearchResults(results);
      return parsedResults;
    }

    return nothing;
  });

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
        .items=${this.#items.get()}
        @search=${this.#handleCommandPaletteSearch}
        @close=${this.#handleCommandPaletteClose}>
      </tt-command-palette>
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
