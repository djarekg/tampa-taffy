import { css } from 'lit';

export default css`
  :host {
    --_background-color: var(
      --tt-card-background-color,
      var(--md-sys-color-surface-container)
    );
    --_border-color: var(--tt-card-border-color, var(--md-sys-color-outline));
    --_box-shadow: var(--tt-card-elevation, var(--md-sys-elevation-4));

    display: flex;
    flex-direction: column;
    background: var(--_background-color);
    border-width: var(--tt-card-border-width, 1px);
    border-style: var(--tt-card-border-style, solid);
    border-color: var(--_border-color);
    border-radius: var(--tt-card-corner, var(--md-sys-shape-corner-large));
    box-shadow: var(--_box-shadow);
    padding: var(--tt-card-padding, 1rem);
    overflow: hidden;
  }

  :host([variant='filled']) {
    --_background-color: var(--md-sys-color-surface-container-low);
    --_border-color: transparent;
    --_box-shadow: none;
  }

  :host([variant='outlined']) {
    --_background-color: transparent;
    --_border-color: var(--md-sys-color-outline);
    --_box-shadow: none;
  }

  :host([variant='elevated']) {
    --_background-color: var(--md-sys-color-surface-container-low);
    --_border-color: transparent;
    --_box-shadow: var(--md-sys-elevation-4);
  }
`;
