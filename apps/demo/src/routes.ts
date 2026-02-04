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
  {
    name: 'users',
    url: '/users',
    component: () => {
      import('./routes/users/users.ts');
      return html`
        <app-users></app-users>
      `;
    },
  },
  {
    name: 'products',
    url: '/products',
    component: () => {
      import('./routes/products/products.ts');
      return html`
        <app-products></app-products>
      `;
    },
  },
];

export default routes;
