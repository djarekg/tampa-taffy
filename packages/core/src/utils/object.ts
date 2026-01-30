/**
 * Utility function to check if a value is null or undefined.
 *
 * @param {unknown} value - The value to check.
 * @returns {boolean} - Returns true if the value is null or undefined, otherwise false.
 */
export const isNullOrUndefined = (value: unknown): value is null => {
  return value === null || value === undefined;
};

/**
 * Check if value is not null or undefined.
 *
 * @param {unknown} value The value to check.
 * @returns {boolean} True if the value is not null or undefined, false otherwise.
 */
export const isNotNullOrUndefined = (value: unknown): boolean => {
  return !isNullOrUndefined(value);
};

/**
 * Utility function to check if value is empty.
 *
 * @param {unknown} value - The value to check.
 * @returns - Returns true if the value is empty, otherwise false.
 */
export const isEmpty = (value: unknown): value is null | undefined => {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }

  // For numbers, booleans, etc., consider them "empty" only if they are falsy (e.g., 0, false)
  return !value;
};

/**
 * Check if value is not empty.
 *
 * @param {string | object | Array<unknown> | unknown} value The value to check.
 * @returns {boolean} True if the value is not empty, false otherwise.
 */
export const isNotEmpty = (value: string | object | Array<unknown>) => !isEmpty(value);
