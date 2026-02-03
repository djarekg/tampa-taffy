import type { UserModel } from '@tt/db';
import { client } from '@/api/client';

export const getUser = (id: string) => {
  const { get } = client;
  return get<UserModel>(`/users/${id}`);
};

export const getUsers = () => {
  const { get } = client;
  return get<UserModel[]>('/users');
};

export const updateUserActive = (id: string, isActive: boolean) => {
  const { post } = client;
  return post<UserModel>(`/users/${id}/active`, { isActive });
};
