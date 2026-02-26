import type { M3eSelectElement } from '@m3e/web/select';

import { property, query } from '@tt/core';
import { safeDefine } from '@tt/core/utils';
import { html, LitElement } from 'lit';
import { map } from 'lit/directives/map.js';

import { getGenders } from '@/core/api/demographic.api';

export class GenderSelect extends LitElement {
  #genders = getGenders();

  private _select = query<M3eSelectElement>('m3e-select');

  /***
   * The selected gender.
   */
  value = property('');

  override render() {
    return html`
      <m3e-form-field variant="outlined">
        <label slot="label" for="select">Gender</label>
        <m3e-select id="select" @change=${() => this.#handleSelectChange()}>
          ${map(this.#genders, gender => html`<m3e-option .selected=${this.value === gender}>${gender}</m3e-option>`)}
        </m3e-select>
      </m3e-form-field>
    `;
  }

  #handleSelectChange() {
    this.dispatchEvent(
      new CustomEvent('change', { detail: this._select?.value }),
    );
  }
}

safeDefine('app-gender-select', GenderSelect);
