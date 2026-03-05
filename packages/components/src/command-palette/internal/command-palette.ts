import '@m3e/web/icon';
import '../../list';

import { html, signal, SignalWatcher } from '@lit-labs/signals';
import {
  debounce,
  isNotEmpty,
  property,
  query,
  type TypedEvent,
} from '@tt/core';
import { LitElement, nothing } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import type { CommandPaletteResultItem } from './command-palette-result-item';

const INPUT_DEBOUNCE_DELAY = 300;
/**
 * A command palette component that can be used to display a list of commands and
 * allow the user to execute them.
 */
export class CommandPalette extends SignalWatcher(LitElement) {
  #hasResults = signal(false);

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
  items = property<CommandPaletteResultItem[] | undefined>(undefined, {
    changed: value => this.#hasResults.set(!!value?.length),
  });

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
    const { items } = this;

    if (isNotEmpty(items)) {
      return html`
      <tt-list
        ariaRole="navigation"
        class=${classMap(this.#getResultsClasses())}>
        ${this.#renderListItems(items)}
      </tt-list>
    `;
    }

    return nothing;
  }

  #renderListItems(items: CommandPaletteResultItem[]) {
    return items.map(item => {
      return html`
      <tt-list-item-link
        indicator="none"
        .href=${item.href}
        .headline=${item.headline}
        .supportingText=${ifDefined(item.supportingText)}
        @mouseenter=${this.#handleMouseenter}
        @mouseleave=${this.#handleMouseleave}>
        ${isNotEmpty(item.icon) ? html`<m3e-icon name=${item.icon} slot="end"></m3e-icon>` : nothing}
      </tt-list-item-link>
    `;
    });
  }

  show() {
    this._dialog?.showModal();
  }

  hide() {
    this._dialog?.close();
  }

  #getResultsClasses() {
    return {
      results: true,
      'has-results': this.#hasResults.get(),
    };
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

  #handleMouseenter(e: TypedEvent<MouseEvent, HTMLElement>) {
    // Set the "filled" attribute on the icon to change icon to filled variant on hover
    e.target
      .querySelector<HTMLElement>('m3e-icon')
      ?.setAttribute('filled', '1');
  }

  #handleMouseleave(e: TypedEvent<MouseEvent, HTMLElement>) {
    // Remove the "filled" attribute from the icon to change it
    // back to the default variant (outline)
    e.target.querySelector<HTMLElement>('m3e-icon')?.removeAttribute('filled');
  }
}
