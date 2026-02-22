import { getUser, getUsers } from '#app/controllers/users.ts';
import { withCors } from '#app/middleware/with-cors.ts';

/**
 * Defining user-related routes for the API.
 */
export const userRoutes = {
  '/users': withCors(req => getUsers()),
  '/users/:id': withCors((req, { params }) => getUser(req, { id: params.id })),
};
