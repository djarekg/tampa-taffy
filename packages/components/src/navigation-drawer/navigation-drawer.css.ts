import { css } from 'lit';

export default css`
  aside {
    --_drawer-inline-size: 260px;

    content-visibility: hidden;
    visibility: hidden;
    position: absolute;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    inline-size: var(--_drawer-inline-size);
    block-size: 100%;
    inset-block: 0;
    inset-inline-end: 0;
    background: var(--tt-color-background);
    box-shadow: var(--tt-elevation-level2);
    border-inline-end: 1px solid var(--tt-border-color);
    border-start-start-radius: var(--tt-shape-large);
    border-end-start-radius: var(--tt-shape-large);
    transform: translateX(calc(var(--_drawer-inline-size) * -1));
    will-change: transform;
    transition:
      transform 500ms var(--md-sys-motion-standard-easing),
      visibility 0s linear 500ms;
  }

  :host([opened]) aside {
    content-visibility: visible;
    visibility: visible;
    transform: translateX(0);
    transition: transform 200ms var(--md-sys-motion-standard-easing);
  }

  .scrim {
    --_scrim-opacity: 0;

    position: absolute;
    inset: 0;
    content-visibility: hidden;
    visibility: hidden;
    overscroll-behavior: contain;
    background: var(--md-sys-color-scrim);
    background-color: var(--md-sys-color-scrim);
    opacity: var(--_scrim-opacity);
    transition: opacity 200ms linear 100ms;
  }

  :host([opened]) .scrim {
    --_scrim-opacity: 0.2;

    visibility: visible;
  }
`;
