import type { SearchResultType } from '#app/constants/index.ts';

export type SearchResultItem = {
  id: string;
  itemId: string;
  type: SearchResultType;
  url: string;
  labelHtml: string | null;
  subLabelHtml?: string | null;
};
