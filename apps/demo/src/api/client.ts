// import api from '@tt/core/api';

// const DEFAULT_API_BASE_URL = 'http://localhost:4006';

// const getApiBaseUrl = () => {
//   // Prefer provided env var, fallback to current default.
//   return process.env.PUBLIC_API_URL || DEFAULT_API_BASE_URL;
// };

// export const client = api(getApiBaseUrl());
import api from '@tt/core/api';

const DEFAULT_API_BASE_URL = 'http://localhost:4006';

const getApiBaseUrl = () => {
  // Prefer Vite-provided env var, fallback to current default.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { VITE_API_URL } = (import.meta as any).env as { VITE_API_URL?: string };
  return VITE_API_URL || DEFAULT_API_BASE_URL;
};

export const client = api(getApiBaseUrl());
