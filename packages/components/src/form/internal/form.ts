import { queryAssignedElements } from '@tt/core/reactive';
import { html, LitElement } from 'lit';
// import { queryAssignedElements } from 'lit/decorators.js';

export class Form extends LitElement {
  // readonly #formControls = new Array<HTMLElement>();

  private readonly _formControls = queryAssignedElements<HTMLElement>({
    selector: 'tt-card',
    flatten: true,
  });

  // @queryAssignedElements({ selector: 'tt-card', flatten: true })
  // private readonly _formControls!: HTMLElement[];

  constructor() {
    super();
    console.log(
      'Form.constructor --> Form controls (pre-init sentinel expected):',
      this._formControls,
    );
  }

  override connectedCallback() {
    super.connectedCallback();
    console.log(
      'Form.connectedCallback --> Form controls (before first render):',
      this._formControls,
    );
  }

  override firstUpdated() {
    console.log('Form.firstUpdated --> Form controls:', this._formControls);
  }

  override render() {
    return html`
      <form>
        <slot @slotchange=${this.#handleSlotChange}></slot>
      </form>
    `;
  }

  #handleSlotChange() {
    console.log(
      'Form.#handleSlotChange --> Form controls:',
      this._formControls,
    );
  }
}
