import prisma from '@tt/db/client';
import { ApiError, ApiStatus } from '@tt/core/api';
import type { AuiContext } from '#app/types/index.ts';
import { tryRouteParam } from '#app/http/require.ts';

/**
 * Get a single user by ID.
 */
export const getUser = async (ctx: AuiContext<{ id: string }>) => {
  const id = tryRouteParam(ctx, 'id');

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new ApiError(ApiStatus.notFound, 'User not found', { id });
  }

  ctx.body = user;
};

/**
 * Get all users.
 */
export const getUsers = async (ctx: AuiContext) => {
  const users = await prisma.user.findMany();
  ctx.body = users;
};
