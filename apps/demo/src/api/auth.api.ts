import { client } from './client.ts';
import { getUserToken, setUserId, setUserRole, setUserToken } from './profile.api.ts';

type SigninResponse = {
  success: boolean;
  userId: string;
  role: string;
  token: string;
};

/**
 * Authenticate the user by sending their email and password to the server.
 * The server will respond with user profile data (userId, role, token) if the credentials are valid.
 *
 * The user data is stored in cookies for client and server-side access.
 *
 * @param email The user's email address.
 * @param password The user's password.
 * @returns A promise that resolves when authentication is successful and cookies are set.
 */
export const signin = async (email: string, password: string): Promise<boolean> => {
  const { post } = client;
  const { success, ...profile } = await post<SigninResponse>('/auth/signin', { email, password });

  // Store user profile data in cookies
  if (success) {
    setUserId(profile.userId);
    setUserRole(profile.role);
    setUserToken(profile.token);
  }

  return success;
};

/**
 * Sign out the user by clearing the user data cookies.
 *
 * @returns A promise that resolves when the sign-out process is complete.
 */
export const signout = async (): Promise<void> => {
  const { post } = client;
  await post<void>('/auth/signout');

  // Clear user profile cookies
  setUserId(null);
  setUserRole(null);
  setUserToken(null);
};

/**
 * Check if the user is authenticated by verifying their JWT.
 * Sends the token from cookies to the server for verification.
 *
 * @returns A promise that resolves to a boolean indicating
 * whether the user is authenticated.
 */
export const isAuthenticated = () => {
  const token = getUserToken();

  // If no token exists, user is not authenticated
  if (!token) {
    return Promise.resolve(false);
  }

  const { get } = client;

  return get<boolean>('/auth/authenticated', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
