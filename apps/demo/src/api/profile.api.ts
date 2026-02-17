import { getCookie, setCookie } from '@/utils/cookie.ts';

const USER_ID_COOKIE = 'userId';
const USER_ROLE_COOKIE = 'role';
const USER_TOKEN_COOKIE = 'token';

/**
 * Store the current user's ID in a cookie for client and server-side access.
 */
export const setUserId = (userId: string | null) => {
  setCookie(USER_ID_COOKIE, userId);
};

/**
 * Get the authenticated user's ID.
 */
export const getUserId = (): string | null => {
  return getCookie(USER_ID_COOKIE);
};

/**
 * Store the current user's role in a cookie for client and server-side access.
 */
export const setUserRole = (role: string | null) => {
  setCookie(USER_ROLE_COOKIE, role);
};

/**
 * Get the authenticated user's role.
 */
export const getUserRole = (): string | null => {
  return getCookie(USER_ROLE_COOKIE);
};

/**
 * Store the authenticated user's token in a cookie for client and server-side access.
 */
export const setUserToken = (token: string | null) => {
  setCookie(USER_TOKEN_COOKIE, token);
};

/**
 * Get the authenticated user's token.
 */
export const getUserToken = (): string | null => {
  return getCookie(USER_TOKEN_COOKIE);
};
