/**
 * @fileoverview Handles data formatting for display.
 *
 * Formats dates, times, and durations.
 * Provides number formatting utilities (currency, percentages).
 * Contains text formatting helpers.
 * Includes utilities for formatting different data types for UI display.
 */

// TODO: Implement specific formatting functions as needed.
// - Consider using libraries like 'date-fns', 'moment', or Intl API for robust date/time/number formatting.

/**
 * Formats a date object into a readable string (e.g., "April 6, 2025").
 * @param date The Date object or a date string/number.
 * @param options Intl.DateTimeFormat options.
 * @returns A formatted date string.
 */
export const formatDate = (
    date: Date | string | number | undefined | null,
    options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
): string => {
    if (!date) return '';
    try {
        const dateObj = typeof date === 'object' ? date : new Date(date);
        return new Intl.DateTimeFormat('en-US', options).format(dateObj);
    } catch (error) {
        console.error("Error formatting date:", error);
        return 'Invalid Date';
    }
};

/**
 * Formats a number as currency (e.g., "$1,234.56").
 * @param amount The number to format.
 * @param currency The currency code (e.g., 'USD', 'EUR', 'INR'). Defaults to 'USD'.
 * @param options Intl.NumberFormat options.
 * @returns A formatted currency string.
 */
export const formatCurrency = (
    amount: number | undefined | null,
    currency: string = 'USD',
    options: Intl.NumberFormatOptions = { style: 'currency', currency }
): string => {
    if (amount === null || amount === undefined) return '';
    try {
        return new Intl.NumberFormat('en-US', options).format(amount);
    } catch (error) {
        console.error("Error formatting currency:", error);
        return 'Invalid Amount';
    }
};

/**
 * Formats a number as a percentage (e.g., "75%").
 * @param value The number to format (e.g., 0.75 for 75%).
 * @param options Intl.NumberFormat options.
 * @returns A formatted percentage string.
 */
export const formatPercentage = (
    value: number | undefined | null,
    options: Intl.NumberFormatOptions = { style: 'percent', minimumFractionDigits: 0, maximumFractionDigits: 2 }
): string => {
    if (value === null || value === undefined) return '';
     try {
        return new Intl.NumberFormat('en-US', options).format(value);
    } catch (error) {
        console.error("Error formatting percentage:", error);
        return 'Invalid Value';
    }
};

/**
 * Truncates text to a maximum length and adds ellipsis.
 * @param text The text to truncate.
 * @param maxLength The maximum number of characters allowed.
 * @returns The truncated text with ellipsis, or the original text if shorter.
 */
export const truncateText = (text: string | undefined | null, maxLength: number): string => {
    if (!text) return '';
    if (text.length <= maxLength) {
        return text;
    }
    return text.substring(0, maxLength).trimEnd() + '...';
};

// TODO: Add more formatters as needed (e.g., relative time, file size).
