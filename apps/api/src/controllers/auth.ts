import { TOKEN_SECRET } from '#app/config.ts';
import prisma from '#app/db.ts';
import { getBody } from '#app/utils/json.ts';
import { isEmpty, isNotEmpty } from '@tt/core';
import { ApiError, ApiStatus } from '@tt/core/api';
import { compareHash } from '@tt/core/crypto';
import { Role } from '@tt/db';
import jwt from 'jsonwebtoken';

/**
 * Sign in a user and return a JWT if successful.
 */
export const signin = async (request: Request): Promise<Response> => {
  const body = await getBody<{ email: string; password: string }>(request);
  const { email, password } = body;

  if (isEmpty(email) || isEmpty(password)) {
    throw new ApiError(ApiStatus.badRequest, 'Email and password are required');
  }

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
    return Response.json({ success: false });
  }

  // Credentials are valid, so return a JWT
  const token = jwt.sign({ username: email }, TOKEN_SECRET, {
    expiresIn: '1h',
  });

  return Response.json({
    success: true,
    userId: user.id,
    role: user.userCredential?.role ?? Role.USER,
    token,
  });
};

/**
 * Sign out a user by expiring their JWT.
 */
export const signout = (request: Request): Response => {
  // Note: In a real implementation, you might want to add the token to a blacklist
  // For now, we just acknowledge the signout
  return Response.json({ success: true });
};

/**
 * Check if the user is authenticated by verifying their JWT.
 */
export const isAuthenticated = (request: Request): Response => {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1] ?? '';

  if (isNotEmpty(token)) {
    try {
      const authenticated = !!jwt.verify(token, TOKEN_SECRET);
      return Response.json(authenticated);
    } catch (error) {
      console.error('Token verification failed', error);
    }
  }

  return Response.json(false);
};
