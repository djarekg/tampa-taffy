import '@m3e/web/icon';

import { html, SignalWatcher } from '@lit-labs/signals';
import { debounce, property, query, type TypedEvent } from '@tt/core';
import { LitElement, nothing } from 'lit';

const INPUT_DEBOUNCE_DELAY = 300;
/**
 * A command palette component that can be used to display a list of commands and
 * allow the user to execute them.
 */
export class CommandPalette extends SignalWatcher(LitElement) {
  #debounceInput = debounce(
    this.#handleInputDebounced.bind(this),
    INPUT_DEBOUNCE_DELAY,
  );

  private _dialog = query<HTMLDialogElement>('dialog');

  /**
   * Whether the command palette is open. This is a reflected property,
   * so it can be used in CSS selectors.
   * @default false
   */
  open = property(false, {
    reflect: true,
    changed: value => this.#handleOpenChange(value as boolean),
  });

  /**
   * The list of command items to display in the palette. Each item should have a
   * `label` and an optional `icon` and `action` callback.
   * @default []
   */
  items = property([]);

  override render() {
    return html`
      <dialog
        closedby="any"
        @close=${this.#handleDialogClose}>
        <header>
          <m3e-icon name="search"></m3e-icon>
          <input
            placeholder="Type to search"
            @input=${this.#handleInputInput} />
        </header>
        ${this.#renderResults()}
      </dialog>
    `;
  }

  #renderResults() {
    return nothing;
  }

  show() {
    this._dialog?.showModal();
  }

  hide() {
    this._dialog?.close();
  }

  #handleInputInput(event: TypedEvent<Event, HTMLInputElement>) {
    const { value } = event.target;
    this.#debounceInput(value);
  }

  #handleInputDebounced(value: string) {
    this.dispatchEvent(
      new CustomEvent('search', {
        detail: { query: value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  #handleOpenChange = (open: boolean) => {
    if (open) {
      this.show();
    } else {
      this.hide();
    }
  };

  #handleDialogClose() {
    this.open = false;

    this.dispatchEvent(
      new CustomEvent('close', {
        detail: { message: 'Command palette closed' },
        bubbles: true,
        composed: true,
      }),
    );
  }
}
