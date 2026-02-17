import * as authApi from '@/api/auth.api';
import { signal } from '@lit-labs/signals';
import { createContext } from '@lit/context';

export const authenticatedContext = createContext<boolean>(Symbol('authenticated'));

/**
 * Signal to track the current user's authentication state.
 */
export const authenticated = signal(await authApi.isAuthenticated());

/**
 * Updates the authenticated state signal.
 * Call this after signin/signout operations to notify all subscribers.
 */
export const setAuthenticated = (value: boolean) => {
  authenticated.set(value);
};

/**
 * Sign in the user and update the authenticated state.
 * This is a wrapper around the API call that automatically updates the auth state.
 */
export const signin = async (email: string, password: string) => {
  const success = await authApi.signin(email, password);
  setAuthenticated(success);
  return success;
};

/**
 * Sign out the user and update the authenticated state.
 * This is a wrapper around the API call that automatically updates the auth state.
 */
export const signout = async () => {
  await authApi.signout();
  setAuthenticated(false);
};
