/**
 * @fileoverview Contains general-purpose helper functions.
 *
 * Provides common utility functions (string manipulation, date formatting).
 * Contains file handling utilities.
 * Includes object and array manipulation helpers.
 * Has general-purpose functions that don't fit other categories.
 */

// TODO: Add specific helper functions as needed throughout development.

/**
 * Capitalizes the first letter of a string.
 * @param str The input string.
 * @returns The string with the first letter capitalized.
 */
export const capitalizeFirstLetter = (str: string | undefined | null): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Simple date formatting (example).
 * @param date The Date object to format.
 * @param formatString The format string (e.g., 'YYYY-MM-DD').
 * @returns A formatted date string.
 */
export const formatDate = (date: Date, formatString: string = 'YYYY-MM-DD'): string => {
  // Basic implementation - consider using a library like date-fns or moment for robust formatting
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  let formatted = formatString;
  formatted = formatted.replace('YYYY', year.toString());
  formatted = formatted.replace('MM', month);
  formatted = formatted.replace('DD', day);
  // Add more replacements (HH, mm, ss) if needed

  return formatted;
};

/**
 * Generates a random string of a given length.
 * @param length The desired length of the random string.
 * @returns A random alphanumeric string.
 */
export const generateRandomString = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};


/**
 * Delays execution for a specified number of milliseconds.
 * @param ms The number of milliseconds to wait.
 * @returns A promise that resolves after the delay.
 */
export const delay = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// TODO: Add file handling utilities (e.g., readFileAsync, writeFileAsync) if needed.
// TODO: Add object/array manipulation helpers (e.g., deepClone, groupBy) if needed.
