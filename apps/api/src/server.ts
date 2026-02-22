import { IS_DEV, PORT } from '#app/config.ts';
import { authRoutes } from '#app/routes/auth.ts';
import { userRoutes } from '#app/routes/user.ts';
import { createCorsPreflightResponse, getCorsHeaders } from './utils/cors.ts';

export const server = Bun.serve({
  port: PORT,
  development: IS_DEV,
  routes: {
    ...authRoutes,
    ...userRoutes,
  },
  async fetch(request: Request) {
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
