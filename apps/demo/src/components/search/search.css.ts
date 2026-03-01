import { TtDesignToken } from '@tt/components';
import { css } from 'lit';

export default css`
  [slot='default'] {
    --tt-link-color: ${TtDesignToken.color.secondary};
    --tt-link-gap: 1rem;

    m3e-icon {
      color: var(--tt-link-color);
    }
  }
`;
