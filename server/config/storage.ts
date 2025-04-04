import dotenv from 'dotenv';
import path from 'path';

dotenv.config(); // Load environment variables from .env file

// Determine the base directory for storage relative to the project root
// Assumes the config file is in server/config/ and the project root is 'server/'
const projectRoot = path.resolve(__dirname, '../..'); // Adjust if structure differs

export const storageConfig = {
  provider: process.env.STORAGE_PROVIDER || 'local', // 'local', 's3', 'gcs', etc.

  local: {
    // Default path relative to the project root (e.g., server/public/uploads)
    uploadPath: process.env.LOCAL_UPLOAD_PATH
      ? path.resolve(process.env.LOCAL_UPLOAD_PATH) // Absolute path if provided
      : path.join(projectRoot, 'public', 'uploads'), // Default relative path
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10) * 1024 * 1024, // Max file size in bytes (default 10MB)
  },

  // Example S3 configuration (add if needed)
  // s3: {
  //   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  //   region: process.env.AWS_REGION,
  //   bucket: process.env.AWS_S3_BUCKET,
  //   endpoint: process.env.AWS_S3_ENDPOINT, // Optional: for S3-compatible storage
  //   maxFileSize: parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10) * 1024 * 1024,
  // },

  // Add other provider configurations (GCS, Azure Blob, etc.) as needed
};

// Basic validation (can be expanded)
if (storageConfig.provider === 's3') {
  // if (!storageConfig.s3?.accessKeyId || !storageConfig.s3?.secretAccessKey || !storageConfig.s3?.region || !storageConfig.s3?.bucket) {
  //   console.warn('WARNING: S3 storage provider selected, but required S3 configuration (keys, region, bucket) is missing in environment variables.');
  // }
}

// Ensure the local upload directory exists (optional, could be handled by the storage service)
// import fs from 'fs';
// if (storageConfig.provider === 'local' && !fs.existsSync(storageConfig.local.uploadPath)) {
//   try {
//     fs.mkdirSync(storageConfig.local.uploadPath, { recursive: true });
//     console.log(`Created local upload directory: ${storageConfig.local.uploadPath}`);
//   } catch (err) {
//     console.error(`Error creating local upload directory: ${storageConfig.local.uploadPath}`, err);
//   }
// }
