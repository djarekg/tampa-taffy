import '@tt/components/navigation-drawer';
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { UIRouterLit } from 'lit-ui-router';
import { pushStateLocationPlugin } from '@uirouter/core';

import './layout/header.ts';
import styles from './index.css.ts';
import routes from './routes';

@customElement('app-index')
export class Index extends LitElement {
  static override styles = [styles];

  #router = new UIRouterLit();

  constructor() {
    super();

    routes.forEach(route => this.#router.stateRegistry.register(route));
    this.#router.plugin(pushStateLocationPlugin);
    this.#router.urlService.rules.initial({ state: 'home' });
    // this.#router.transitionService.onBefore({ to: '*' }, trans => {
    //   console.log(trans.to());
    //   return true;
    // });
  }

  connectedCallback() {
    super.connectedCallback();

    this.#router.start();
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.#router.dispose();
  }

  render() {
    return html`
      <ui-router .uiRouter=${this.#router}>
        <app-header></app-header>
        <main>
          <ui-view></ui-view>
          <tt-navigation-drawer ?opened=${false}></tt-navigation-drawer>
        </main>
      </ui-router>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-index': Index;
  }
}
