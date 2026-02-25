import { getUser, getUsers } from '#app/controllers/users.ts';
import { withCors } from '#app/middleware/with-cors.ts';

/**
 * Defining user-related routes for the API.
 */
export const userRoutes = {
  '/users': withCors(async () => getUsers()),
  '/users/:id': withCors(async req => getUser(req)),
};
