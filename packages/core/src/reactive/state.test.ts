// @vitest-environment jsdom
import { ReactiveElement } from 'lit';
import { describe, expect, it } from 'vitest';

import { state } from './state';

class TestElement extends ReactiveElement {
  internal = state(false);
}

describe('state() helper', () => {
  it('registers state properties with defaults', async () => {
    const instance = new TestElement();

    await instance.updateComplete;

    expect(instance.internal).toBe(false);

    const ctor = TestElement as typeof ReactiveElement;
    const internalOptions = ctor.elementProperties.get('internal');

    expect(internalOptions?.state).toBe(true);
    expect(internalOptions?.attribute).toBe(false);
  });
});
