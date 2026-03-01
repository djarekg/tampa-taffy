import { DesignToken } from '@m3e/web/core';
import { css } from 'lit';

import { TtDesignToken } from '../../tokens';

export default css`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  dialog {
    position: fixed;
    inset-block-start: calc(-100% + var(--app-header-height) * 2);
    display: flex;
    flex-direction: column;
    gap: 1em;
    padding: 0;
    inline-size: 70vw;
    block-size: fit-content;
    background: transparent;
    border: none;
    outline: none;
    overflow: hidden;
    opacity: 0;
    transition: opacity 0.7s ease-out;
    /* transform: scaleY(0);
    transition:
      opacity 0.7s ease-out,
      transform 0.7s ease-out,
      overlay 0.7s ease-out allow-discrete,
      display 0.7s ease-out allow-discrete; */

    &:open {
      opacity: 1;
      transform: scaleY(1);

      @starting-style {
        background: transparent;
      }
    }

    &::backdrop {
      background: hsl(228 11% 10% / 0.8);
      transition:
        display 0.7s allow-discrete,
        overlay 0.7s allow-discrete,
        background 0.7s;
    }

    @starting-style {
      opacity: 0;
      transform: scaleY(0);
    }
  }

  header {
    --_input-color: hsl(0 0% 100% / 0.3);

    position: relative;
    block-size: 50px;
    border: 2px solid ${TtDesignToken.color.primary};
    border-radius: ${DesignToken.shape.corner.small};
    background: ${DesignToken.color.surface};
    box-shadow: ${DesignToken.elevation.level3};

    m3e-icon {
      position: absolute;
      inset-inline-end: 0.9rem;
      inset-block-start: 0.6rem;
      color: var(--_input-color);
    }

    input {
      inline-size: 100%;
      block-size: 100%;
      padding: 0.5em;
      font-size: 1em;
      border: none;
      outline: none;
      background: transparent;
      padding-inline-start: 0.9rem;

      &::placeholder {
        color: var(--_input-color);
      }
    }
  }

  .default-content {
    padding: 1rem;
  }
`;
