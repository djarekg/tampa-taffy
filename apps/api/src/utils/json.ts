/**
 * Utility function to parse JSON body from a Request or Response object.
 *
 * @description This function attempts to parse the body of a Request or Response as JSON.
 * If the body is empty, it returns an empty object. If parsing fails,
 * it throws an error with a descriptive message.
 *
 * @param source - The Request or Response object containing the body to parse.
 * @returns A promise that resolves to the parsed JSON object, or an empty object if body is empty.
 */
export const parseBody = async <T = Record<string, unknown>>(
  source: Request | Response,
): Promise<T> => {
  try {
    return (await source.json()) as T;
  } catch (error) {
    throw new Error(
      `Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};
