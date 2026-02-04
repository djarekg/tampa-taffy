import { ApiError } from './error.ts';
import type { PlainObject } from '@/types/plain-object.ts';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD';

type ApiOptions = {
  /**
   * Optional headers to include with the request.
   * Keys are header names and values are header values, e.g. { 'Authorization': 'Bearer ...' }.
   * If you set 'Content-Type' to undefined explicitly the implementation will remove the default.
   */
  headers?: Record<string, string | undefined>;
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

const DEFAULT_RETRY_ATTEMPTS = 3;
const RETRY_BACKOFF_BASE_MS = 3000;

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

const buildUrl = (baseUrl: string, path: string, query?: PlainObject) =>
  `${baseUrl}${path}${buildQueryString(query)}`;

const normalizeRetryAttempts = (retry?: number) =>
  typeof retry === 'number' && retry >= 0 ? Math.floor(retry) : DEFAULT_RETRY_ATTEMPTS;

const createAbortError = () => {
  // DOMException exists in browsers and Bun; provide a fallback for other runtimes.
  const DOMExceptionCtor = (globalThis as any).DOMException as
    | (new (message?: string, name?: string) => Error)
    | undefined;
  return DOMExceptionCtor ? new DOMExceptionCtor('Aborted', 'AbortError') : new Error('Aborted');
};

const throwIfAborted = (signal?: AbortSignal) => {
  if (signal?.aborted) {
    throw createAbortError();
  }
};

/**
 * JSON reviver function for handling DTO during JSON.parse.
 */
const jsonReviver = (_key: string, value: unknown) => {
  // Test for date format and convert to Date type
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) {
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

const sleepWithAbort = async (ms: number, signal?: AbortSignal) => {
  if (!signal) {
    await sleep(ms);
    return;
  }

  throwIfAborted(signal);

  let onAbort: (() => void) | undefined;

  try {
    await Promise.race([
      sleep(ms),
      new Promise<never>((_resolve, reject) => {
        onAbort = () => reject(createAbortError());
        signal.addEventListener('abort', onAbort);
      }),
    ]);
  } finally {
    if (onAbort) {
      signal.removeEventListener('abort', onAbort);
    }
  }
};

/**
 * Heuristic to determine if an error represents a connection-refused / network-level failure.
 * Covers Node-style error codes (ERR_CONNECTION_REFUSED, ECONNREFUSED) and common browser messages ("Failed to fetch").
 */
const isConnectionRefusedError = (err: unknown): boolean => {
  if (!err) {
    return false;
  }
  const anyErr = err as { code?: unknown; message?: unknown };

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

const buildHeaders = (headers?: ApiOptions['headers']) => {
  const merged: Record<string, string> = {
    // default to JSON; callers can override
    'Content-Type': 'application/json',
  };

  if (headers) {
    for (const [key, value] of Object.entries(headers)) {
      if (value === undefined) {
        continue;
      }
      merged[key] = value;
    }

    // If caller explicitly set Content-Type to undefined, remove it
    if (headers['Content-Type'] === undefined) {
      delete merged['Content-Type'];
    }
  }

  return merged;
};

const canHaveBody = (method: HttpMethod) => method !== 'GET' && method !== 'HEAD';

const resolveRequestBody = (
  method: HttpMethod,
  headers: Record<string, string>,
  body?: unknown
) => {
  if (!canHaveBody(method)) {
    return undefined;
  }
  if (body === undefined || body === null) {
    return undefined;
  }

  const contentType = headers['Content-Type'] ?? '';
  if (contentType.includes('application/json')) {
    return JSON.stringify(body);
  }

  // Non-JSON body; caller is responsible for passing a supported BodyInit.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return body as any;
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
    method: HttpMethod,
    path: string,
    body?: unknown,
    options: ApiOptions = {}
  ): Promise<T> => {
    const url = buildUrl(baseUrl, path, options.query);
    const headers = buildHeaders(options.headers);
    const maxRetryAttempts = normalizeRetryAttempts(options.retry);
    const fetchOptionsBase: RequestInit = { method, headers, signal: options.signal };

    const requestBody = resolveRequestBody(method, headers, body);
    if (requestBody !== undefined) {
      fetchOptionsBase.body = requestBody;
    }

    // Attempt loop: only retry on connection-refused style network errors.
    for (let attempt = 1; ; attempt++) {
      throwIfAborted(options.signal);
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
        const shouldRetry = isConnectionRefusedError(err) && attempt <= maxRetryAttempts;

        if (!shouldRetry) {
          // No retry: rethrow the error
          throw err;
        }

        // Retry: wait a short backoff before retrying. Respect abort signal while waiting.
        const backoffMs = RETRY_BACKOFF_BASE_MS * Math.pow(2, attempt - 1); // 3000, 6000, 12000, ...
        await sleepWithAbort(backoffMs, options.signal);

        console.log(`fetch attempt (${attempt}) ${url}`);
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
