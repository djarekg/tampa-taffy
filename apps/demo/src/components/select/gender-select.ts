import { safeDefine } from '@tt/core/utils';
import { html, LitElement } from 'lit';

import { getGenders } from '@/core/api/demographic.api';

export class GenderSelect extends LitElement {
  #genders = getGenders();

  override render() {
    return html`
      <m3e-form-field variant="outlined">
        <label slot="label" for="select">Gender</label>
        <m3e-select id="select">
          ${this.#genders.map(gender => html`<m3e-option>${gender}</m3e-option>`)}
        </m3e-select>
      </m3e-form-field>
    `;
  }
}

safeDefine('app-gender-select', GenderSelect);
