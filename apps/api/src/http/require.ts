import { ApiError, ApiStatus } from '@tt/core/api';
import type { Context } from 'koa';

/**
 * Try to get a route parameter and return it as a string. If missing, throw an error.
 *
 * @param {Context} ctx Koa context.
 * @param {string} name Name of the route parameter.
 * @returns {string} The route parameter value.
 * @throws {ApiError} If the route parameter is missing or not a string.
 */
export const tryRouteParam = (ctx: Context, name: string): string => {
  const value = (ctx as unknown as { params?: Record<string, unknown> }).params?.[name];

  if (typeof value !== 'string' || value.length === 0) {
    throw new ApiError(ApiStatus.badRequest, `Missing route param: ${name}`);
  }

  return value;
};

/**
 * Try to get a body field and return it as a string. If missing, throw an error.
 *
 * @param {Context} ctx Koa context.
 * @param {string} name Name of the body field.
 * @returns {string} The body field value.
 * @throws {ApiError} If the body field is missing or not a string.
 */
export const tryBodyString = (ctx: Context, name: string): string => {
  const body = (ctx.request as unknown as { body?: Record<string, unknown> }).body;
  const value = body?.[name];

  if (typeof value !== 'string' || value.length === 0) {
    throw new ApiError(ApiStatus.badRequest, `Missing body field: ${name}`);
  }

  return value;
};
