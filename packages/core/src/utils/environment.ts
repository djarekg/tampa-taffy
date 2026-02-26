import { isServer } from 'lit';

/**
 * A utility that indicates whether the current environment is a browser. This is
 * useful for conditionally executing code that should only run in a browser context,
 * such as accessing `window` or `document`.
 *
 * @remarks
 * The `isBrowser` constant is derived from the `isServer` utility provided by
 * the `lit` library. It is set to `true` if the code is running in a browser
 * environment and `false` if it is running in a server environment
 * (e.g., during server-side rendering).
 */
export const isBrowser = !isServer;
