import { css } from 'lit';

export default css`
  :host {
    /* Set global defaults. This allows for using in calculations. */
    --tt-list-padding-block: 8px;

    --_background-color: var(--tt-list-background-color, transparent);
    --_padding-block: var(--tt-list-padding-block);
  }

  ul {
    list-style: none;
    margin: 0;
    padding-inline: 8px;
    padding-block: var(--_padding-block);
    background: var(--_background-color);
  }
`;
