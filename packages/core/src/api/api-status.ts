export const ApiStatus = {
  ok: 200,
  badRequest: 400,
  unauthorized: 401,
  notFound: 404,
} as const;

export type ApiStatus = (typeof ApiStatus)[keyof typeof ApiStatus];
