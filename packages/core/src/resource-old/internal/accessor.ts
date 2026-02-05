import type { Accessor, ReadableSignalLike } from './types.ts';

/** Wrap a Lit signal into an Angular-like callable accessor. */
export const toAccessor = <T>(sig: ReadableSignalLike<T>): Accessor<T> => {
  const fn = (() => sig.get()) as Accessor<T>;
  Object.defineProperty(fn, 'value', { get: () => sig.get() });
  return fn;
};
