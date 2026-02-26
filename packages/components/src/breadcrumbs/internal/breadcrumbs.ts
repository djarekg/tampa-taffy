import '@m3e/web/icon';
import '../../list';

import { isBrowser, property } from '@tt/core';
import { html, LitElement, nothing } from 'lit';
import type { UIRouterLit } from 'lit-ui-router';
import { cache } from 'lit/directives/cache.js';
import { repeat } from 'lit/directives/repeat.js';

export class Breadcrumbs extends LitElement {
  /**
   * The router instance is used to listen for route changes and
   * update the breadcrumbs accordingly.
   *
   * @default null
   */
  router = property<UIRouterLit | null>(null);

  override connectedCallback() {
    super.connectedCallback();
    this.router?.locationService.onChange(() => this.requestUpdate());
  }

  override render() {
    const paths = this.#getCurrentPath();

    return html`
      <tt-list
        role="navigation"
        aria-label="Breadcrumbs"
        alignment="horizontal">
        ${repeat(
          paths,
          path => path,
          (_, index) => cache(this.#renderLink(paths, index)),
        )}
      </tt-list>
    `;
  }

  #renderLink(paths: string[], index: number) {
    // combine split paths to create the href for each breadcrumb link
    const href = `/${paths.slice(0, index + 1).join('/')}`;

    // add a separator before all links except the first one
    const separator =
      index > 0
        ? html`
            <span style="align-self: center">/</span>
          `
        : nothing;

    return html`
      ${separator}
      <tt-list-item-link
        href=${href}
        headline=${paths[index]}
        indicator="underline"></tt-list-item-link>
    `;
  }

  #getCurrentPath() {
    // oxlint-disable-next-line typescript/no-unnecessary-condition: isServer will be true in server environments
    if (isBrowser) {
      const path = window.location.pathname;
      return path === '/' ? [] : path.split('/').filter(Boolean);
    }

    return [];
  }
}
