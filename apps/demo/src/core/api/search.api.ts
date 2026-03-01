import type { SearchResult } from '@tt/db/types';

import { client } from './client';

/**
 * Search for users, customers, customer contacts, and products
 * based on the query string.
 *
 * @param query The search query string.
 * @return A promise that resolves to an array of search results or
 * null if no results are found.
 */
export const search = async (query: string) => {
  const { get } = client;
  const results = await get<SearchResult[]>(
    `/search/${encodeURIComponent(query)}`,
  );
  return results;
};
