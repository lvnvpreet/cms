/**
 * Central export point for all middleware.
 * This file imports and re-exports middleware modules for easy consumption.
 * It might also include utility functions for applying middleware stacks.
 */

// Import middleware modules
import * as authMiddleware from './auth.middleware';
import * as validationMiddleware from './validation.middleware';
import * as errorMiddleware from './error.middleware';
import * as loggingMiddleware from './logging.middleware';
import * as corsMiddleware from './cors.middleware';
import * as rateLimitMiddleware from './rate-limit.middleware';
import * as cacheMiddleware from './cache.middleware';
import * as securityMiddleware from './security.middleware';
import * as uploadMiddleware from './upload.middleware';
import * as transactionMiddleware from './transaction.middleware';

// Re-export middleware
export {
  authMiddleware,
  validationMiddleware,
  errorMiddleware,
  loggingMiddleware,
  corsMiddleware,
  rateLimitMiddleware,
  cacheMiddleware,
  securityMiddleware,
  uploadMiddleware,
  transactionMiddleware,
};

// Example utility function (optional)
// import { RequestHandler } from 'express';
// export const applyCommonMiddleware = (): RequestHandler[] => {
//   return [
//     // List common middleware instances here
//     // e.g., corsMiddleware.configureCors(), loggingMiddleware.requestLogger()
//   ];
// };

// Add actual imports and exports as middleware files are implemented. - Done
