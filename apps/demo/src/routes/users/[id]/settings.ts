import type { UIRouterLit } from 'lit-ui-router';

import { html, signal, SignalWatcher } from '@lit-labs/signals';
import { consume } from '@lit/context';
import { safeDefine } from '@tt/core/utils';
import { LitElement } from 'lit';

import { routerContext } from '@/router';

/**
 * UserSettings component that displays user-specific settings based on the user ID.
 */
export class UserSettings extends SignalWatcher(LitElement) {
  #userId = signal('');

  @consume({ context: routerContext, subscribe: true })
  private readonly _router!: UIRouterLit;

  override connectedCallback() {
    super.connectedCallback();

    // Get the user ID from the route parameters.
    this.#userId.set(this._router.globals.params?.id);
  }

  override render() {
    return html`
      <h1>User Settings</h1>
      <div>${this.#userId.get()}</div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-user-settings': UserSettings;
  }
}

safeDefine('app-user-settings', UserSettings);
