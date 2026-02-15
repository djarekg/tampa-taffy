import { client } from './client';

/**
 * Authenticate the user by sending their email and password to the server.
 * The server will respond with a JWT if the credentials are valid.
 *
 * The JWT is stored in an HttpOnly cookie, so it cannot be accessed by
 * JavaScript. This provides protection against XSS attacks.
 *
 * @param email The user's email address.
 * @param password The user's password.
 * @returns A promise that resolves to the JWT string if authentication
 * is successful, or an error if it fails.
 */
export const signin = (email: string, password: string) => {
  const { post } = client;
  return post<string>('/auth/signin', { email, password });
};

/**
 * Sign out the user by clearing the JWT cookie on the server.
 *
 * @returns A promise that resolves when the sign-out process is complete.
 */
export const signout = () => {
  const { post } = client;
  return post<void>('/auth/signout');
};

/**
 * Check if the user is authenticated by verifying their JWT.
 *
 * @returns A promise that resolves to a boolean indicating
 * whether the user is authenticated.
 */
export const isAuthenticated = () => {
  const { get } = client;
  return get<boolean>('/auth/authenticated');
};
