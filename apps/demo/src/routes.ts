import type { LitStateDeclaration } from 'lit-ui-router';
import { html } from 'lit';

const routes: LitStateDeclaration[] = [
  {
    name: 'home',
    url: '/',
    component: () => {
      import('./routes/home.ts');
      return html`
        <app-home></app-home>
      `;
    },
  },
];

export default routes;
