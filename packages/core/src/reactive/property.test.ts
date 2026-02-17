// @vitest-environment jsdom
import { ReactiveElement } from 'lit';
import { describe, expect, it } from 'vitest';

import { property } from './property';

class TestElement extends ReactiveElement {
  foo = property('bar');
  count = property(0, { type: Number });
}

describe('property() helper', () => {
  it('registers properties with defaults', async () => {
    const instance = new TestElement();

    await instance.updateComplete;

    expect(instance.foo).toBe('bar');
    expect(instance.count).toBe(0);

    const ctor = TestElement as typeof ReactiveElement;
    const fooOptions = ctor.elementProperties.get('foo');
    const countOptions = ctor.elementProperties.get('count');

    expect(fooOptions?.type).toBe(String);
    expect(countOptions?.type).toBe(Number);
  });
});
