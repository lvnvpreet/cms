import { Request, Response, NextFunction } from 'express';
// import dbConnection from '../db/connection'; // Example: Assuming a db connection object/pool
// import { Transaction } from 'sequelize'; // Example: Sequelize transaction type

/**
 * Transaction Middleware
 *
 * Manages database transactions for incoming requests.
 * Aims to ensure atomicity for operations within a single request lifecycle.
 *
 * Features:
 * - Starts a transaction at the beginning of the request (or before specific routes).
 * - Commits the transaction if the request handler completes successfully.
 * - Rolls back the transaction if an error occurs during request processing.
 * - Attaches the transaction object to the request for use in controllers/services.
 * - Handles cleanup.
 *
 * NOTE: The exact implementation depends heavily on the database library/ORM used.
 * This is a conceptual placeholder.
 */

// Extend Express Request type to include transaction property
declare global {
  namespace Express {
    interface Request {
      dbTransaction?: any; // Define a more specific type based on your DB library (e.g., Transaction)
    }
  }
}

/**
 * Middleware to manage database transactions per request.
 */
export const manageTransaction = async (req: Request, res: Response, next: NextFunction) => {
  console.log('Transaction Middleware: Starting transaction management for request.');
  let transaction: any = null; // Placeholder for the transaction object

  try {
    // Start a transaction (replace with your DB library's method)
    // transaction = await dbConnection.beginTransaction(); // Example
    console.log('Transaction Middleware: Transaction started (placeholder).');

    // Attach transaction to the request object
    req.dbTransaction = transaction;

    // Listen for response finish/close events to commit or rollback
    const finishHandler = async () => {
      removeListeners();
      if (res.statusCode >= 200 && res.statusCode < 300 && transaction) {
        // Commit transaction on success
        try {
          // await transaction.commit(); // Example
          console.log('Transaction Middleware: Transaction committed (placeholder).');
        } catch (commitError) {
          console.error('Transaction Middleware: Failed to commit transaction:', commitError);
          // Optional: Decide how to handle commit errors (e.g., log)
        }
      } else if (transaction) {
        // Rollback transaction on error or client disconnect
        try {
          // await transaction.rollback(); // Example
          console.log(`Transaction Middleware: Transaction rolled back due to status ${res.statusCode} or connection close (placeholder).`);
        } catch (rollbackError) {
          console.error('Transaction Middleware: Failed to rollback transaction:', rollbackError);
        }
      }
    };

    const errorHandler = async (err: Error) => {
      removeListeners();
      if (transaction) {
        try {
          // await transaction.rollback(); // Example
          console.error('Transaction Middleware: Rolling back transaction due to error:', err);
        } catch (rollbackError) {
          console.error('Transaction Middleware: Failed to rollback transaction after error:', rollbackError);
        }
      }
      // Ensure the error is passed to the next error handler
      // Note: This might interfere with the global error handler if not careful
      // next(err); // Re-throwing might be handled by the global error handler already
    };

    const removeListeners = () => {
      res.off('finish', finishHandler);
      res.off('close', finishHandler); // Handle client disconnects
      res.off('error', errorHandler); // Handle errors on the response stream itself
    };

    res.on('finish', finishHandler);
    res.on('close', finishHandler);
    res.on('error', errorHandler);

    next(); // Proceed to the next middleware/route handler

  } catch (error) {
    console.error('Transaction Middleware: Failed to start transaction:', error);
    // If transaction couldn't even start, pass the error along
    next(error);
  }
};

console.log('Transaction Middleware: Configuration loaded.');
