import { IS_DEV, PORT } from '#app/config.ts';
import { isAuthenticated, signin, signout } from '#app/controllers/auth.ts';
import { getUser, getUsers } from '#app/controllers/users.ts';
import { withCors } from './middleware/with-cors.ts';
import { createCorsPreflightResponse, getCorsHeaders } from './utils/cors.ts';

export const server = Bun.serve({
  port: PORT,
  development: IS_DEV,
  routes: {
    // Auth routes
    '/auth/signin': withCors(req => signin(req)),
    '/auth/signout': withCors(async req => signout(req)),
    '/auth/authenticated': withCors(async req => isAuthenticated(req)),

    // Users routes
    '/users': withCors(req => getUsers(req)),
    '/users/:id': withCors((req, { params }) => getUser(req, { id: params.id })),
  },
  async fetch(request: Request): Promise<Response> {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return createCorsPreflightResponse();
    }

    // If no route matched, return 404
    const response = new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });

    // Add CORS headers to response
    const headers = new Headers(response.headers);
    Object.entries(getCorsHeaders()).forEach(([key, value]) => {
      headers.set(key, value);
    });

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
});

console.log(`🚀 Server ready at: http://localhost:${PORT}`);
