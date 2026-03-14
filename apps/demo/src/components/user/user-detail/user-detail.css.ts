import { css } from 'lit';

export default css`
  header {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 1rem;
    font-size: 0.5em;
    font-weight: 300;
    color: var(--tt-color-label-info);
  }

  tt-card {
    padding: 1rem;

    section {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      > div {
        display: flex;
        align-items: center;
        gap: 2rem;

        m3e-form-field {
          --md-sys-density-scale: -3;
          --md-sys-density-size: 0.6rem;

          flex: 1;
        }
      }
    }
  }
`;
