/**
 * Debounce a function, ensuring it is only called after a certain delay
 * has passed since the last call.
 *
 * @param {T} fn The function to debounce.
 * @param {number} delay The delay in milliseconds to wait before calling the
 * function after the last call.
 * @returns {T} A debounced version of the function.
 */
// oxlint-disable-next-line typescript/no-explicit-any
export const debounce = <T extends (...args: any[]) => void>(
  fn: T,
  delay: number,
): T => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const debounced = (...args: Parameters<T>) => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };

  return debounced as T;
};
