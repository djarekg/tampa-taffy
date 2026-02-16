import { createCorsPreflightResponse } from '#app/utils/cors.ts';
import { executeHandler } from '#app/utils/handler.ts';

/**
 * Middleware that handles CORS protocol and delegates to handler execution
 *
 * This middleware is used to wrap route handlers to ensure that CORS headers
 * are included in all responses and that preflight requests are handled correctly.
 * It also integrates with the error handling middleware to ensure that errors are
 * properly formatted and include CORS headers.
 *
 * @param handler - The route handler to execute after processing CORS
 */
export const withCors = (handler: (request: Request, context: any) => Promise<Response>) => {
  return async (request: Request, context: any): Promise<Response> => {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return createCorsPreflightResponse();
    }

    return executeHandler(handler, request, context);
  };
};
