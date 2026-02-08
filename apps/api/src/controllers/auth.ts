import { compareHash } from '@tt/core/crypto';
import prisma from '#app/db.ts';
import { Role } from '@tt/db';
import { TOKEN_SECRET } from '#app/config.ts';
import type { AuiContext } from '#app/types/index.ts';
import { ApiError, ApiStatus } from '@tt/core/api';
import { tryBodyString, tryRouteParam } from '#app/http/require.ts';
import jwt from 'jsonwebtoken';
import type { Context } from 'koa';
import { isNotEmpty } from '@tt/core';

/**
 * Get a single user by username (email).
 */
export const getUser = async (ctx: AuiContext<{ username: string }>) => {
  const username = tryRouteParam(ctx, 'username');

  const user = await prisma.user.findFirst({
    where: {
      email: username,
    },
  });

  if (!user) {
    throw new ApiError(ApiStatus.notFound, 'User not found', { username });
  }

  ctx.body = user;
};

/**
 * Sign in a user and return a JWT if successful.
 */
export const signin = async (ctx: AuiContext<{ username: string; password: string }>) => {
  const username = tryBodyString(ctx, 'username');
  const password = tryBodyString(ctx, 'password');
  const user = await prisma.user.findFirst({
    select: {
      id: true,
      userCredential: {
        select: {
          password: true,
          role: true,
        },
      },
    },
    where: {
      email: username,
    },
  });

  if (!user) {
    throw new ApiError(ApiStatus.notFound, 'User not found');
  }

  // Validate password against stored hash
  const hashPassword = user.userCredential?.password ?? '';
  const isValid = compareHash(password, hashPassword);

  if (isValid) {
    // Credentials are valid, so return a JWT
    jwt.sign({ username }, TOKEN_SECRET, {
      expiresIn: '1h',
    });

    ctx.body = { userId: user.id, role: user.userCredential?.role ?? Role.USER };
    return;
  }

  throw new ApiError(ApiStatus.unauthorized, 'Invalid credentials');
};

/**
 * Sign out a user by expiring their JWT.
 */
export const signout = (ctx: Context) => {
  jwt.sign({}, TOKEN_SECRET, {
    expiresIn: '1s', // Expire the token immediately
  });

  ctx.body = { success: true };
};

/**
 * Check if the user is authenticated by verifying their JWT.
 */
export const isAuthenticated = (ctx: Context) => {
  const token = ctx.headers.authorization?.split(' ')[1] ?? '';
  if (isNotEmpty(token)) {
    const authenticated = !!jwt.verify(token, TOKEN_SECRET);
    ctx.body = authenticated;
  } else {
    ctx.body = false;
  }
};
