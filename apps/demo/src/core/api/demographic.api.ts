import { Gender } from '@tt/db';

/**
 * Fetches the list of genders from the Gender enum.
 */
export const getGenders = () => {
  return Object.values(Gender) as string[];
};
