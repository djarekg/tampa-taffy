import { computed, signal } from '@lit-labs/signals';
import { effect } from 'signal-utils/subtle/microtask-effect';

export type ResourceStatus =
  | 'idle'
  | 'loading'
  | 'reloading'
  | 'resolved'
  | 'error'
  | 'local';

export type ResourceStreamItem<T> = { value: T } | { error: Error };

export type ResourceSnapshot<T> =
  | { status: Exclude<ResourceStatus, 'error'>; value: T }
  | { status: 'error'; error: Error };

export type ResourceLoaderParams<R> = {
  params: R;
  request: R;
  abortSignal: AbortSignal;
  previous: {
    status: ResourceStatus;
  };
};

export type ResourceLoader<T, R> = (
  params: ResourceLoaderParams<R>,
) => Promise<T>;

export type ResourceStreamingLoader<T, R> = (
  params: ResourceLoaderParams<R>,
) => Promise<ReadableSignal<ResourceStreamItem<T>>>;

export type ResourceOptions<T, R> = {
  params?: () => R;
  loader: ResourceLoader<T, R>;
  defaultValue?: T;
  equal?: (a: T, b: T) => boolean;
  debugName?: string;
  /**
   * Deprecated alias for params.
   */
  request?: () => R;
};

export type StreamingResourceOptions<T, R> = Omit<
  ResourceOptions<T, R>,
  'loader'
> & {
  stream: ResourceStreamingLoader<T, R>;
};

export type Resource<T> = {
  value: ReadableSignal<T>;
  status: ReadableSignal<ResourceStatus>;
  error: ReadableSignal<Error | undefined>;
  isLoading: ReadableSignal<boolean>;
  snapshot: ReadableSignal<ResourceSnapshot<T>>;
  hasValue(): this is ResourceRef<Exclude<T, undefined>>;
};

export type ResourceRef<T> = Resource<T> & {
  value: WritableSignal<T>;
  set(value: T): void;
  update(updateFn: (value: T) => T): void;
  reload(): boolean;
  asReadonly(): Resource<T>;
};

type ReadableSignal<T> = {
  get(): T;
};

type WritableSignal<T> = ReadableSignal<T> & {
  set(value: T): void;
  update(updateFn: (value: T) => T): void;
};

const createWritableSignal = <T>(initialValue: T): WritableSignal<T> => {
  const sig = signal(initialValue) as unknown as WritableSignal<T>;
  sig.update = updateFn => sig.set(updateFn(sig.get()));
  return sig;
};

const isStreamingResourceOptions = <T, R>(
  options: ResourceOptions<T, R> | StreamingResourceOptions<T, R>,
): options is StreamingResourceOptions<T, R> =>
  typeof (options as StreamingResourceOptions<T, R>).stream === 'function';

const encapsulateResourceError = (err: unknown): Error => {
  if (err instanceof Error) {
    return err;
  }
  return new Error(String(err));
};

const getLoader = <T, R>(
  options: ResourceOptions<T, R> | StreamingResourceOptions<T, R>,
): ResourceStreamingLoader<T, R> => {
  if (isStreamingResourceOptions(options)) {
    return options.stream;
  }

  return async params => {
    try {
      const value = await options.loader(params);
      return signal({ value });
    } catch (err) {
      return signal({ error: encapsulateResourceError(err) });
    }
  };
};

const toStopFn = (effectResult: unknown): (() => void) => {
  if (typeof effectResult === 'function') {
    return effectResult as () => void;
  }
  if (
    effectResult &&
    typeof effectResult === 'object' &&
    'dispose' in effectResult
  ) {
    const disposable = effectResult as { dispose: () => void };
    return () => disposable.dispose();
  }
  return () => undefined;
};

export function resource<T, R>(
  options: ResourceOptions<T, R> & { defaultValue: T },
): ResourceRef<T>;
export function resource<T, R>(
  options: ResourceOptions<T, R>,
): ResourceRef<T | undefined>;
/**
 * Signal-based resource for async reads.
 *
 * Example:
 * ```ts
 * const client = api(import.meta.env.PUBLIC_API_URL);
 * const users = resource({
 *   params: () => ({ page: pageSignal.get() }),
 *   loader: ({ params, abortSignal }) =>
 *     client.get<User[]>('/users', { query: params, signal: abortSignal }),
 *   defaultValue: [],
 * });
 * ```
 */
export function resource<T, R>(
  options: ResourceOptions<T, R> | StreamingResourceOptions<T, R>,
): ResourceRef<T | undefined> {
  const paramsFn = (options.params ??
    options.request ??
    (() => undefined)) as () => R | undefined;
  const loader = getLoader(options);
  const value = createWritableSignal(options.defaultValue as T | undefined);
  const status = createWritableSignal<ResourceStatus>('idle');
  const error = createWritableSignal<Error | undefined>(undefined);
  const reloadTick = createWritableSignal(0);

  const isLoading = computed(
    () => status.get() === 'loading' || status.get() === 'reloading',
  );

  const snapshot = computed<ResourceSnapshot<T | undefined>>(() => {
    const currentStatus = status.get();
    if (currentStatus === 'error') {
      return { status: 'error', error: error.get()! };
    }
    return { status: currentStatus, value: value.get() };
  });

  const request = computed(() => paramsFn());

  let pendingController: AbortController | undefined;
  let stopStreamEffect: (() => void) | undefined;
  let activeLoadId = 0;
  let lastRequest: R | undefined;
  let lastReload = 0;

  const abortInProgressLoad = () => {
    if (pendingController) {
      pendingController.abort();
      pendingController = undefined;
    }
  };

  const attachStream = (
    streamSignal: ReadableSignal<ResourceStreamItem<T>>,
    loadId: number,
  ) => {
    stopStreamEffect?.();
    stopStreamEffect = toStopFn(
      effect(() => {
        const streamValue = streamSignal.get();
        if (loadId !== activeLoadId) {
          return;
        }
        if ('error' in streamValue) {
          error.set(streamValue.error);
          status.set('error');
          return;
        }

        const nextValue = streamValue.value;
        const currentValue = value.get();
        if (!options.equal || !options.equal(currentValue as T, nextValue)) {
          value.set(nextValue);
        }
        error.set(undefined);
        status.set('resolved');
      }),
    );
  };

  effect(() => {
    const requestValue = request.get();
    const reloadValue = reloadTick.get();

    const requestChanged = requestValue !== lastRequest;
    const reloadChanged = reloadValue !== lastReload;

    lastRequest = requestValue as R | undefined;
    lastReload = reloadValue;

    if (requestValue === undefined) {
      abortInProgressLoad();
      stopStreamEffect?.();
      status.set('idle');
      error.set(undefined);
      return;
    }

    const previousStatus = status.get();

    if (requestChanged || reloadChanged) {
      abortInProgressLoad();
    }

    const nextStatus: ResourceStatus =
      previousStatus === 'resolved' ||
      previousStatus === 'error' ||
      previousStatus === 'local'
        ? reloadChanged && !requestChanged
          ? 'reloading'
          : 'loading'
        : 'loading';

    status.set(nextStatus);
    error.set(undefined);

    const currentLoadId = ++activeLoadId;
    pendingController = new AbortController();
    const abortSignal = pendingController.signal;

    const params: ResourceLoaderParams<R> = {
      params: requestValue as R,
      request: requestValue as R,
      abortSignal,
      previous: { status: previousStatus },
    };

    void (async () => {
      try {
        const streamSignal = await loader(params);
        if (abortSignal.aborted || currentLoadId !== activeLoadId) {
          return;
        }
        attachStream(streamSignal, currentLoadId);
      } catch (err) {
        if (abortSignal.aborted || currentLoadId !== activeLoadId) {
          return;
        }
        error.set(encapsulateResourceError(err));
        status.set('error');
      }
    })();
  });

  const set = (nextValue: T | undefined) => {
    const currentValue = value.get();
    if (options.equal?.(currentValue as T, nextValue as T)) {
      return;
    }
    abortInProgressLoad();
    value.set(nextValue as T);
    error.set(undefined);
    status.set('local');
  };

  const update = (updateFn: (value: T | undefined) => T | undefined) => {
    set(updateFn(value.get() as T | undefined) as T);
  };

  const reload = () => {
    const currentStatus = status.get();
    if (currentStatus === 'idle' || currentStatus === 'loading') {
      return false;
    }
    reloadTick.set(reloadTick.get() + 1);
    return true;
  };

  const hasValue = (): this is ResourceRef<
    Exclude<T | undefined, undefined>
  > => {
    if (status.get() === 'error') {
      return false;
    }
    return value.get() !== undefined;
  };

  const asReadonly = (): Resource<T | undefined> => resourceRef;

  const resourceRef: ResourceRef<T | undefined> = {
    value,
    status,
    error,
    isLoading,
    snapshot,
    set: set as (value: T | undefined) => void,
    update: update as (
      updateFn: (value: T | undefined) => T | undefined,
    ) => void,
    reload,
    hasValue,
    asReadonly,
  };

  return resourceRef;
}
