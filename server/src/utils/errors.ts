/**
 * @fileoverview Defines custom error classes and error handling utilities.
 *
 * Contains standard error classes (BadRequestError, NotFoundError, AuthenticationError, etc.).
 * Provides functions to generate consistent error responses.
 * Includes utilities to format errors for API responses.
 * Helps maintain consistent error handling across the application.
 */

// Base class for custom application errors
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational; // Distinguishes operational errors from programming errors
    Object.setPrototypeOf(this, new.target.prototype); // Restore prototype chain
    Error.captureStackTrace(this, this.constructor); // Capture stack trace
  }
}

// Specific error classes
export class BadRequestError extends AppError {
  constructor(message: string = 'Bad Request') {
    super(message, 400);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication Failed') {
    super(message, 401);
  }
}

export class AuthorizationError extends AppError {
    constructor(message: string = 'Forbidden') {
        super(message, 403);
    }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource Not Found') {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
    constructor(message: string = 'Conflict') {
        super(message, 409);
    }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'Internal Server Error') {
    super(message, 500, false); // Typically not operational
  }
}

// TODO: Implement error formatting and response generation utilities
// - Function to format error for API response (e.g., { status: 'error', message: '...' })
// - Centralized error handling middleware might use these classes

/**
 * Formats an error object into a standard API error response.
 * @param err The error object.
 * @returns A formatted error response object.
 */
export const formatErrorResponse = (err: Error | AppError) => {
  if (err instanceof AppError && err.isOperational) {
    return {
      status: 'error',
      statusCode: err.statusCode,
      message: err.message,
    };
  }

  // Log unexpected errors for debugging
  console.error('UNEXPECTED ERROR:', err);

  // Generic response for non-operational or unknown errors
  return {
    status: 'error',
    statusCode: 500,
    message: 'An unexpected error occurred. Please try again later.',
  };
};
