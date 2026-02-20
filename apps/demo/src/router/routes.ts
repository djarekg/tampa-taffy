import { getUserId } from '@/api/profile.api';
import { html } from 'lit';
import type { LitStateDeclaration } from 'lit-ui-router';

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
    resolve: [
      {
        token: 'userId',
        policy: { when: 'LAZY' },
        resolveFn: () => getUserId(),
      },
    ],
    component: () => {
      import('@/routes/users/users.ts');
      return html`
        <app-users></app-users>
      `;
    },
  },
  {
    name: 'userSettings',
    url: '/users/:id/settings',
    data: {
      requireAuth: true,
    },
    component: () => {
      import('@/routes/users/settings.ts');
      return html`
        <app-user-settings></app-user-settings>
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
