import { LitElement, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import styles from './index.css?inline';
import './layout/header.js';
import { UIRouterLit } from 'lit-ui-router';
import { pushStateLocationPlugin } from '@uirouter/core';
import routes from './routes';

@customElement('app-index')
export class Index extends LitElement {
  static override styles = [unsafeCSS(styles)];

  #router = new UIRouterLit();

  connectedCallback() {
    super.connectedCallback();

    this.#router.plugin(pushStateLocationPlugin);
    routes.forEach(route => this.#router.stateRegistry.register(route));
    this.#router.urlService.rules.initial({ state: 'home' });
    this.#router.transitionService.onBefore({ to: '*' }, trans => {
      console.log(trans.to());
      return true;
    });

    this.#router.start();
  }

  render() {
    return html`
      <ui-router .uiRouter=${this.#router}>
        <app-header></app-header>
        <main>
          <ui-view></ui-view>
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
