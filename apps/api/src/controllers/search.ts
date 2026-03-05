import prisma from '#app/db.ts';
import { isEmpty } from '@tt/core';
import {
  SearchResultTypes,
  type SearchResult,
  type SearchResultParams,
  type SearchResultType,
} from '@tt/db';

export const getSearchResults = async (req: Request) => {
  const { query, highlightStartTag, highlightEndTag } =
    (await req.json()) as SearchResultParams;

  if (isEmpty(query)) {
    return Response.json(null);
  }

  const [users, customers, customerContacts, products] = await Promise.all([
    matchTable(
      SearchResultTypes.user,
      query,
      highlightStartTag,
      highlightEndTag,
      'User_Fts',
      [
        'id',
        'firstName',
        'lastName',
        'email',
        'jobTitle',
        'streetAddress',
        'streetAddress2',
        'city',
        'phone',
      ],
    ),
    matchTable(
      SearchResultTypes.customer,
      query,
      highlightStartTag,
      highlightEndTag,
      'Customer_Fts',
      ['id', 'name', 'streetAddress', 'streetAddress2', 'city', 'phone'],
    ),
    matchTable(
      SearchResultTypes.customerContact,
      query,
      highlightStartTag,
      highlightEndTag,
      'CustomerContact_Fts',
      [
        'id',
        'customerId',
        'firstName',
        'lastName',
        'email',
        'streetAddress',
        'streetAddress2',
        'city',
        'phone',
      ],
    ),
    matchTable(
      SearchResultTypes.product,
      query,
      highlightStartTag,
      highlightEndTag,
      'Product_Fts',
      ['id', 'name', 'description', 'price'],
    ),
  ]);

  const results = [...users, ...customers, ...customerContacts, ...products];
  const sortedResults = results.sort((a, b) => a.rank - b.rank);

  return Response.json(sortedResults.length > 0 ? sortedResults : null);
};

const matchTable = async (
  type: SearchResultType,
  query: string,
  highlightStartTag: string,
  highlightEndTag: string,
  ftsTable: string,
  fields: string[],
) => {
  const sqlString = `
    SELECT
      ${buildColumnHighlightSelect(ftsTable, fields, highlightStartTag, highlightEndTag)},
      rank
    FROM ${ftsTable}
    WHERE ${ftsTable} MATCH '"${query}"'
    ORDER BY rank;
  `;

  console.log('Executing SQL query:', sqlString);

  const results = await prisma.$queryRawUnsafe<SearchResult[]>(sqlString);

  return results.map(item => ({
    type,
    rank: item.rank,
    json: JSON.stringify(item),
  }));
};

const buildColumnHighlightSelect = (
  ftsTable: string,
  fields: string[],
  highlightStartTag: string,
  highlightEndTag: string,
) => {
  return fields
    .map((field, index) => {
      // Don't apply highlighting to ID fields since they are not user-facing
      // and typically not useful to highlight. But, we do needs these for
      // building links to the actual record so we need to include them.
      if (field === 'id' || field.endsWith('Id')) {
        return field;
      }

      return `highlight(${ftsTable}, ${index}, '${highlightStartTag}', '${highlightEndTag}') AS ${field}`;
    })
    .join(', ');
};
