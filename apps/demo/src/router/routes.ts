import type { LitStateDeclaration } from 'lit-ui-router';
import { html } from 'lit';

export type StateDataType = {
  requireAuth?: boolean;
};

const routes: LitStateDeclaration[] = [
  {
    name: 'signin',
    url: '/signin',
    data: {
      requireAuth: false,
    },
    component: () => {
      import('@/routes/(unprotected)/signin/signin.ts');
      return html`
        <app-signin></app-signin>
      `;
    },
  },
  {
    name: 'home',
    url: '/',
    data: {
      requireAuth: true,
    },
    component: () => {
      import('@/routes/home.ts');
      return html`
        <app-home></app-home>
      `;
    },
  },
  {
    name: 'users',
    url: '/users',
    data: {
      requireAuth: true,
    },
    component: () => {
      import('@/routes/users/users.ts');
      return html`
        <app-users></app-users>
      `;
    },
  },
  {
    name: 'products',
    url: '/products',
    data: {
      requireAuth: true,
    },
    component: () => {
      import('@/routes/products/products.ts');
      return html`
        <app-products></app-products>
      `;
    },
  },
];

export default routes;
