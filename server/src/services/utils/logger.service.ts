import pino from 'pino'; // Using pino for structured, performant logging
// import { loggingConfig } from '@config/index'; // Use path alias for config - Assuming config is handled differently or default used

// Define log levels (standard levels)
type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';

/**
 * Service responsible for application logging.
 * Uses pino for structured and performant logging.
 */
export class LoggerService {
  private logger: pino.Logger;

  constructor() {
    // Define default config here, or adjust to receive config differently
    const config = {
      level: process.env.LOG_LEVEL || 'info',
      prettyPrint: process.env.NODE_ENV !== 'production',
      // Add other default config properties if needed (e.g., log file path)
      // logToFile: false,
      // logFilePath: 'app.log',
    };
    const level = config.level as LogLevel;
    const prettyPrint = config.prettyPrint;

    const options: pino.LoggerOptions = {
      level: level,
      // Base context added to all logs
      base: {
        pid: process.pid,
        // Add other base fields like service name, environment if needed
        // service: 'my-cms-backend',
        // environment: process.env.NODE_ENV || 'development',
      },
      // Timestamp format
      timestamp: pino.stdTimeFunctions.isoTime, // ISO 8601 format
      // Formatters can customize log output structure
      formatters: {
        level: (label: string) => { // Add type annotation for label
          return { level: label.toUpperCase() }; // Example: Uppercase level
        },
        // bindings: (bindings: pino.Bindings) => { // Add type annotation for bindings
        //   return { pid: bindings.pid, hostname: bindings.hostname };
        // },
      },
      // Transport for pretty printing or sending logs elsewhere (e.g., file, external service)
      transport: prettyPrint
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'SYS:standard', // More readable time format
              ignore: 'pid,hostname', // Fields to hide in pretty print
            },
          }
        : undefined, // No transport needed for default stdout JSON logging
    };

    // If logging to a file is configured
    // if (config.logToFile && config.logFilePath) {
    //   options.transport = {
    //     targets: [
    //       // Keep console output (optional)
    //       ...(prettyPrint ? [{ target: 'pino-pretty', options: { ... }, level: level }] : []),
    //       // Add file target
    //       {
    //         target: 'pino/file',
    //         options: { destination: config.logFilePath, mkdir: true }, // mkdir creates dir if not exists
    //         level: level,
    //       },
    //     ],
    //   };
    // }

    this.logger = pino(options);
    this.logger.info(`Logger initialized with level: ${level}`);
  }

  // --- Logging Methods ---

  fatal(obj: any, msg?: string, ...args: any[]): void {
    this.logger.fatal(obj, msg, ...args);
  }

  error(obj: any, msg?: string, ...args: any[]): void {
    this.logger.error(obj, msg, ...args);
  }

  warn(obj: any, msg?: string, ...args: any[]): void {
    this.logger.warn(obj, msg, ...args);
  }

  info(obj: any, msg?: string, ...args: any[]): void {
    this.logger.info(obj, msg, ...args);
  }

  debug(obj: any, msg?: string, ...args: any[]): void {
    this.logger.debug(obj, msg, ...args);
  }

  trace(obj: any, msg?: string, ...args: any[]): void {
    this.logger.trace(obj, msg, ...args);
  }

  // --- Child Loggers ---

  /**
   * Creates a child logger with additional bound context.
   * @param bindings - An object containing properties to bind to the child logger.
   * @returns A child pino logger instance.
   */
  child(bindings: pino.Bindings): pino.Logger {
    return this.logger.child(bindings);
  }

  // Add other methods as needed:
  // - Log rotation configuration (often handled by transport or external tools like logrotate)
  // - Alert triggering based on specific log messages/levels (might integrate with monitoring systems)
  // - Environment-specific logging configurations (handled in constructor)
}

// Export a singleton instance
export const logger = new LoggerService().child({ service: 'cms-main' }); // Example child logger

// Optionally export the class for dependency injection scenarios
// export { LoggerService };
