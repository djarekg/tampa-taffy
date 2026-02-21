import { css } from 'lit';

export default css`
  header {
    display: grid;
    grid-template-columns: 300px 1fr 300px;
    grid-template-areas: 'a b c';
    block-size: var(--app-header-height);
    padding-inline: 1rem;
  }

  .image {
    grid-area: a;
    display: inline-flex;
    align-items: center;

    &:hover {
      img {
        transform: scale(1.03) rotate(60deg);
      }
    }

    a {
      display: inline-flex;
      align-items: center;
      flex: 0 0 auto;
      gap: 0.7rem;
      text-decoration: none;
      inline-size: fit-content;
    }

    img {
      transform: scale(0.8);
      will-change: transform;
      transition: transform 0.3s ease;
    }
  }

  .title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--m3e-color-on-surface);
  }

  .site-menu {
    grid-area: b;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .settings-nav-button {
    grid-area: c;
    display: flex;
    justify-content: end;
    align-items: center;

    svg {
      cursor: pointer;
    }
  }

  m3e-icon-button {
    --m3e-icon-button-medium-icon-size: 2rem;
  }
`;
