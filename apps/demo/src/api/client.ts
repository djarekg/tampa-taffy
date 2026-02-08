import api from '@tt/core/api';

const DEFAULT_API_BASE_URL = 'http://localhost:4006';

const getApiBaseUrl = () => {
  // Prefer provided env var, fallback to current default.
  return process.env.PUBLIC_API_URL || DEFAULT_API_BASE_URL;
};

export const client = api(getApiBaseUrl());
