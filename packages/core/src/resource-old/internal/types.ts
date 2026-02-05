import type { Task } from '@lit/task';

export type ResourceStatus = 'idle' | 'loading' | 'resolved' | 'error';

/**
 * Angular-style "signal" shape: callable accessor with a `.value` getter.
 * (Lit signals themselves are objects with `.get()`/`.set()`.)
 */
export type Accessor<T> = (() => T) & { readonly value: T };

type IsAny<T> = 0 extends 1 & T ? true : false;
type IsUnknown<T> = unknown extends T ? ([T] extends [unknown] ? true : false) : false;

type AwaitedReturn<F> = F extends (...args: any[]) => infer R ? Awaited<R> : never;

export type ResourceValue<L, D> = L extends (...args: any[]) => any
  ? IsAny<AwaitedReturn<L>> extends true
    ? D extends undefined
      ? AwaitedReturn<L>
      : D
    : IsUnknown<AwaitedReturn<L>> extends true
      ? D extends undefined
        ? AwaitedReturn<L>
        : D
      : AwaitedReturn<L>
  : D;

export type ResourceLoaderParams<R, T> = {
  params: R;
  abortSignal: AbortSignal;
  previous: T | undefined;
};

export type ResourceLoaderParamsNoParams<T> = {
  abortSignal: AbortSignal;
  previous: T | undefined;
};

export type ResourceOptions<
  P,
  L extends (params: ResourceLoaderParams<P, any>) => any,
  D = undefined,
> = {
  /**
   * Reactive params factory. When its dependencies change, the resource reloads.
   * If it returns `null`/`undefined`, loading is suspended and status becomes `idle`.
   */
  params?: () => P | null | undefined;

  /**
   * Loader invoked for each params. Should honor `abortSignal`.
   * May return a value or a promise.
   */
  loader: L;

  /**
   * Initial value exposed before the first successful load.
   */
  defaultValue?: D;

  /**
   * Optional equality check to prevent emitting identical values.
   */
  equal?: (a: ResourceValue<L, D>, b: ResourceValue<L, D>) => boolean;
};

export type ResourceOptionsWithHost<
  P,
  L extends (params: ResourceLoaderParams<P, any>) => any,
  D = undefined,
> = ResourceOptions<P, L, D> & {
  host: import('lit').ReactiveControllerHost;
};

export type ResourceOptionsNoParams<
  L extends (params: ResourceLoaderParamsNoParams<any>) => any,
  D = undefined,
> = {
  params?: undefined;
  loader: L;
  defaultValue?: D;
  equal?: (a: ResourceValue<L, D>, b: ResourceValue<L, D>) => boolean;
};

export type ResourceOptionsNoParamsWithHost<
  L extends (params: ResourceLoaderParamsNoParams<any>) => any,
  D = undefined,
> = ResourceOptionsNoParams<L, D> & {
  host: import('lit').ReactiveControllerHost;
};

/**
 * Modeled after Angular's Resource API surface.
 * Consumers: extend `SignalWatcher` in Lit components so reads in `render()`
 * trigger updates (https://lit.dev/docs/data/signals/).
 */
export type ResourceRef<P, V> = {
  value: Accessor<V | undefined>;
  status: Accessor<ResourceStatus>;
  error: Accessor<unknown | null>;

  /**
   * Internal Lit Task used for async work when a host is provided.
   * Useful to access helpers like `task.render(...)`.
   */
  task: Task<readonly [P, number], V>;

  /**
   * Internal Lit Task renderer function for use in templates.
   */
  renderer: Task<readonly [P, number], V>['render'];

  reload: () => void;
  destroy: () => void;
};

export type ReadableSignalLike<T> = { get(): T };
export type WritableSignalLike<T> = ReadableSignalLike<T> & { set(value: T): void };

export type ResourceSignals<V> = {
  valueSignal: WritableSignalLike<V | undefined>;
  statusSignal: WritableSignalLike<ResourceStatus>;
  errorSignal: WritableSignalLike<unknown | null>;
};

export type ResourceRunState<V> = {
  activeRunId: number;
  previousValue: V | undefined;
  isHostConnected: boolean;
};
