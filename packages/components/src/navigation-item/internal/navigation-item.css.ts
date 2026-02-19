import { css } from 'lit';

export default css`
  a {
    --_indicator-opacity: 0;
    --_indicator-visibility: hidden;

    position: relative;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    text-decoration: none;
    padding: 0.6rem 1rem;

    &:is(:hover, :focus-visible) {
      .indicator {
        --_indicator-opacity: 1;
        --_indicator-visibility: visible;
      }
    }
  }

  .label,
  m3e-icon {
    color: var(--tt-navigation-item-color, var(--md-sys-color-on-surface));
  }

  .label {
    font-size: var(--tt-navigation-item-font-size, var(--md-sys-typescale-label-large-size));
  }

  m3e-icon {
    inline-size: var(--tt-navigation-item-icon-inline-size, 24px);
    block-size: var(--tt-navigation-item-icon-block-size, 24px);
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
