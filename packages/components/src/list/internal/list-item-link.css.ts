import { css } from 'lit';

export default css`
  :host([indicator='underline']) {
    --_text-decoration: none;

    a {
      &:hover {
        --tt-list-item-headline-color: var(--md-sys-color-accent);
        --_text-decoration: underline;

        color: var(--tt-list-item-headline-color);
        text-underline-offset: 3px;
      }
    }
  }

  a {
    display: flex;
    align-items: center;
    text-decoration: var(--_text-decoration);
    padding: 0.6rem 1rem;
    color: inherit;
  }
`;
