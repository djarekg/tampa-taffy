import { getSearchResults } from '#app/controllers/search.ts';
import { withCors } from '#app/middleware/with-cors.ts';

/**
 * Defining search-related routes for the API.
 */
export const searchRoutes = {
  '/search/:query': withCors(async req => getSearchResults(req)),
};
