import { handleError } from '#app/middleware/error-handler.ts';
import { getCorsHeaders } from './cors';

/**
 * Executes a handler and processes the result with CORS headers
 *
 * @description This function is responsible for executing the provided handler function,
 * catching any errors that may occur during execution, and ensuring that the
 * response includes the necessary CORS headers. It also integrates with the
 * error handling middleware to ensure that errors are properly formatted and
 * include CORS headers.
 *
 * @param handler - The route handler to execute
 * @param request - The incoming request object
 * @param context - The context object containing route parameters and other data
 */
export const executeHandler = async (
  handler: (request: Request, context: any) => Promise<Response>,
  request: Request,
  context: any
): Promise<Response> => {
  try {
    const response = await handler(request, context);

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
  } catch (error) {
    return handleError(error, request);
  }
};
