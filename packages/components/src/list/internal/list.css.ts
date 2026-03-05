import { css } from 'lit';

export default css`
  :host {
    --_list-gap: var(--tt-list-gap, 0);
    --_list-flex-direction: column;
  }

  :host([alignment='horizontal']) {
    --_list-flex-direction: row;
  }

  :host([alignment='horizontal']) ul {
    display: flex;
  }

  ul {
    display: flex;
    flex-direction: var(--_list-flex-direction);
    gap: var(--_list-gap);
    list-style: none;
    margin: 0;
    padding: 0;
    background: var(--tt-list-background-color, transparent);
  }
`;
