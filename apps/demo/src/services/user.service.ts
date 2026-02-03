import api from '@tt/core/api';
import type { UserModel } from '@tt/db';

/**
 * Fetch user from API.
 *
 * @param {string} id User ID of user to fetch.
 * @returns {UserModel} User object.
 */
export const getUser = (id: string) => {
  const { get } = api();
  return get<UserModel>(`/users/${id}`);
};

/**
 * Fetch list of users from API.
 *
 * @returns {UserModel[]} Array of user objects.
 */
export const getUsers = () => {
  const { get } = api('http://localhost:4006');
  return get<UserModel[]>('/users');
};

/**
 * Update user active status.
 *
 * @param {string} id User ID of user to update.
 * @param {boolean} isActive New active status.
 * @returns {UserModel} Updated user object.
 */
export const updateUserActive = (id: string, isActive: boolean) => {
  const { post } = api();
  return post<UserModel>(`/users/${id}/active`, { isActive });
};
