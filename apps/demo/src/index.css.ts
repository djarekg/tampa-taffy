import { css } from 'lit';

export default css`
  :host {
    display: block;
    inline-size: 100%;
    block-size: 100vh;
  }

  main {
    block-size: calc(100vh - var(--app-header-height));
    inline-size: 100%;
  }

  .title {
    color: var(--tt-color-primary);
  }
`;
