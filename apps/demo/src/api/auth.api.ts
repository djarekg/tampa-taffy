import { client } from './client';

/**
 * Check if the user is authenticated by verifying their JWT.
 */
export const isAuthenticated = () => {
  const { get } = client;
  return get<boolean>('/auth/authenticated');
};
