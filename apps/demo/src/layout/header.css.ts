import { css } from 'lit';

export default css`
  header {
    display: grid;
    grid-template-columns: 200px 1fr 200px;
    grid-template-areas: 'a b c';
    block-size: var(--app-header-height);
    padding-inline: 1rem;
  }

  .image {
    grid-area: a;
    display: flex;
    align-items: center;

    img {
      transform: scale(0.8);
      will-change: transform;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.03) rotate(60deg);
      }
    }
  }

  .title {
    grid-area: b;
    display: grid;
    color: #38eaa0;
    place-content: center;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--tt-color-primary);
  }

  .menu {
    grid-area: c;
    display: flex;
    justify-content: end;
    align-items: center;

    svg {
      cursor: pointer;
    }
  }
`;
