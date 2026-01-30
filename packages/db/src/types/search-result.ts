import type { SearchResultType } from '#app/constants';

export type SearchResult = {
  id: string;
  type: SearchResultType;
  name: string;
  description?: string;
};
