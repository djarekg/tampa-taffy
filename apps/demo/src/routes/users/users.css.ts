import { css } from 'lit';

export default css`
  .page-content {
    display: grid;
    place-content: center;
    block-size: 100%;
  }

  .user-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    inline-size: 100%;
    padding: var(--app-page-padding) calc(var(--app-page-padding) * 2);
    box-sizing: border-box;
  }

  tt-card {
    block-size: 125px;
    gap: 0.8rem;

    &:hover {
      transform: scale(1.02);
    }

    .header {
      --m3e-icon-size: 28px;

      display: flex;
      align-items: flex-end;
      gap: 1rem;

      m3e-icon[female] {
        color: var(--tt-color-pink);
      }

      m3e-icon[male] {
        color: var(--tt-color-secondary);
      }
    }

    .fullname {
      font-size: var(--md-sys-typescale-title-medium-size);
      font-weight: var(--md-sys-typescale-title-medium-weight);
    }

    .content {
      --m3e-icon-size: 14px;

      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      block-size: 100%;
      color: var(--tt-color-on-surface-label);
      font-size: var(--md-sys-typescale-body-small-size);
      font-weight: var(--md-sys-typescale-body-small-weight);

      & > div {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      m3e-icon {
        color: var(--tt-color-icon-secondary);
        /* color: var(--m3e-color-on-surface); */
      }
    }
  }
`;
