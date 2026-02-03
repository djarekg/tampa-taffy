import type { ReactiveControllerHost } from 'lit';
import type { ResourceOptions, ResourceOptionsWithHost } from './types.ts';

const isReactiveControllerHost = (value: unknown): value is ReactiveControllerHost => {
  return (
    !!value &&
    typeof value === 'object' &&
    'addController' in value &&
    // `requestUpdate()` is required by the ReactiveControllerHost contract.
    'requestUpdate' in value
  );
};

const assertValidHost: (host: unknown) => asserts host is ReactiveControllerHost = host => {
  if (!isReactiveControllerHost(host)) {
    throw new Error(
      '@tt/core resource(): missing/invalid Lit ReactiveControllerHost. ' +
        'Use resource(this, options) or resource({ host: this, ... }).'
    );
  }
};

export const parseResourceArgs = <P, L extends (params: any) => any, D>(
  hostOrOptions: ReactiveControllerHost | ResourceOptionsWithHost<P, L, D>,
  maybeOptions?: ResourceOptions<P, L, D>
): { host: ReactiveControllerHost; options: ResourceOptions<P, L, D> } => {
  const options = (maybeOptions ?? hostOrOptions) as ResourceOptions<P, L, D>;
  const host = (
    maybeOptions !== undefined
      ? hostOrOptions
      : (hostOrOptions as ResourceOptionsWithHost<P, L, D>).host
  ) as unknown;

  assertValidHost(host);
  return { host, options };
};
