import { css } from 'lit';

export default css`
  .list-item {
    --_indicator-opacity: 0;
    --_indicator-visibility: hidden;

    position: relative;

    &:is(:hover, :focus-visible) {
      .indicator {
        --_indicator-opacity: 1;
        --_indicator-visibility: visible;
      }
    }
  }

  .content {
    display: flex;
    align-items: center;
    gap: 0.9rem;
  }

  .headline {
    color: var(--tt-navigation-item-color, var(--md-sys-color-on-surface));
    font-size: var(--tt-navigation-item-font-size, var(--md-sys-typescale-label-large-size));
  }

  .indicator {
    visibility: var(--_indicator-visibility);
    content-visibility: var(--_indicator-visibility);
    position: absolute;
    inset: 0;
    background: var(--tt-navigation-item-color, var(--md-sys-color-inverse-on-surface));
    border-radius: var(--md-sys-shape-corner-small);
    opacity: var(--_indicator-opacity);
    z-index: -1;
    transition: opacity 600ms var(--md-sys-motion-deceleration-easing);
  }
`;
