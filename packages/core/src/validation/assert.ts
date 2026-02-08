import { isEmpty, isNullOrUndefined } from '../utils';

/**
 * Throws an error if the provided value is empty.
 *
 * @param {unknown} value - The value to check.
 */
export function throwIfEmpty(value: unknown, message: string): void {
  if (isEmpty(value)) {
    console.error('throwIfEmpty', arguments);
    throw new Error(message, { cause: { code: 'IsEmpty' } });
  }
}

/**
 * Throws an error if the provided value is null or undefined.
 *
 * @param {unknown} value - The value to check.
 */
export function throwIfNull(value: unknown, message: string): void {
  if (isNullOrUndefined(value)) {
    console.error('throwIfEmpty', arguments);
    throw new Error(message, { cause: { code: 'IsNull' } });
  }
}
