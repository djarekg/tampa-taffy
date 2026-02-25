import { css } from 'lit';

export default css`
  :host,
  .body {
    display: block;
    inline-size: 100%;
    block-size: 100%;
  }

  main {
    display: block;
    inline-size: 100%;
    block-size: calc(100% - var(--app-header-height));
  }

  .title {
    color: var(--tt-color-primary);
  }
`;
