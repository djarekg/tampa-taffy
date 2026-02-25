import { IS_PROD } from '#app/config.ts';
import { getCorsHeaders } from '#app/utils/cors.ts';
import { ApiError } from '@tt/core/api';

const isApiError = (err: unknown): err is ApiError => err instanceof ApiError;

const toMessage = (err: unknown) => {
  if (err instanceof Error) {
    return err.message;
  }

  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
};

/**
 * Handle errors and return appropriate Response
 */
export const handleError = (error: unknown, request: Request): Response => {
  const url = new URL(request.url);
  const { method, pathname } = {
    method: request.method,
    pathname: url.pathname,
  };
  const corsHeaders = getCorsHeaders();

  if (isApiError(error)) {
    console.error(
      `[api] ${method} ${pathname} -> ${error.status} (${error.message})`,
      error,
    );
    return new Response(
      JSON.stringify({ error: error.message, data: error.data }),
      {
        status: error.status,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      },
    );
  }

  console.error(`[api] ${method} ${pathname} -> 500`, error);
  return new Response(
    JSON.stringify({
      error: IS_PROD ? 'Internal Server Error' : toMessage(error),
    }),
    {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    },
  );
};
