import { DesignToken } from '@m3e/web/core';
import { css } from 'lit';

import { TtDesignToken } from '../../tokens';

export default css`
  :host {
    --_list-item-border: var(--tt-list-item-border, none);
    --_list-item-border-radius: var(--tt-list-item-border-radius, 0);
    --_list-item-background-color: var(
      --tt-list-item-background-color,
      transparent
    );
  }

  .list-item {
    --_indicator-opacity: 0;
    --_indicator-visibility: hidden;

    position: relative;
    border: var(--_list-item-border);
    border-radius: var(--_list-item-border-radius);
    background-color: var(--_list-item-background-color);

    &:is(:hover, :focus-visible) {
      .indicator {
        --_indicator-opacity: 1;
        --_indicator-visibility: visible;
      }
    }
  }

  .body {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    inline-size: 100%;
  }

  .content {
    display: flex;
    align-items: center;
    gap: 0.9rem;
    inline-size: 100%;
  }

  .headline,
  .supporting-text {
    --m3e-icon-size: 18px;

    &,
    span {
      display: flex;
      align-items: center;
    }

    span {
      &:empty {
        display: none;
      }

      m3e-icon {
        margin-inline-end: 0.25rem;
      }
    }
  }

  .headline {
    justify-content: space-between;
    color: var(--tt-list-item-headline-color, var(--md-sys-color-on-surface));
    font-size: var(
      --tt-list-item-font-size,
      var(--md-sys-typescale-label-large-size)
    );
  }

  .supporting-text {
    color: var(--tt-list-item-supporting-text-color, var(--md-sys-color-on-surface));
    font-size: var(
      --tt-list-item-supporting-text-font-size,
      var(--md-sys-typescale-label-medium-size)
    );
  }

  :host([indicator='none']) {
    .indicator {
      display: none;
    }
  }

  :host(:not([indicator='none'])) {
    .indicator {
      visibility: var(--_indicator-visibility);
      content-visibility: var(--_indicator-visibility);
      position: absolute;
      inset: 0;
      background: var(
        --tt-list-item-background-color,
        var(--md-sys-color-inverse-on-surface)
      );
      border-radius: var(--md-sys-shape-corner-small);
      opacity: var(--_indicator-opacity);
      z-index: -1;
      transition: opacity 600ms var(--md-sys-motion-deceleration-easing);
    }
  }

  slot[name='start']::slotted(m3e-icon),
  slot[name='end']::slotted(m3e-icon) {
    color: var(--tt-list-item-icon-color, var(--md-sys-color-on-surface));
  }

  mark {
    margin-inline: 0.04em;
    padding-inline: 0.04em;
    color: ${DesignToken.color.surface};
    background: ${TtDesignToken.color.primary};
    border-radius: ${DesignToken.shape.corner.extraSmall};
  }
`;
