import type { UserModel } from '@tt/db';

import { client } from '@/core/api/client';

/**
 * Get a single user by ID.
 *
 * @param id - The ID of the user to retrieve.
 * @returns A promise that resolves to the user data.
 */
export const getUser = async (id: string) => {
  const { get } = client;
  return get<UserModel>(`/users/${id}`);
};

/**
 * Get all users.
 *
 * @returns A promise that resolves to an array of user data.
 */
export const getUsers = async () => {
  const { get } = client;
  return get<UserModel[]>('/users');
};

/**
 * Update a user's active status.
 *
 * @param id - The ID of the user to update.
 * @param isActive - The new active status.
 * @returns A promise that resolves to the updated user data.
 */
export const updateUserActive = async (id: string, isActive: boolean) => {
  const { post } = client;
  return post<UserModel>(`/users/${id}/active`, { isActive });
};
