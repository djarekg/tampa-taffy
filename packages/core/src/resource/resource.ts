import { computed } from '@lit-labs/signals';
import type { Signal } from 'signal-polyfill';
import { AsyncComputed } from 'signal-utils/async-computed';

import { createReloadTick } from '../utils/create-reload-tick';

export type ResourceStatus = 'initial' | 'pending' | 'complete' | 'error';

export type ResourceRenderer<T, R> = {
  initial?: () => R;
  pending?: () => R;
  complete?: (value: T | undefined) => R;
  error?: (error: unknown) => R;
};

export type ResourceLoaderContext<P> = {
  params: P;
  abortSignal: AbortSignal;
};

export type ResourceOptions<P, T> = {
  params?: () => P;
  loader: (context: ResourceLoaderContext<P>) => Promise<T>;
  initialValue?: T;
};

export type ResourceRef<T> = {
  status: Signal.Computed<ResourceStatus>;
  value: Signal.Computed<T | undefined>;
  error: Signal.Computed<unknown>;

  renderer<R>(renderers: ResourceRenderer<T, R>): R | undefined;
  reload(): void;
};

/**
 * A small resource primitive for async data.
 *
 * - Tracks dependencies read inside `params()` (before the first `await`)
 * - Uses `signal-utils` AsyncComputed for async + abort + status
 * - Provides a `renderer()` method with the same four callbacks as `@lit/task`
 */
export function resource<T>(options: ResourceOptions<void, T>): ResourceRef<T>;
export function resource<P, T>(options: ResourceOptions<P, T>): ResourceRef<T>;
export function resource<P, T>(options: ResourceOptions<P, T>): ResourceRef<T> {
  const reloadTick = createReloadTick();
  const params = options.params ?? (() => undefined as P);

  const asyncData = new AsyncComputed<T>(
    async abortSignal => {
      // `AsyncComputed` only re-runs when a tracked dependency changes.
      // We read a dedicated signal here so callers can force a refresh via
      // `reload()` without having to mutate any of the real dependencies.
      reloadTick.get();

      // `params()` is intentionally called synchronously (before the first
      // await) so any signals it reads become dependencies of the computation.
      // When those signals change, `AsyncComputed` will abort the in-flight
      // request (via `abortSignal`) and start a new run.
      const paramsValue = params();
      return options.loader({ params: paramsValue, abortSignal });
    },
    { initialValue: options.initialValue }
  );

  // Wrap AsyncComputed's reactive getters with `@lit-labs/signals` computed
  // signals so Lit can subscribe (via SignalWatcher or `watch()`) and re-render
  // when status/value/error changes.
  const status = computed(() => asyncData.status as ResourceStatus);
  const value = computed(() => asyncData.value);
  const error = computed(() => asyncData.error);

  return {
    status,
    value,
    error,

    renderer<R>(renderers: ResourceRenderer<T, R>): R | undefined {
      // Read via signals so Lit's SignalWatcher can subscribe and re-render
      // when async state transitions (pending -> complete/error).
      switch (status.get()) {
        case 'initial':
          return renderers.initial?.();
        case 'pending':
          return renderers.pending?.();
        case 'complete':
          return renderers.complete?.(value.get());
        case 'error':
          return renderers.error?.(error.get());
      }
    },

    reload(): void {
      reloadTick.set(reloadTick.get() + 1);
    },
  };
}
