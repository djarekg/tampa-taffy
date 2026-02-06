import type { Signal } from 'signal-polyfill';

export type ResourceStatus = 'initial' | 'pending' | 'complete' | 'error';

/**
 * Defines the rendering interface for a resource with different states.
 *
 * @template T - The type of the value when the resource completes successfully.
 * @template R - The type of the render result returned by each state handler.
 */
export type ResourceRenderer<T, R> = {
  /**
   * Renders the initial state before the resource request begins.
   * @returns The render result for the initial state.
   */
  initial?: () => R;
  /**
   * Renders the pending state while the resource is being loaded.
   * @returns The render result for the pending state.
   */
  pending?: () => R;
  /**
   * Renders the completed state when the resource finishes loading successfully.
   * @param value - The resolved value from the resource, or undefined if no value was returned.
   * @returns The render result for the complete state.
   */
  complete?: (value: T | undefined) => R;
  /**
   * Renders the error state when the resource fails to load.
   * @param error - The error that occurred during resource loading.
   * @returns The render result for the error state.
   */
  error?: (error: unknown) => R;
};

/**
 * Context object passed to resource loader functions.
 *
 * @template P - The type of parameters passed to the loader.
 */
export type ResourceLoaderContext<P> = {
  /** The parameters passed to the resource loader */
  params: P;
  /** An AbortSignal that can be used to cancel the resource request */
  abortSignal: AbortSignal;
};

/**
 * Configuration options for creating a resource.
 *
 * @template P - The type of parameters passed to the loader.
 * @template T - The type of the value returned by the loader.
 */
export type ResourceOptions<P, T> = {
  /** A function that returns the parameters to pass to the loader */
  params?: () => P;
  /** The async function that loads the resource data */
  loader: (context: ResourceLoaderContext<P>) => Promise<T>;
  /** An optional initial value to use before the resource loads */
  initialValue?: T;
};

/**
 * A reference to a resource that provides reactive signals for status, value, and errors.
 * Used to access and interact with an asynchronously loaded resource.
 *
 * @template T - The type of the value returned by the resource.
 */
export type ResourceRef<T> = {
  /** A computed signal representing the current loading status of the resource */
  status: Signal.Computed<ResourceStatus>;
  /** A computed signal containing the resolved value, or undefined if not yet loaded */
  value: Signal.Computed<T | undefined>;
  /** A computed signal containing any error that occurred during loading */
  error: Signal.Computed<unknown>;

  /** Renders the resource using the provided state-based renderers */
  renderer<R>(renderers: ResourceRenderer<T, R>): R | undefined;
  /** Manually triggers a reload of the resource */
  reload(): void;
};
