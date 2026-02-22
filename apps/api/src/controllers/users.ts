import prisma from '#app/db.ts';
import { ApiError, ApiStatus } from '@tt/core/api';

/**
 * Get a single user by ID.
 *
 */
export const getUser = async (request: Request, params: { id: string }) => {
  const { id } = params;

  if (!id) {
    throw new ApiError(ApiStatus.badRequest, 'User ID is required');
  }

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new ApiError(ApiStatus.notFound, 'User not found', { id });
  }

  return Response.json(user);
};

/**
 * Get all users.
 */
export const getUsers = async ()  => {
  const users = await prisma.user.findMany();
  return Response.json(users);
};
