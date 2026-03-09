import { isEmpty, isNullOrUndefined } from '../utils';

/**
 * Throws an error if the provided value is empty.
 *
 * @param {unknown} value - The value to check.
 * @param {string} message - The error message to throw if the value is empty.
 * @throws {Error} Throws an error if the value is empty.
 * @asserts value is T - Asserts that the value is of type T if it is not empty.
 */
export function assertIsNotEmpty<T>(
  value: T | null | undefined,
  message: string,
): asserts value is T {
  if (isEmpty(value)) {
    console.error('assertIsNotEmpty', arguments);
    throw new Error(message, { cause: { code: 'IsEmpty' } });
  }
}

/**
 * Throws an error if the provided value is null or undefined.
 *
 * @param {unknown} value - The value to check.
 * @param {string} message - The error message to throw if the value is null or undefined.
 * @throws {Error} Throws an error if the value is null or undefined.
 * @asserts value is T - Asserts that the value is of type T if it is not null or undefined.
 */
export function assertIsNotNull<T>(
  value: T | null | undefined,
  message: string,
): asserts value is T {
  if (isNullOrUndefined(value)) {
    console.error('assertIsNotNull', arguments);
    throw new Error(message, { cause: { code: 'IsNull' } });
  }
}
