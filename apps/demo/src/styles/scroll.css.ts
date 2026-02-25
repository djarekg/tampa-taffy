import { css } from 'lit';

export default css`
  [scrollable] {
    display: block;
    inline-size: 100%;
    block-size: 100%;
    overflow: hidden auto;
    padding: 0;
    /* Firefox: set thumb then track (track set to transparent) */
    scrollbar-color: var(--md-sys-color-surface-container-highest) transparent;
    scrollbar-width: thin;
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
  }
`;
