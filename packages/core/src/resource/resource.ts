import type { ReactiveControllerHost } from 'lit';
import {
  attachResourceController,
  createParamsSignal,
  createReloadTick,
  createResourceSignals,
  createResourceTask,
  createRunState,
  parseResourceArgs,
  setupResourceEffect,
  toAccessor,
} from './internal/index.ts';
import type {
  ResourceLoaderParams,
  ResourceLoaderParamsNoParams,
  ResourceOptions,
  ResourceOptionsNoParams,
  ResourceOptionsNoParamsWithHost,
  ResourceOptionsWithHost,
  ResourceRef,
  ResourceValue,
} from './internal/index.ts';

/**
 * Create a reactive resource that loads data based on params.
 *
 * If you pass a Lit `ReactiveControllerHost` (e.g. `this` inside a custom
 * element), the resource uses `Task` internally to manage async work and to
 * request host updates when loading completes.
 *
 * @param options Resource options.
 * @returns Resource reference.
 * @example
 * ```ts
 * // In a LitElement:
 * const userResource = resource(this, {
 *   params: () => ({ id: selectedUserId.get() }),
 *   loader: async ({ params, abortSignal }) => {
 *     const response = await fetch(`/api/users/${params.id}`, { signal: abortSignal });
 *
 *     if (!response.ok) {
 *       throw new Error('Failed to fetch user');
 *    }
 *
 *    return response.json() as UserModel;
 *  },
 * });
 * ```
 */
export function resource<P, L extends (params: ResourceLoaderParams<P, any>) => any, D = undefined>(
  options: ResourceOptionsWithHost<P, L, D>
): ResourceRef<P, ResourceValue<L, D>>;

export function resource<
  L extends (params: ResourceLoaderParamsNoParams<any>) => any,
  D = undefined,
>(options: ResourceOptionsNoParamsWithHost<L, D>): ResourceRef<undefined, ResourceValue<L, D>>;

export function resource<P, L extends (params: ResourceLoaderParams<P, any>) => any, D = undefined>(
  host: ReactiveControllerHost,
  options: ResourceOptions<P, L, D>
): ResourceRef<P, ResourceValue<L, D>>;

export function resource<
  L extends (params: ResourceLoaderParamsNoParams<any>) => any,
  D = undefined,
>(
  host: ReactiveControllerHost,
  options: ResourceOptionsNoParams<L, D>
): ResourceRef<undefined, ResourceValue<L, D>>;

export function resource<P, L extends (params: ResourceLoaderParams<P, any>) => any, D = undefined>(
  hostOrOptions: ReactiveControllerHost | ResourceOptionsWithHost<P, L, D>,
  maybeOptions?: ResourceOptions<P, L, D>
): ResourceRef<P, ResourceValue<L, D>> {
  type V = ResourceValue<L, D>;

  const { host, options } = parseResourceArgs(hostOrOptions, maybeOptions);

  const runState = createRunState<V>(options.defaultValue as V | undefined);
  const signals = createResourceSignals<V>(options.defaultValue as V | undefined);

  // Used to trigger reload without changing the params.
  const reloadTick = createReloadTick();

  // Track params reactively (whatever signals are read inside options.params()).
  const paramsSignal = createParamsSignal<P, L, D>(options);

  const requestHostUpdate = () => {
    host.requestUpdate();
  };

  const task = createResourceTask<P, V, L, D>(host, options, signals, runState, requestHostUpdate);
  attachResourceController(host, task, reloadTick, runState, signals, requestHostUpdate);
  const dispose = setupResourceEffect(
    task,
    options,
    signals,
    runState,
    reloadTick,
    paramsSignal,
    requestHostUpdate
  );

  return {
    value: toAccessor(signals.valueSignal),
    status: toAccessor(signals.statusSignal),
    error: toAccessor(signals.errorSignal),
    task,
    renderer: task.render.bind(task),

    reload() {
      reloadTick.set(reloadTick.get() + 1);
    },

    destroy() {
      task.abort();
      dispose();
    },
  };
}
