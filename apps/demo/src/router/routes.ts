import type { LitStateDeclaration } from 'lit-ui-router';

import { html } from 'lit';

import { getUserId } from '@/core/api/profile.api';

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
      // oxlint-disable-next-line typescript/no-floating-promises
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
      // oxlint-disable-next-line typescript/no-floating-promises
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
      // oxlint-disable-next-line typescript/no-floating-promises
      import('@/routes/users/users.ts');
      return html`
        <app-users></app-users>
      `;
    },
  },
  {
    name: 'user',
    url: '/users/:id',
    data: {
      requireAuth: true,
    },
    component: () => {
      // oxlint-disable-next-line typescript/no-floating-promises
      import('@/routes/users/[id]/user.ts');
      return html`
        <app-user></app-user>
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
      // oxlint-disable-next-line typescript/no-floating-promises
      import('@/routes/users/[id]/settings.ts');
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
      // oxlint-disable-next-line typescript/no-floating-promises
      import('@/routes/products/products.ts');
      return html`
        <app-products></app-products>
      `;
    },
  },
];

export default routes;
