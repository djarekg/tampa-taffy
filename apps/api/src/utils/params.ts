/**
 * Utility function to parse route parameters from a request object.
 * This is a simple helper to extract the `params` property from the request,
 * which is populated by the routing middleware.
 */
export const parseParams = <T>(request: Request): T => {
  const { params } = request as unknown as { params: T };
  return params;
};
