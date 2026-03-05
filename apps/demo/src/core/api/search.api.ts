import { isEmpty } from '@tt/core';
import type { SearchResult } from '@tt/db/types';

import { client } from './client';

const HIGHLIGHT_START_TAG = '<π>';
const HIGHLIGHT_END_TAG = '</π>';

/**
 * Search for users, customers, customer contacts, and products
 * based on the query string.
 *
 * @param query The search query string.
 * @return A promise that resolves to an array of search results or
 * null if no results are found.
 */
export const search = async (query: string) => {
  if (isEmpty(query)) {
    return null;
  }

  const { post } = client;
  const results = await post<SearchResult[]>(`/search`, {
    query,
    highlightStartTag: HIGHLIGHT_START_TAG,
    highlightEndTag: HIGHLIGHT_END_TAG,
  });

  return results;
};

// const parseResults = (
//   results: SearchResult[],
// ): SearchResultItem[] | undefined => {
//   // const items = result.hits as unknown as SearchResult[];
//   return results.map(result => {
//     return {
//       id: result.id,
//       itemId: result.itemId,
//       type: result.type,
//       url: result.url,
//       labelHtml: parseLabelToHtml(result.name || ''),
//       subLabelHtml: parseLabelToHtml(result.description || ''),
//     };
//   });
// };
