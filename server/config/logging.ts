import winston from 'winston';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config(); // Load environment variables

const LOG_LEVEL = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug');
const LOG_DIR = process.env.LOG_DIR || path.join(__dirname, '../../logs'); // Default log directory relative to project root

// Ensure log directory exists (optional, winston can create it)
// import fs from 'fs';
// if (!fs.existsSync(LOG_DIR)) {
//   try {
//     fs.mkdirSync(LOG_DIR, { recursive: true });
//   } catch (err) {
//     console.error('Error creating log directory:', err);
//   }
// }

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }), // Log stack traces for errors
  winston.format.splat(), // Interpolate splat (%s, %d, %j) messages
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
  })
);

// Define transports (where logs are sent)
const transports: winston.transport[] = [
  // Console transport (always enabled, but level depends on environment)
  new winston.transports.Console({
    level: LOG_LEVEL,
    format: winston.format.combine(
      winston.format.colorize(), // Add colors for console output
      logFormat
    ),
  }),
];

// Add file transports for production environment
if (process.env.NODE_ENV === 'production') {
  transports.push(
    new winston.transports.File({
      level: 'info', // Log info, warn, error to combined file
      filename: path.join(LOG_DIR, 'combined.log'),
      format: logFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
  transports.push(
    new winston.transports.File({
      level: 'error', // Log only errors to error file
      filename: path.join(LOG_DIR, 'error.log'),
      format: logFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
} else {
    // Optionally add a debug file transport for development
    transports.push(
        new winston.transports.File({
          level: 'debug',
          filename: path.join(LOG_DIR, 'debug.log'),
          format: logFormat,
          maxsize: 5242880, // 5MB
          maxFiles: 1, // Keep only the latest debug log
        })
      );
}

// Create the logger instance
const logger = winston.createLogger({
  level: LOG_LEVEL, // Minimum log level to process
  levels: winston.config.npm.levels, // Use standard npm logging levels (error, warn, info, http, verbose, debug, silly)
  format: logFormat, // Default format if not specified in transport
  transports: transports,
  exitOnError: false, // Do not exit on handled exceptions
});

// Stream for morgan (HTTP request logging)
export const stream = {
  write: (message: string) => {
    // Use the 'http' level for morgan logs
    logger.http(message.trim());
  },
};

export default logger;
