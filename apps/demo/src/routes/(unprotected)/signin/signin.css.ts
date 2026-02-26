import { css } from 'lit';

export default css`
  :host {
    display: flex;
    justify-content: center;
    block-size: 100%;
  }

  form {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 16px;
    inline-size: 300px;
    block-size: fit-content;
    margin-block-start: 1rem;
    border-radius: var(--md-sys-shape-corner-large);
    background-color: var(--md-sys-color-surface-container-low);
  }

  input {
    background: transparent;
    border: none;
    outline: none;
  }

  .title {
    text-align: center;
  }

  .error {
    color: var(--md-sys-color-error);
    font-size: 0.875rem;
  }

  m3e-form-field,
  m3e-button {
    inline-size: 100%;
  }

  .password-hint {
    display: flex;
    justify-content: end;
    margin-block-start: 4px;

    tt-link {
      --tt-link-font-size: 1em;
    }
  }

  .account-actions {
    display: flex;
    justify-content: center;
    gap: 4px;
    margin-block-start: 8px;

    tt-link {
      --tt-link-font-weight: 300;
    }
  }

  .ghost-icon {
    width: 24px;
    height: 24px;
    margin-left: 8px;
    color: var(--md-sys-color-primary);
  }
`;
