/**
 * @fileoverview Handles client-side form and input validation.
 *
 * Provides form validation rules and helpers.
 * Contains functions to validate user inputs.
 * Includes utilities for displaying validation errors.
 * Supports custom validation logic for different form types.
 */

// TODO: Implement validation rules and helpers
// - Consider using a library like 'react-hook-form', 'formik', or 'yup' for form handling and validation schemas.
// - Define common validation functions (required, minLength, email format, etc.).
// - Create helpers for integrating validation with UI components (e.g., showing error messages).

interface ValidationResult {
  isValid: boolean;
  message?: string;
}

/**
 * Validates if a value is required (not empty).
 * @param value The value to check.
 * @param message Custom error message.
 * @returns ValidationResult object.
 */
export const validateRequired = (value: any, message: string = 'This field is required'): ValidationResult => {
  const isValid = value !== null && value !== undefined && value !== '';
  return { isValid, message: isValid ? undefined : message };
};

/**
 * Validates email format.
 * @param email The email string to validate.
 * @param message Custom error message.
 * @returns ValidationResult object.
 */
export const validateEmail = (email: string, message: string = 'Invalid email format'): ValidationResult => {
  if (!email) return { isValid: true }; // Don't validate empty optional fields, use validateRequired for mandatory ones
  // Basic regex - align with server-side or use a more robust one
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);
  return { isValid, message: isValid ? undefined : message };
};

/**
 * Validates minimum length for a string.
 * @param value The string to check.
 * @param minLength The minimum required length.
 * @param message Custom error message.
 * @returns ValidationResult object.
 */
export const validateMinLength = (value: string, minLength: number, message?: string): ValidationResult => {
    if (!value) return { isValid: true }; // Optional field
    const defaultMessage = `Must be at least ${minLength} characters long`;
    const isValid = value.length >= minLength;
    return { isValid, message: isValid ? undefined : (message || defaultMessage) };
}

// TODO: Add more validation functions (maxLength, number range, pattern matching, etc.)

/**
 * Placeholder for integrating with a form library or managing form state validation.
 * Example:
 * const validateForm = (formData, validationSchema) => {
 *   // Use Yup or Zod schema validation
 *   try {
 *     validationSchema.validateSync(formData, { abortEarly: false });
 *     return { isValid: true, errors: {} };
 *   } catch (err) {
 *     // Format errors from the validation library
 *     const errors = formatValidationErrors(err);
 *     return { isValid: false, errors };
 *   }
 * }
 */
