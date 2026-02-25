import { pushStateLocationPlugin } from '@uirouter/core';
import { UIRouterLit } from 'lit-ui-router';

import { isAuthenticated } from '@/core/api/auth.api';

import routes, { type StateDataType } from './routes';

/**
 * Creates and configures a new UIRouter instance.
 */
export const router = () => {
  const router = new UIRouterLit();
  routes.forEach(route => router.stateRegistry.register(route));
  router.plugin(pushStateLocationPlugin);
  router.urlService.rules.initial({ state: 'home' });

  // Add a global "onBefore" transition hook to check authentication
  router.transitionService.onBefore({ to: '*' }, async trans => {
    try {
      const authenticated = await isAuthenticated();
      const { requireAuth } = trans.to().data as StateDataType;

      if (!requireAuth || authenticated) {
        return true;
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
    }

    return trans.router.stateService.target('signin');
  });

  router.start();

  return router;
};
