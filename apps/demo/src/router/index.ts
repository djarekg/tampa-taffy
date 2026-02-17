import { createContext } from '@lit/context';
import type { UIRouterLit } from 'lit-ui-router';

export * from './router';

/**
 * Context for the router instance, allowing components to access the router via context.
 */
export const routerContext = createContext<UIRouterLit>(Symbol('router'));
