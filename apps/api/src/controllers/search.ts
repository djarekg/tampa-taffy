import prisma from '#app/db.ts';
import type { SearchResult, SearchResultParams } from '@tt/db';
import { SearchResultTypes } from '@tt/db/constants';
import { randomUUID } from 'crypto';

type UserSearch = {
  id: string;
  firstname: string;
  lastname: string;
  rank: number;
};

type CustomerSearch = {
  id: string;
  name: string;
  rank: number;
};

type CustomerContactSearch = {
  id: string;
  customerid: string;
  firstname: string;
  lastname: string;
  rank: number;
};

type ProductSearch = {
  id: string;
  name: string;
  description: string;
  rank: number;
};

export const getSearchResults = async (req: Request) => {
  // oxlint-disable-next-line typescript/no-explicit-any
  const { query, highlightPreTag, highlightPostTag } = (req as any)
    .body as SearchResultParams;
  const highlightOptionString = `StartSel = ${highlightPreTag}, StopSel = ${highlightPostTag}`;

  const [users, customers, customerContacts, products] = await Promise.all([
    getUsers(query, highlightOptionString),
    getCustomers(query, highlightOptionString),
    getCustomerContacts(query, highlightOptionString),
    getProducts(query, highlightOptionString),
  ]);

  const results = [
    ...users,
    ...customers,
    ...customerContacts,
    ...products,
  ] as SearchResult[];
  const sortedResults = results.sort((a, b) => a.rank - b.rank);

  return Response.json(sortedResults.length > 0 ? sortedResults : null);
};

const getUsers = async (query: string, highlightOption: string) => {
  const users = await prisma.$queryRawUnsafe<UserSearch[]>(`
      select "id",
      ts_headline("firstName" , to_tsquery('english', '${query}'), '${highlightOption}') as firstName,
      ts_headline("lastName" , to_tsquery('english', '${query}'), '${highlightOption}') as lastName,
      case
        when ts_rank(to_tsvector('english', "firstName"), to_tsquery('english', '${query}'))
          > ts_rank(to_tsvector('english', "lastName"), to_tsquery('english', '${query}'))
          then ts_rank(to_tsvector('english', "firstName"), to_tsquery('english', '${query}'))
        else ts_rank(to_tsvector('english', "lastName"), to_tsquery('english', '${query}'))
      end as rank
      from "User"
      where to_tsvector('english', "firstName") @@ to_tsquery('english', '${query}')
        or to_tsvector('english', "lastName") @@ to_tsquery('english', '${query}')
      order by rank desc nulls last
    `);

  return users.map(user => ({
    id: randomUUID(),
    itemId: user.id,
    type: SearchResultTypes.user,
    name: `${user.firstname} ${user.lastname}`,
    description: null,
    url: `/users/${user.id}`,
    rank: user.rank,
  }));
};

const getCustomers = async (query: string, highlightOption: string) => {
  const customers = await prisma.$queryRawUnsafe<CustomerSearch[]>(`
      select "id",
      ts_headline("name" , to_tsquery('english', '${query}'), '${highlightOption}') as name,
      ts_rank(to_tsvector('english', "name"), to_tsquery('english', '${query}')) as rank
      from "Customer"
      where to_tsvector('english', "name") @@ to_tsquery('english', '${query}')
      order by rank desc nulls last
    `);

  return customers.map(customer => ({
    id: randomUUID(),
    itemId: customer.id,
    type: SearchResultTypes.customer,
    name: customer.name,
    description: null,
    url: `/customers/${customer.id}`,
    rank: customer.rank,
  }));
};

const getCustomerContacts = async (query: string, highlightOption: string) => {
  const contacts = await prisma.$queryRawUnsafe<CustomerContactSearch[]>(`
      select "id",
      "customerId",
      ts_headline("firstName" , to_tsquery('english', '${query}'), '${highlightOption}') as firstName,
      ts_headline("lastName" , to_tsquery('english', '${query}'), '${highlightOption}') as lastName,
      case
        when ts_rank(to_tsvector('english', "firstName"), to_tsquery('english', '${query}'))
          > ts_rank(to_tsvector('english', "lastName"), to_tsquery('english', '${query}'))
          then ts_rank(to_tsvector('english', "firstName"), to_tsquery('english', '${query}'))
        else ts_rank(to_tsvector('english', "lastName"), to_tsquery('english', '${query}'))
      end as rank
      from "CustomerContact"
      where to_tsvector('english', "firstName") @@ to_tsquery('english', '${query}')
        or to_tsvector('english', "lastName") @@ to_tsquery('english', '${query}')
      order by rank desc nulls last
    `);

  return contacts.map(contact => ({
    id: randomUUID(),
    itemId: contact.id,
    type: SearchResultTypes.customerContact,
    name: `${contact.firstname} ${contact.lastname}`,
    description: null,
    url: `/customers/${contact.customerid}/contacts/${contact.id}`,
    rank: contact.rank,
  }));
};

const getProducts = async (query: string, highlightOption: string) => {
  const products = await prisma.$queryRawUnsafe<ProductSearch[]>(`
      select "id",
      ts_headline("name" , to_tsquery('english', '${query}'), '${highlightOption}') as name,
      ts_headline("description" , to_tsquery('english', '${query}'), '${highlightOption}') as description,
      case
        when ts_rank(to_tsvector('english', "name"), to_tsquery('english', '${query}'))
          > ts_rank(to_tsvector('english', "description"), to_tsquery('english', '${query}'))
          then ts_rank(to_tsvector('english', "name"), to_tsquery('english', '${query}'))
        else ts_rank(to_tsvector('english', "description"), to_tsquery('english', '${query}'))
      end as rank
      from "Product"
      where to_tsvector('english', "name") @@ to_tsquery('english', '${query}')
        or to_tsvector('english', "description") @@ to_tsquery('english', '${query}')
      order by rank desc nulls last
    `);

  return products.map(product => ({
    id: randomUUID(),
    itemId: product.id,
    type: SearchResultTypes.product,
    name: product.name,
    description: product.description,
    url: `/products/${product.id}`,
    rank: product.rank,
  }));
};
