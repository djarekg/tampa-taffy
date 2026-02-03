import { ApiError } from '@tt/core/api';
import type { Middleware } from 'koa';
import { IS_PROD } from '#app/config.ts';

const isApiError = (err: unknown): err is ApiError => err instanceof ApiError;

const toMessage = (err: unknown) => {
  if (err instanceof Error) {
    return err.message;
  }

  try {
    return JSON.stringify(err);
  } catch {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    return String(err);
  }
};

export const errorHandler: Middleware = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    const { method, path } = ctx;

    if (isApiError(err)) {
      ctx.status = err.status;
      ctx.body = { error: err.message, data: err.data };
      console.error(`[api] ${method} ${path} -> ${err.status} (${err.message})`, err);
      return;
    }

    ctx.status = 500;
    ctx.body = {
      error: IS_PROD ? 'Internal Server Error' : toMessage(err),
    };

    console.error(`[api] ${method} ${path} -> 500`, err);
  }
};
