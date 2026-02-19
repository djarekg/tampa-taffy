import { css } from 'lit';

export default css`
  :host {
    --_font-size: var(--tt-link-font-size, 0.875rem);
    --_font-weight: var(--tt-link-font-weight, 400);
    --_color: var(--tt-link-color, var(--md-sys-color-primary));
  }

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
    font-size: var(--_font-size);
    font-weight: var(--_font-weight);
    color: var(--_color);
    text-decoration: none;
    text-underline-offset: 3px;

    &:hover {
      text-decoration: underline;
    }
  }
`;
