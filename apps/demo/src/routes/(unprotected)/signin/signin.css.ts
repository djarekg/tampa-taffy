import { css } from 'lit';

export default css`
  :host {
    display: grid;
    place-content: center;
    block-size: 100%;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 16px;
    inline-size: 300px;
    background-color: var(--md-sys-color-surface-container-low);
    border-radius: var(--md-sys-shape-corner-large);
  }

  input {
    background: transparent;
    border: none;
    outline: none;
  }
`;
