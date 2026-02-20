/**
 * Checks if the code is currently executing in a browser environment.
 *
 * This is useful for conditional logic when preparing for Server-Side Rendering (SSR),
 * allowing you to safely access browser-only APIs like `window` or `document`.
 *
 * @returns `true` if running in a browser environment, `false` otherwise
 *
 * @example
 * ```ts
 * if (isBrowser()) {
 *   window.location.reload();
 * }
 * ```
 */
export function isBrowser(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.document !== 'undefined' &&
    typeof window.document.createElement !== 'undefined'
  );
}

/**
 * Checks if the code is currently executing in a server environment.
 *
 * This is useful for conditional logic when preparing for Server-Side Rendering (SSR),
 * allowing you to skip browser-specific code on the server.
 *
 * @returns `true` if running in a server environment, `false` otherwise
 *
 * @example
 * ```ts
 * if (isServer()) {
 *   // Use server-side alternatives
 *   console.log('Running on server');
 * }
 * ```
 */
export function isServer(): boolean {
  return !isBrowser();
}
