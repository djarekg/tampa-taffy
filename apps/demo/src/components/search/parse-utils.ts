import type { CommandPaletteResultItem } from '@tt/components/command-palette';
import { SearchResultTypes } from '@tt/db/constants';
import type {
  CustomerContactSearchResult,
  CustomerSearchResult,
  ProductSearchResult,
  SearchResult,
  UserSearchResult,
} from '@tt/db/types';

const HIGHLIGHT_START_TAG = '<π>';
const HIGHLIGHT_END_TAG = '</π>';

const deserializeUserSearchResult = ({ json }: SearchResult) => {
  const { id, firstName, lastName, email, jobTitle } = JSON.parse(
    json,
  ) as UserSearchResult;

  return {
    href: `/users/${id}`,
    icon: 'person',
    headline: `
      <span>${formatHighlighting(firstName)} ${formatHighlighting(lastName)}</span>
      <span><m3e-icon name="label"></m3e-icon> ${formatHighlighting(jobTitle)}</span>
    `,
    supportingText: `
      <span><m3e-icon name="email"></m3e-icon> ${formatHighlighting(email)}</span>
    `,
  } as CommandPaletteResultItem;
};

const deserializeCustomerSearchResult = ({ json }: SearchResult) => {
  const { id, name } = JSON.parse(json) as CustomerSearchResult;

  return {
    href: `/customers/${id}`,
    icon: 'identify_platform',
    headline: `<span>${formatHighlighting(name)}</span>`,
  } as CommandPaletteResultItem;
};

const deserializeCustomerContactSearchResult = ({ json }: SearchResult) => {
  const { id, customerId, firstName, lastName, email } = JSON.parse(
    json,
  ) as CustomerContactSearchResult;

  return {
    href: `/customers/${customerId}/contacts/${id}`,
    icon: 'account_box',
    headline: `
      <span>${formatHighlighting(firstName)} ${formatHighlighting(lastName)}</span>
    `,
    supportingText: `
      <span><m3e-icon name="email"></m3e-icon> ${formatHighlighting(email)}</span>
    `,
  } as CommandPaletteResultItem;
};

const deserializeProductSearchResult = ({ json }: SearchResult) => {
  const { id, name, description } = JSON.parse(json) as ProductSearchResult;

  return {
    href: `/products/${id}`,
    icon: 'package_2',
    headline: `<span>${formatHighlighting(name)}</span>`,
    supportingText: `
      <span><m3e-icon name="text_ad"></m3e-icon> ${formatHighlighting(description)}</span>
    `,
  } as CommandPaletteResultItem;
};

const deserializeSearchResults = {
  [SearchResultTypes.user]: deserializeUserSearchResult,
  [SearchResultTypes.customer]: deserializeCustomerSearchResult,
  [SearchResultTypes.customerContact]: deserializeCustomerContactSearchResult,
  [SearchResultTypes.product]: deserializeProductSearchResult,
};

/**
 * Parses the raw search results from the API into an HTML format that can be consumed.
 */
export const parseSearchResults = (results: SearchResult[]) => {
  return results.map(result => deserializeSearchResults[result.type](result));
};

/**
 * Replaces the placeholder tags in the search result fields with
 * actual HTML tags for highlighting.
 */
const formatHighlighting = (field: string | null): string | null => {
  if (field === null) {
    return null;
  }

  const formattedField = field
    .replaceAll(HIGHLIGHT_START_TAG, '<mark>')
    .replaceAll(HIGHLIGHT_END_TAG, '</mark>')
    // Replace regular spaces with non-breaking spaces to prevent trailing
    // spaces from being collapsed
    .replaceAll(' ', '&nbsp;');

  return formattedField === '' ? null : formattedField;
};
