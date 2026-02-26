/**
 * Formats a Date object into a string in the format "YYYY-MM-DD".
 * @param date - The Date object to format.
 * @returns A string representing the formatted date.
 */
export const formatDate = (date: Date) => {
  const year = date.getFullYear();
  // getMonth() is zero-indexed (0 is January), so add 1
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`; // Example: "2025-02-18"
};
