import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
// import logger from '../utils/logger'; // Example dependency for logging

/**
 * Centralized Error Handling Middleware
 *
 * Catches errors passed via next(error) or thrown synchronously/asynchronously
 * in route handlers. Formats error responses consistently and logs errors.
 *
 * Key features:
 * - Global error catching
 * - Error logging
 * - Consistent error response format
 * - HTTP status code mapping (defaults to 500)
 * - Stack trace handling (conditional based on environment)
 * - Handling custom error types
 */

// Define a standard error response structure
interface ErrorResponse {
  message: string;
  error?: any; // Include more details in dev mode
  stack?: string; // Include stack trace in dev mode
}

export const errorHandler: ErrorRequestHandler = (
  err: any, // Error can be of any type initially
  req: Request,
  res: Response,
  next: NextFunction // next is required for Express to recognize it as error handler
): void => {
  console.error('Error Middleware: Caught an error');
  // Log the error (using a proper logger is recommended)
  // logger.error(err.message, { stack: err.stack, path: req.path, method: req.method });
  console.error('Error Details:', err); // Basic console logging

  // Determine status code
  // Use error's status code if available, otherwise default to 500
  const statusCode = typeof err.statusCode === 'number' ? err.statusCode : 500;

  // Determine if it's a known operational error or an unexpected one
  const isOperational = err.isOperational === true; // Add 'isOperational' flag to custom errors

  // Prepare response body
  const responseBody: ErrorResponse = {
    message: isOperational ? err.message : 'An unexpected internal server error occurred.',
  };

  // Include more details in development environment
  // IMPORTANT: Do not expose sensitive error details or stack traces in production!
  if (process.env.NODE_ENV === 'development') {
    responseBody.error = err; // Could be the full error object
    responseBody.stack = err.stack;
  }

  // Send the response
  res.status(statusCode).json(responseBody);

  // 'next' is not called here because the response is sent.
  // If you had multiple error handlers, you might call next(err) to pass it along.
};

// Example Custom Error class
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational; // Flag to distinguish known errors

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// You might add specific handlers for different error types (e.g., database errors)
// export const handleDatabaseError = (err, req, res, next) => { ... }
