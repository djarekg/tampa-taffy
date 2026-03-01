import type { SearchResultType } from '#app/constants/search-result-type.ts';

export type SearchResult = {
  id: string;
  itemId: string;
  type: SearchResultType;
  name: string;
  description: string;
  url: string;
  rank: number;
};
