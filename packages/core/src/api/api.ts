import { ApiError } from './api-error.ts';
import type { PlainObject } from '../types/plain-object.ts';

export type ApiOptions = {
  /**
   * Optional headers to include with the request.
   * Keys are header names and values are header values, e.g. { 'Authorization': 'Bearer ...' }.
   * If you set 'Content-Type' to undefined explicitly the implementation will remove the default.
   */
  headers?: Record<string, string>;
  /**
   * Optional query parameters to append to the URL.
   * Keys with `undefined` or `null` values are omitted from the query string.
   * Example: { page: 2, q: 'search' } -> ?page=2&q=search
   */
  query?: PlainObject;
  /**
   * Optional AbortSignal to cancel the request.
   * Pass an AbortController.signal to abort fetch requests and to stop retries while waiting.
   */
  signal?: AbortSignal;
  /**
   * Number of retry attempts to perform when a connection-refused/network error occurs.
   * Only used for errors that look like "connection refused" (ERR_CONNECTION_REFUSED / ECONNREFUSED / Failed to fetch).
   * Defaults to 3.
   */
  retry?: number;
};

/**
 * Convert object query parameters to query string.
 */
const buildQueryString = (query?: PlainObject) => {
  if (!query) {
    return '';
  }

  const pairs: string[] = [];

  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null) {
      continue;
    }
    pairs.push(encodeURIComponent(k) + '=' + encodeURIComponent(String(v)));
  }

  return pairs.length ? `?${pairs.join('&')}` : '';
};

/**
 * JSON reviver function for handling DTO during JSON.parse.
 */
const jsonReviver = (_key: string, value: string) => {
  // Test for date format and convert to Date type
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
    return new Date(value);
  }

  return value;
};

/**
 * Attempt to parse response as JSON, otherwise return text.
 */
const safeParseResponse = async (res: Response): Promise<unknown> => {
  const text = await res.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text, jsonReviver);
  } catch {
    return text;
  }
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Heuristic to determine if an error represents a connection-refused / network-level failure.
 * Covers Node-style error codes (ERR_CONNECTION_REFUSED, ECONNREFUSED) and common browser messages ("Failed to fetch").
 */
const isConnectionRefusedError = (err: unknown): boolean => {
  if (!err) {
    return false;
  }
  const anyErr = err as { code: string; message: string };

  if (typeof anyErr === 'object' && anyErr !== null) {
    // Node.js style error code
    if (typeof anyErr.code === 'string') {
      if (/^(ERR_CONNECTION_REFUSED|ECONNREFUSED)$/i.test(anyErr.code)) {
        return true;
      }
    }
    // Some libraries or environments include errno or message
    if (typeof anyErr.message === 'string') {
      if (/(ERR_CONNECTION_REFUSED|ECONNREFUSED|Failed to fetch)/i.test(anyErr.message)) {
        return true;
      }
    }
  }

  // Fallback to string inspection
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  const s = String(err);
  if (/(ERR_CONNECTION_REFUSED|ECONNREFUSED|Failed to fetch)/i.test(s)) {
    return true;
  }

  return false;
};

export default function api(baseUrl?: string) {
  // Libraries generally shouldn't read build-tool-specific env (e.g. Vite's import.meta.env).
  // Let the consuming app pass it in: api(import.meta.env.VITE_API_URL)
  if (!baseUrl) {
    throw new Error(
      'API baseUrl not provided. Pass it from the consuming app, e.g. api(import.meta.env.VITE_API_URL).'
    );
  }

  const request = async <T = unknown>(
    method: string,
    path: string,
    body?: unknown,
    options: ApiOptions = {}
    // eslint-disable-next-line complexity
  ): Promise<T> => {
    const url = `${baseUrl}${path}${buildQueryString(options.query)}`;
    const headers: Record<string, string> = {
      // default to JSON; callers can override
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    };

    // If caller explicitly set Content-Type to undefined, remove it
    if (options.headers && options.headers['Content-Type'] === undefined) {
      delete headers['Content-Type'];
    }

    const fetchOptionsBase: RequestInit = {
      method,
      headers,
      signal: options.signal,
    };

    if (body !== undefined && body !== null) {
      // Only attach body for methods that allow it
      if (method !== 'GET' && method !== 'HEAD') {
        // If Content-Type is JSON (default), stringify. Otherwise allow raw body.
        const ct = headers['Content-Type'] || '';
        if (ct.includes('application/json')) {
          fetchOptionsBase.body = JSON.stringify(body);
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          fetchOptionsBase.body = body as any;
        }
      }
    }

    const maxRetries =
      typeof options.retry === 'number' && options.retry >= 0 ? Math.floor(options.retry) : 3;
    let attempt = 0;

    // Attempt loop: only retry on connection-refused style network errors
    while (true) {
      attempt++;
      // respect abort signal before each attempt
      if (options.signal?.aborted) {
        // Let fetch produce the abort error, but here we throw an AbortError to be explicit
        throw new DOMException('Aborted', 'AbortError');
      }

      try {
        // Clone fetch options per attempt (to avoid reusing mutated objects)
        const fetchOptions: RequestInit = { ...fetchOptionsBase };
        const res = await fetch(url, fetchOptions);

        const parsed = await safeParseResponse(res);

        if (!res.ok) {
          throw new ApiError(res.status, res.statusText || 'HTTP Error', parsed);
        }

        return parsed as T;
      } catch (err: unknown) {
        // If the error is a connection-refused type and we have retry budget, retry.
        const shouldRetry = isConnectionRefusedError(err) && attempt <= maxRetries;

        if (!shouldRetry) {
          // No retry: rethrow the error
          throw err;
        }

        // Retry: wait a short backoff before retrying. Respect abort signal while waiting.
        const backoffMs = 3000 * Math.pow(2, attempt - 1); // 100, 200, 400, ...

        // Wait but bail early if aborted during wait
        await Promise.race([
          sleep(backoffMs),
          new Promise((_r, reject) => {
            const sig = options.signal;
            if (!sig) {
              return;
            }
            if (sig.aborted) {
              reject(new DOMException('Aborted', 'AbortError'));
            }
            const onAbort = () => {
              reject(new DOMException('Aborted', 'AbortError'));
              sig.removeEventListener('abort', onAbort);
            };
            sig.addEventListener('abort', onAbort);
          }),
        ]);

        console.log(`fetch attempt (${attempt}) ${url}`);

        // loop to retry
        continue;
      }
    }
  };

  const get = <T = unknown>(path: string, options?: ApiOptions) =>
    request<T>('GET', path, undefined, options);

  const put = <T = unknown>(path: string, body?: unknown, options?: ApiOptions) =>
    request<T>('PUT', path, body, options);

  const post = <T = unknown>(path: string, body?: unknown, options?: ApiOptions) =>
    request<T>('POST', path, body, options);

  const del = <T = unknown>(path: string, options?: ApiOptions) =>
    request<T>('DELETE', path, undefined, options);

  return {
    get,
    put,
    post,
    del,
  } as const;
}
