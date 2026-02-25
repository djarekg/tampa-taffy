import { isEmpty } from '@tt/core';

/**
 * Set a cookie with the specified name, value, and options.
 * If the value is empty, the cookie will be deleted.
 *
 * @param name - The name of the cookie.
 * @param value - The value of the cookie.
 * @param days - The number of days until the cookie expires (default: 7).
 */
export const setCookie = (name: string, value: string | null, days: number = 7): void => {
  if (isEmpty(value)) {
    deleteCookie(name);
    return;
  }

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  const expiresStr = `expires=${expires.toUTCString()}`;
  document.cookie = `${name}=${encodeURIComponent(value)};${expiresStr};path=/;SameSite=Strict`;
};

/**
 * Get a cookie value by name.
 *
 * @param name - The name of the cookie to retrieve.
 * @returns The cookie value, or null if not found.
 */
export const getCookie = (name: string): string | null => {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(nameEQ)) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }

  return null;
};

/**
 * Delete a cookie by name.
 *
 * @param name - The name of the cookie to delete.
 */
export const deleteCookie = (name: string): void => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};
