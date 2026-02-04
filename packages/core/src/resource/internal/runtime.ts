import { Signal, computed, signal } from '@lit-labs/signals';
import { Task, initialState } from '@lit/task';
import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { batchedEffect } from 'signal-utils/subtle/batched-effect';
import type {
  ReadableSignalLike,
  ResourceLoaderParams,
  ResourceLoaderParamsNoParams,
  ResourceOptions,
  ResourceRunState,
  ResourceSignals,
  ResourceStatus,
  WritableSignalLike,
} from './types.ts';

export const createRunState = <V>(defaultValue: V | undefined): ResourceRunState<V> => {
  return {
    activeRunId: 0,
    previousValue: defaultValue,
    isHostConnected: true,
  };
};

export const createResourceSignals = <V>(defaultValue: V | undefined): ResourceSignals<V> => {
  return {
    valueSignal: signal<V | undefined>(defaultValue),
    statusSignal: signal<ResourceStatus>('idle'),
    errorSignal: signal<unknown | null>(null),
  };
};

const isSuperseded = (
  myRunId: number,
  abortSignal: AbortSignal,
  runState: ResourceRunState<any>
) => {
  return myRunId !== runState.activeRunId || abortSignal.aborted;
};

const setIdle = <V>(signals: ResourceSignals<V>, requestHostUpdate: () => void) => {
  signals.statusSignal.set('idle');
  signals.errorSignal.set(null);
  requestHostUpdate();
};

const beginLoading = <V>(signals: ResourceSignals<V>, requestHostUpdate: () => void) => {
  signals.statusSignal.set('loading');
  signals.errorSignal.set(null);
  requestHostUpdate();
};

const applyResolvedValue = <V>(
  value: V,
  signals: ResourceSignals<V>,
  runState: ResourceRunState<V>,
  equal: ((a: V, b: V) => boolean) | undefined,
  requestHostUpdate: () => void
): void => {
  const prev = signals.valueSignal.get();
  const shouldUpdate = !equal || prev === undefined || !equal(prev as V, value);

  if (shouldUpdate) {
    signals.valueSignal.set(value);
  }

  runState.previousValue = value;
  signals.statusSignal.set('resolved');
  requestHostUpdate();
};

const applyError = <V>(
  err: unknown,
  signals: ResourceSignals<V>,
  requestHostUpdate: () => void
): void => {
  signals.errorSignal.set(err);
  signals.statusSignal.set('error');
  requestHostUpdate();
};

const createLoaderRunner = <P, V, L extends (params: any) => any, D>(
  options: ResourceOptions<P, L, D>,
  runState: ResourceRunState<V>
): ((params: P, abortSignal: AbortSignal) => Promise<V>) => {
  const hasParamsFactory = typeof options.params === 'function';

  return async (params: P, abortSignal: AbortSignal): Promise<V> => {
    if (hasParamsFactory) {
      return (await (options.loader as unknown as (p: ResourceLoaderParams<P, V>) => any)({
        params,
        abortSignal,
        previous: runState.previousValue,
      })) as V;
    }

    return (await (options.loader as unknown as (p: ResourceLoaderParamsNoParams<V>) => any)({
      abortSignal,
      previous: runState.previousValue,
    })) as V;
  };
};

export const createReloadTick = (): WritableSignalLike<number> => signal(0);

export const createParamsSignal = <P, L extends (params: any) => any, D>(
  options: ResourceOptions<P, L, D>
): ReadableSignalLike<P | null | undefined> => {
  return computed(() =>
    options.params ? options.params() : (undefined as P | undefined)
  ) as unknown as ReadableSignalLike<P | null | undefined>;
};

export const createResourceTask = <P, V, L extends (params: any) => any, D>(
  host: ReactiveControllerHost,
  options: ResourceOptions<P, L, D>,
  signals: ResourceSignals<V>,
  runState: ResourceRunState<V>,
  requestHostUpdate: () => void
): Task<readonly [P, number], V> => {
  const runLoader = createLoaderRunner<P, V, L, D>(options, runState);

  return new Task<readonly [P, number], V>(host, {
    autoRun: false,
    task: async ([params, myRun], { signal: abortSignal }) => {
      try {
        const value = await runLoader(params, abortSignal);

        // Ignore results from superseded/aborted runs.
        if (isSuperseded(myRun, abortSignal, runState)) {
          return initialState;
        }

        applyResolvedValue(
          value,
          signals,
          runState,
          options.equal as unknown as ((a: V, b: V) => boolean) | undefined,
          requestHostUpdate
        );

        return value;
      } catch (err) {
        // Ignore errors from superseded/aborted runs.
        if (isSuperseded(myRun, abortSignal, runState)) {
          return initialState;
        }

        applyError(err, signals, requestHostUpdate);
        throw err;
      }
    },
  });
};

export const attachResourceController = <V>(
  host: ReactiveControllerHost,
  task: Task<readonly [any, number], any>,
  reloadTick: WritableSignalLike<number>,
  runState: ResourceRunState<V>,
  signals: ResourceSignals<V>,
  requestHostUpdate: () => void
): void => {
  const controller: ReactiveController = {
    hostConnected() {
      runState.isHostConnected = true;
      // Ensure we pick up any missed changes while disconnected.
      reloadTick.set(reloadTick.get() + 1);
    },
    hostDisconnected() {
      runState.isHostConnected = false;
      // Abort any in-flight run while disconnected to avoid background work.
      task.abort();
      setIdle(signals, requestHostUpdate);
    },
  };

  host.addController(controller);
};

export const setupResourceEffect = <P, V, L extends (params: any) => any, D>(
  task: Task<readonly [P, number], V>,
  options: ResourceOptions<P, L, D>,
  signals: ResourceSignals<V>,
  runState: ResourceRunState<V>,
  reloadTick: WritableSignalLike<number>,
  paramsSignal: ReadableSignalLike<P | null | undefined>,
  requestHostUpdate: () => void
): (() => void) => {
  return Signal.subtle.untrack(() =>
    batchedEffect(() => {
      const params = paramsSignal.get();
      void reloadTick.get();

      if (!runState.isHostConnected) {
        setIdle(signals, requestHostUpdate);
        return;
      }

      // Suspend loading only when an explicit params factory returns nullish.
      // If `options.params` is omitted, we still run the loader once with
      // `params === undefined`.
      if (options.params && params == null) {
        task.abort();
        setIdle(signals, requestHostUpdate);
        return;
      }

      const myRun = ++runState.activeRunId;
      beginLoading(signals, requestHostUpdate);
      task.run([params as P, myRun]);
    })
  );
};
