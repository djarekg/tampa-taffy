import { css } from 'lit';

export default css`
  :host([alignment='horizontal']) ul {
    display: flex;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    background: var(--tt-list-background-color, transparent);
  }
`;
