/**
 * Utility function to define a custom element if it hasn't already been defined.
 */
export const safeDefine = (name: string, constructor: CustomElementConstructor) => {
  if (!customElements.get(name)) {
    customElements.define(name, constructor);
  }
};
