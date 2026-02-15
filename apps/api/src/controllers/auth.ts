import { TOKEN_SECRET } from '#app/config.ts';
import prisma from '#app/db.ts';
import { tryBodyString, tryRouteParam } from '#app/http/require.ts';
import type { AuiContext } from '#app/types/index.ts';
import { isNotEmpty } from '@tt/core';
import { ApiError, ApiStatus } from '@tt/core/api';
import { compareHash } from '@tt/core/crypto';
import { Role } from '@tt/db';
import jwt from 'jsonwebtoken';
import type { Context } from 'koa';

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
export const signin = async (ctx: AuiContext<{ email: string; password: string }>) => {
  const email = tryBodyString(ctx, 'email');
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
      email,
    },
  });

  if (!user) {
    throw new ApiError(ApiStatus.notFound, 'User not found');
  }

  // Validate password against stored hash
  const hashPassword = user.userCredential?.password ?? '';
  const isValid = compareHash(password, hashPassword);

  if (!isValid) {
    throw new ApiError(ApiStatus.unauthorized, 'Invalid credentials');
  }

  // Credentials are valid, so return a JWT
  jwt.sign({ username: email }, TOKEN_SECRET, {
    expiresIn: '1h',
  });

  ctx.body = { userId: user.id, role: user.userCredential?.role ?? Role.USER };
  ctx.status = ApiStatus.ok;
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
