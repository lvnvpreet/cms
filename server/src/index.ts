import app from './app'; // Import the configured Express app
import pool from '@config/database'; // Import the database pool (for potential checks or shutdown)
import logger from './utils/logger'; // Import the logger
import dotenv from 'dotenv';
import path from 'path';

// Ensure environment variables are loaded (redundant if app.ts/database.ts load, but safe)
dotenv.config({ path: path.resolve(__dirname, '../.env') }); // Adjust path relative to compiled index.ts

const PORT = process.env.PORT || 3000; // Default to 3000 if PORT not set

// Function to start the server
const startServer = async () => {
  try {
    // Optional: Test database connection before starting server
    const client = await pool.connect();
    logger.info('Database connection successful.');
    client.release();

    // Start listening for requests
    const server = app.listen(PORT, () => {
      logger.info(`Server listening on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Handle server errors (e.g., port already in use)
    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.syscall !== 'listen') {
        throw error;
      }
      switch (error.code) {
        case 'EACCES':
          logger.error(`Port ${PORT} requires elevated privileges.`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          logger.error(`Port ${PORT} is already in use.`);
          process.exit(1);
          break;
        default:
          throw error;
      }
    });

    // Graceful shutdown logic (optional but recommended)
    const shutdown = (signal: string) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        logger.info('HTTP server closed.');
        // Close database pool
        try {
          await pool.end();
           logger.info('Database pool closed.');
         } catch (dbError) {
           // Ensure dbError is logged as an Error object
           logger.error('Error closing database pool:', dbError instanceof Error ? dbError : new Error(String(dbError)));
         }
         process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT')); // Catches Ctrl+C

   } catch (error) {
      // Ensure the caught error is logged correctly
      const errorToLog = error instanceof Error ? error : new Error(String(error));
      logger.error('Failed to start server:', errorToLog); // Keep only the corrected log call
     process.exit(1);
   }
 };

 // Handle unhandled promise rejections
 process.on('unhandledRejection', (reason, promise) => {
     // Format the log message correctly
     const errorToLog = reason instanceof Error ? reason : new Error(String(reason));
     // Pass only the message string to the logger
     logger.error(`Unhandled Rejection: ${errorToLog.message} ${errorToLog.stack || ''}`);
     // Application specific logging, throwing an error, or other logic here
     // Consider exiting the process depending on the severity
  // process.exit(1);
});

 // Handle uncaught exceptions
 process.on('uncaughtException', (error: Error) => { // Explicitly type error as Error
   logger.error('Uncaught Exception:', error);
   // Application specific logging, throwing an error, or other logic here
   // It is generally recommended to exit the process after an uncaught exception
  process.exit(1);
});

// Start the server
startServer();
