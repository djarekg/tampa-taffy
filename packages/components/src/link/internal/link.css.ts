import { css } from 'lit';

export default css`
  :host([color='primary']) {
    --_color: var(--md-sys-color-primary);
  }

  :host([color='secondary']) {
    --_color: var(--md-sys-color-secondary);
  }

  :host([color='error']) {
    --_color: var(--md-sys-color-error);
  }

  a {
    font-size: var(--tt-link-font-size, 0.875rem);
    font-weight: var(--tt-link-font-weight, 400);
    color: var(--tt-link-color, var(--md-sys-color-primary));
    text-decoration: none;
    text-underline-offset: 3px;

    &:hover {
      text-decoration: underline;
    }
  }
`;
