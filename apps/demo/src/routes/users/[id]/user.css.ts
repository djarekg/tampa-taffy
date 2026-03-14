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
    gap: 2rem;
  }
`;
