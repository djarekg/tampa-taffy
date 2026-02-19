import { css } from 'lit';

export default css`
  aside {
    --_background-color: var(
      --tt-navigation-drawer-background-color,
      var(--md-sys-color-surface-container)
    );
    --_inline-size: var(--tt-navigation-drawer-inline-size, 260px);
    --_padding: var(--tt-navigation-drawer-padding, 1rem);

    content-visibility: hidden;
    visibility: hidden;
    position: absolute;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    inline-size: var(--_inline-size);
    block-size: 100%;
    inset-block: 0;
    inset-inline-end: 0;
    padding: var(--_padding);
    background: var(--_background-color);
    box-shadow: var(--tt-elevation-level2);
    border-inline-end: 1px solid var(--tt-border-color);
    border-start-start-radius: var(--md-sys-shape-corner-extra-large);
    border-end-start-radius: var(--md-sys-shape-corner-extra-large);
    transform: translateX(var(--_inline-size));
    will-change: transform;
    transition:
      transform 500ms var(--md-sys-motion-deceleration-easing),
      visibility 0s linear 500ms;
  }

  :host([opened]) aside {
    content-visibility: visible;
    visibility: visible;
    transform: translateX(0);
    transition: transform 200ms var(--md-sys-motion-deceleration-easing);
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
