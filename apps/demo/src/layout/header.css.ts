import { TtDesignToken } from '@tt/components';
import { css } from 'lit';

export default css`
  :host {
    --_breadcrumbs-gutter-height: 50px;
    --_header-height: calc(
      var(--app-header-height) - var(--_breadcrumbs-gutter-height)
    );
    position: sticky;
    inset-block-start: 0;
    z-index: 100;
  }

  header {
    display: grid;
    grid-template-columns: 300px 1fr 300px;
    grid-template-areas: 'a b c';
    block-size: var(--_header-height);
    padding-inline: 1rem;
    backdrop-filter: blur(4px);
  }

  .breadcrumbs-gutter {
    display: flex;
    align-items: flex-start;
    block-size: var(--_breadcrumbs-gutter-height);
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
    color: ${TtDesignToken.color.secondary};
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
