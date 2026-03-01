import { signal } from '@lit-labs/signals';
import { describe, expect, it } from 'vitest';

import { resource } from './resource';

type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (err: unknown) => void;
};

const createDeferred = <T>(): Deferred<T> => {
  let resolve!: (value: T) => void;
  let reject!: (err: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

const flushMicrotasks = async () =>
  new Promise<void>(resolve => queueMicrotask(resolve));

describe('resource()', () => {
  it('reload() triggers reloading and param change aborts in-flight load', async () => {
    const paramsSignal = signal({ id: 1 });
    const deferreds: Array<Deferred<number>> = [];
    const calls: Array<{ id: number; abortSignal: AbortSignal }> = [];

    const users = resource({
      params: () => paramsSignal.get(),
      loader: async ({ params, abortSignal }) => {
        calls.push({ id: params.id, abortSignal });
        const deferred = createDeferred<number>();
        deferreds.push(deferred);
        return deferred.promise;
      },
      defaultValue: 0,
    });

    await flushMicrotasks();
    expect(calls).toHaveLength(1);
    expect(users.status.get()).toBe('loading');

    paramsSignal.set({ id: 2 });
    await flushMicrotasks();
    expect(calls).toHaveLength(2);
    expect(calls[0]?.abortSignal.aborted).toBe(true);

    deferreds[0]?.resolve(1);
    await flushMicrotasks();

    deferreds[1]?.resolve(2);
    await flushMicrotasks();
    await flushMicrotasks();
    expect(users.status.get()).toBe('resolved');
    expect(users.value.get()).toBe(2);

    const didReload = users.reload();
    expect(didReload).toBe(true);
    await flushMicrotasks();
    expect(users.status.get()).toBe('reloading');
    expect(calls).toHaveLength(3);

    deferreds[2]?.resolve(3);
    await flushMicrotasks();
    await flushMicrotasks();
    expect(users.status.get()).toBe('resolved');
    expect(users.value.get()).toBe(3);
  });
});
