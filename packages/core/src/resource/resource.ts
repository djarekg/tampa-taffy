import { computed } from '@lit-labs/signals';
import { AsyncComputed } from 'signal-utils/async-computed';

import { createReloadTick } from '../utils/create-reload-tick';
import type { ResourceOptions, ResourceRef, ResourceRenderer, ResourceStatus } from './types';

/**
 * Pure function to render resource state based on current status.
 * Follows Single Responsibility Principle - only handles rendering logic.
 *
 * @param status - Current resource status
 * @param value - Current resource value
 * @param error - Current resource error
 * @param renderers - Renderer callbacks for each state
 * @returns Rendered result based on current state
 */
export function renderResourceState<T, R>(
  status: ResourceStatus,
  value: T | undefined,
  error: unknown,
  renderers: ResourceRenderer<T, R>
): R | undefined {
  switch (status) {
    case 'initial':
      return renderers.initial?.();
    case 'pending':
      return renderers.pending?.();
    case 'complete':
      return renderers.complete?.(value);
    case 'error':
      return renderers.error?.(error);
  }
}

/**
 * Pure factory function to create the async computation logic.
 * Separates the computation creation from resource creation for better testability.
 *
 * @param params - Function to get current params
 * @param loader - Async loader function
 * @param reloadTick - Signal to track reload requests
 * @returns Async computation function
 */
export function createAsyncComputation<P, T>(
  params: () => P,
  loader: (context: { params: P; abortSignal: AbortSignal }) => Promise<T>,
  reloadTick: ReturnType<typeof createReloadTick>
): (abortSignal: AbortSignal) => Promise<T> {
  return async (abortSignal: AbortSignal) => {
    // Read reload tick to track dependencies
    reloadTick.get();

    // Get params synchronously before first await to track signal dependencies
    const paramsValue = params();
    return loader({ params: paramsValue, abortSignal });
  };
}

/**
 * Factory to create signal wrappers for AsyncComputed state.
 * Follows Dependency Inversion Principle - depends on abstractions, not concrete implementations.
 *
 * @param asyncData - The async computed data source
 * @returns Object with computed signals for status, value, and error
 */
export function createResourceSignals<T>(asyncData: AsyncComputed<T>) {
  return {
    status: computed(() => asyncData.status as ResourceStatus),
    value: computed(() => asyncData.value),
    error: computed(() => asyncData.error),
  };
}

/**
 * Creates a resource renderer function.
 * Follows Single Responsibility Principle - only creates the renderer.
 *
 * @param getStatus - Function to get current status
 * @param getValue - Function to get current value
 * @param getError - Function to get current error
 * @returns Renderer function
 */
export function createResourceRenderer<T>(
  getStatus: () => ResourceStatus,
  getValue: () => T | undefined,
  getError: () => unknown
) {
  return <R>(renderers: ResourceRenderer<T, R>): R | undefined => {
    return renderResourceState(getStatus(), getValue(), getError(), renderers);
  };
}

/**
 * Creates a reload function.
 * Pure function that returns a new function with captured dependencies.
 *
 * @param reloadTick - The reload tick signal
 * @returns Reload function
 */
export function createReloadFunction(reloadTick: ReturnType<typeof createReloadTick>) {
  return (): void => {
    reloadTick.set(reloadTick.get() + 1);
  };
}

/**
 * A small resource primitive for async data.
 *
 * @example
 * ```ts
 * import { LitElement } from 'lit';
 * import { customElement } from 'lit/decorators.js';
 * import { html, SignalWatcher } from '@lit-labs/signals';
 * import { signal } from '@lit-labs/signals';
 * import { resource } from '@tt/core/resource';
 *
 * const productId = signal('123');
 *
 * const productResource = resource({
 *   params: () => productId.get(),
 *   loader: id => getProductById(id);
 * });
 *
 * export class ProductView extends SignalWatcher(LitElement) {
 *   const { renderer } = productResource;
 *
 *   render() {
 *     return renderer({
 *       initial: () => html`<p>Waiting...</p>`,
 *       pending: () => html`<p>Loading...</p>`,
 *       complete: (product) => html`<p>${product?.name}</p>`,
 *       error: (err) => html`<p>Error: ${String(err)}</p>`,
 *     });
 *   }
 * }
 *
 * customElements.define('product-view', ProductView);
 * ```
 */
export function resource<T>(options: ResourceOptions<void, T>): ResourceRef<T>;
export function resource<P, T>(options: ResourceOptions<P, T>): ResourceRef<T>;
export function resource<P, T>(options: ResourceOptions<P, T>): ResourceRef<T> {
  // Initialize dependencies - following Dependency Inversion Principle
  const reloadTick = createReloadTick();
  const params = options.params ?? (() => undefined as P);

  // Create async computation using pure factory function
  const computationFn = createAsyncComputation(params, options.loader, reloadTick);

  // Create AsyncComputed instance with the computation function
  const asyncData = new AsyncComputed<T>(computationFn, {
    initialValue: options.initialValue,
  });

  // Create reactive signals using factory function
  const signals = createResourceSignals(asyncData);

  // Create renderer using factory function - follows Single Responsibility
  const renderer = createResourceRenderer(
    () => signals.status.get(),
    () => signals.value.get(),
    () => signals.error.get()
  );

  // Create reload function using factory - follows DRY principle
  const reload = createReloadFunction(reloadTick);

  // Return ResourceRef with all composed functionality
  return {
    status: signals.status,
    value: signals.value,
    error: signals.error,
    renderer,
    reload,
  };
}
