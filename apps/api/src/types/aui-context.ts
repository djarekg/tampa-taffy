import type { Context, Request } from 'koa';

export type AuiContext<T = object> = {
  params: T;
  request: Request & { body: T };
} & Context;
