// server/config/index.ts

import pool from './database'; // Default export
import { authConfig } from './auth'; // Named export
import { storageConfig } from './storage'; // Named export
import { corsConfig } from './cors'; // Named export
import logger, { stream as loggerStream } from './logging'; // Default and named export

// Re-export all configurations
export {
  pool as dbPool, // Rename pool to dbPool for clarity if desired
  authConfig,
  storageConfig,
  corsConfig,
  logger,
  loggerStream,
};

// You could also export them individually or group them differently
// export const database = pool;
// export const auth = authConfig;
// ...

// Log that configurations are loaded (optional)
logger.info('Configurations loaded successfully.');
