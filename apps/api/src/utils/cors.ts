import { CORS_ORIGIN } from '#app/config.ts';

/**
 * Returns CORS headers
 */
export const getCorsHeaders = (): Record<string, string> => {
  return {
    'Access-Control-Allow-Origin': CORS_ORIGIN ?? '*',
    'Access-Control-Allow-Methods': 'GET, PUT, DELETE, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
};

/**
 * Creates a CORS preflight response
 */
export const createCorsPreflightResponse = (): Response => {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(),
  });
};
