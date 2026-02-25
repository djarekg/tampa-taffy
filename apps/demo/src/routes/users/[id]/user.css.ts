import { css } from 'lit';

export default css`
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
  }

  tt-card {
    section {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      > div {
        display: flex;
        align-items: center;
        gap: 2rem;

        m3e-form-field {
          flex: 1;
        }
      }
    }
  }
`;
