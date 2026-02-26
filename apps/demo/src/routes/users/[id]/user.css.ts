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

  .page-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    block-size: 100%;
    padding: var(--tt-page-padding);
  }

  .user-content {
    justify-content: flex-start;
    gap: 2rem;
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
