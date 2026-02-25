import { isAuthenticated, signin, signout } from '#app/controllers/auth.ts';
import { withCors } from '#app/middleware/with-cors.ts';

/**
 * Defining auth-related routes for the API.
 */
export const authRoutes = {
  '/auth/signin': withCors(async req => signin(req)),
  '/auth/signout': withCors(async () => signout()),
  '/auth/authenticated': withCors(async req => isAuthenticated(req)),
};
