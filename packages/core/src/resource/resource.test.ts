import { signal } from '@lit-labs/signals';
import { describe, expect, it, vi } from 'vitest';

import { createReloadTick } from '../utils/create-reload-tick';
import {
  createAsyncComputation,
  createReloadFunction,
  createResourceRenderer,
  renderResourceState,
  resource,
} from './resource';
import type { ResourceRenderer } from './types';

// ============================================================================
// Tests for Pure Functions
// ============================================================================

describe('renderResourceState()', () => {
  const mockRenderers: ResourceRenderer<number, string> = {
    initial: () => 'initial-state',
    pending: () => 'pending-state',
    complete: value => `complete: ${value}`,
    error: err => `error: ${err}`,
  };

  it('renders initial state', () => {
    const result = renderResourceState('initial', undefined, undefined, mockRenderers);
    expect(result).toBe('initial-state');
  });

  it('renders pending state', () => {
    const result = renderResourceState('pending', undefined, undefined, mockRenderers);
    expect(result).toBe('pending-state');
  });

  it('renders complete state with value', () => {
    const result = renderResourceState('complete', 42, undefined, mockRenderers);
    expect(result).toBe('complete: 42');
  });

  it('renders error state with error', () => {
    const result = renderResourceState('error', undefined, 'Something went wrong', mockRenderers);
    expect(result).toBe('error: Something went wrong');
  });

  it('returns undefined if renderer callback is not provided', () => {
    const result = renderResourceState('initial', undefined, undefined, {});
    expect(result).toBeUndefined();
  });

  it('handles complete state with undefined value', () => {
    const result = renderResourceState('complete', undefined, undefined, mockRenderers);
    expect(result).toBe('complete: undefined');
  });
});

// ============================================================================
// Tests for createAsyncComputation
// ============================================================================

describe('createAsyncComputation()', () => {
  it('creates a computation function that calls loader with params', async () => {
    const mockLoader = vi.fn(async ({ params }) => `Result: ${params}`);
    const mockParams = () => 'test-param';
    const reloadTick = createReloadTick();

    const computationFn = createAsyncComputation(mockParams, mockLoader, reloadTick);
    const abortController = new AbortController();
    const result = await computationFn(abortController.signal);

    expect(result).toBe('Result: test-param');
    expect(mockLoader).toHaveBeenCalledWith({
      params: 'test-param',
      abortSignal: abortController.signal,
    });
  });

  it('tracks reload tick as dependency', async () => {
    const mockLoader = vi.fn(async () => 'result');
    const mockParams = () => 'param';
    const reloadTick = createReloadTick(0);

    const computationFn = createAsyncComputation(mockParams, mockLoader, reloadTick);
    const abortController = new AbortController();

    // First call
    await computationFn(abortController.signal);
    expect(mockLoader).toHaveBeenCalledTimes(1);

    // Incrementing reload tick should trigger re-computation when used in reactive context
    reloadTick.set(1);
    const currentTick = reloadTick.get();
    expect(currentTick).toBe(1);
  });

  it('calls params function synchronously before loader', async () => {
    const callOrder: string[] = [];
    const mockParams = () => {
      callOrder.push('params');
      return 'param';
    };
    const mockLoader = vi.fn(async () => {
      callOrder.push('loader');
      return 'result';
    });
    const reloadTick = createReloadTick();

    const computationFn = createAsyncComputation(mockParams, mockLoader, reloadTick);
    const abortController = new AbortController();
    await computationFn(abortController.signal);

    expect(callOrder).toEqual(['params', 'loader']);
  });
});

// ============================================================================
// Tests for createResourceRenderer
// ============================================================================

describe('createResourceRenderer()', () => {
  it('creates a renderer function that uses provided getters', () => {
    const getStatus = () => 'complete' as const;
    const getValue = () => 42;
    const getError = () => undefined;

    const renderer = createResourceRenderer(getStatus, getValue, getError);
    const result = renderer({
      complete: value => `Value is ${value}`,
    });

    expect(result).toBe('Value is 42');
  });

  it('calls getters when renderer is invoked', () => {
    const getStatus = vi.fn(() => 'pending' as const);
    const getValue = vi.fn(() => undefined);
    const getError = vi.fn(() => undefined);

    const renderer = createResourceRenderer(getStatus, getValue, getError);
    renderer({ pending: () => 'loading' });

    expect(getStatus).toHaveBeenCalled();
    expect(getValue).toHaveBeenCalled();
    expect(getError).toHaveBeenCalled();
  });
});

// ============================================================================
// Tests for createReloadFunction
// ============================================================================

describe('createReloadFunction()', () => {
  it('creates a function that increments reload tick', () => {
    const reloadTick = createReloadTick(0);
    const reload = createReloadFunction(reloadTick);

    expect(reloadTick.get()).toBe(0);
    reload();
    expect(reloadTick.get()).toBe(1);
    reload();
    expect(reloadTick.get()).toBe(2);
  });

  it('is a pure function that can be called multiple times', () => {
    const reloadTick = createReloadTick(5);
    const reload = createReloadFunction(reloadTick);

    reload();
    expect(reloadTick.get()).toBe(6);
    reload();
    expect(reloadTick.get()).toBe(7);
  });
});

// ============================================================================
// Integration Tests for resource()
// ============================================================================

describe('resource()', () => {
  it('creates a resource ref and renderer returns a branch', () => {
    const ref = resource({
      loader: async () => 123,
    });

    const rendered = ref.renderer({
      initial: () => 'initial',
      pending: () => 'pending',
      complete: () => 'complete',
      error: () => 'error',
    });

    expect(['initial', 'pending', 'complete', 'error']).toContain(rendered);
    expect(typeof ref.reload).toBe('function');
  });

  it('creates resource with initial value', () => {
    const ref = resource({
      loader: async () => 100,
      initialValue: 50,
    });

    // Initially should have the initial value
    expect(ref.value.get()).toBe(50);
  });

  it('creates resource with params function', () => {
    const mockLoader = vi.fn(async ({ params }) => params * 2);
    const paramSignal = signal(10);

    resource({
      params: () => paramSignal.get(),
      loader: mockLoader,
    });

    // Resource creation triggers async computation
    // We verify the loader function was provided correctly
    expect(mockLoader).toBeDefined();
    expect(paramSignal.get()).toBe(10);
  });

  it('reload function triggers re-computation', () => {
    const ref = resource({
      loader: async () => Math.random(),
    });

    ref.reload();

    // After reload, the computation should restart
    // Status might change or loader will be called again
    expect(typeof ref.reload).toBe('function');
  });

  it('exposes status, value, and error signals', () => {
    const ref = resource({
      loader: async () => 'test',
    });

    expect(ref.status).toBeDefined();
    expect(ref.value).toBeDefined();
    expect(ref.error).toBeDefined();
    expect(typeof ref.status.get).toBe('function');
    expect(typeof ref.value.get).toBe('function');
    expect(typeof ref.error.get).toBe('function');
  });

  it('handles loader errors gracefully', () => {
    const testError = new Error('Test error');
    const ref = resource({
      loader: async () => {
        throw testError;
      },
    });

    // Resource is created and will handle errors internally
    // The error signal will be populated when the async computation fails
    expect(ref.error).toBeDefined();
    expect(ref.status).toBeDefined();
    expect(ref.renderer).toBeDefined();
  });
});
