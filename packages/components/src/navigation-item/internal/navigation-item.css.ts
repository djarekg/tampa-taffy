import { css } from 'lit';

export default css`
  :host {
    --_indicator-opacity: 0;
  }

  a {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    text-decoration: none;

    &:is(:hover, :focus-visible) {
      .indicator {
        --_indicator-opacity: 1;
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
    position: absolute;
    inset: 0;
    border: 1 solid var(--tt-navigation-item-color, var(--md-sys-color-on-surface));
    border-radius: var(--md-sys-shape-corner-extra-large);
    opacity: var(--_indicator-opacity);
    z-index: -1;
  }
`;
