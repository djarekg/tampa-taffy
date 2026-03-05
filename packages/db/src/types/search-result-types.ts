export type UserSearchResult = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  rank: number;
};

export type CustomerSearchResult = {
  id: string;
  name: string;
  rank: number;
};

export type CustomerContactSearchResult = {
  id: string;
  customerId: string;
  firstName: string;
  lastName: string;
  email: string;
  rank: number;
};

export type ProductSearchResult = {
  id: string;
  name: string;
  description: string;
  rank: number;
};
