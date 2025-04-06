/**
 * @fileoverview Handles response formatting for consistent API outputs.
 *
 * Standardizes API response structures.
 * Provides data transformation helpers.
 * Contains utilities for pagination formatting.
 * Includes functions to format different data types for responses.
 */

// TODO: Implement specific formatting functions as needed.

/**
 * Standard success response format.
 * @param data The data payload to include in the response.
 * @param message Optional success message.
 * @returns A standardized success response object.
 */
export const formatSuccessResponse = (data: any, message: string = 'Success') => {
  return {
    status: 'success',
    message,
    data,
  };
};

/**
 * Standard error response format (can leverage errors.ts).
 * @param message The error message.
 * @param statusCode HTTP status code.
 * @param details Optional additional error details.
 * @returns A standardized error response object.
 */
export const formatErrorResponse = (message: string, statusCode: number, details?: any) => {
  return {
    status: 'error',
    statusCode,
    message,
    ...(details && { details }), // Include details if provided
  };
};


/**
 * Formats data for paginated responses.
 * @param items The array of items for the current page.
 * @param totalItems Total number of items across all pages.
 * @param currentPage The current page number.
 * @param itemsPerPage Number of items per page.
 * @returns A pagination response object.
 */
export const formatPaginatedResponse = (
    items: any[],
    totalItems: number,
    currentPage: number,
    itemsPerPage: number
) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    return {
        status: 'success',
        data: items,
        pagination: {
            currentPage,
            itemsPerPage,
            totalItems,
            totalPages,
            hasNextPage: currentPage < totalPages,
            hasPreviousPage: currentPage > 1,
        },
    };
};


// TODO: Add specific data transformation helpers
// Example: Formatting user data to exclude sensitive fields
// export const formatUserData = (user: any) => {
//   const { password, ...userData } = user;
//   return userData;
// };

// TODO: Add functions to format specific data types if needed (e.g., dates)
// export const formatDateISO = (date: Date): string => date.toISOString();
