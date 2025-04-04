import { Request } from 'express';
import multer, { FileFilterCallback, MulterError } from 'multer';
import path from 'path';
import fs from 'fs';
// import config from '../../config'; // Example for storage path config

/**
 * Upload Middleware
 *
 * Handles file uploads using the 'multer' package.
 *
 * Features:
 * - File size limits
 * - File type validation (MIME type filtering)
 * - Storage configuration (disk storage example)
 * - Filename sanitization/generation
 * - Multipart form handling
 * - Error handling for upload issues
 */

// Define the destination directory for uploads
// Ensure this directory exists or create it beforehand
const UPLOAD_DIR = path.resolve(__dirname, '../../public/uploads'); // Example path
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  console.log(`Upload Middleware: Created upload directory at ${UPLOAD_DIR}`);
}

// Configure disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR); // Save files to the defined upload directory
  },
  filename: (req, file, cb) => {
    // Generate a unique filename to avoid collisions
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const sanitizedOriginalName = file.originalname
      .replace(/[^a-zA-Z0-9._-]/g, '_') // Sanitize original name
      .substring(0, 100); // Limit length
    // Example filename: originalname-timestamp-random.ext
    cb(null, `${path.basename(sanitizedOriginalName, extension)}-${uniqueSuffix}${extension}`);
  }
});

// Define file filter (example: allow only images)
const imageFileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  console.log(`Upload Middleware: Filtering file - ${file.originalname} (${file.mimetype})`);
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Accept file
  } else {
    console.warn(`Upload Middleware: Rejected file type - ${file.mimetype}`);
    // Reject file with a specific error message
    cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'Only image files are allowed!'));
  }
};

// Configure Multer instance with storage, limits, and filter
const uploadImage = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB file size limit
  },
  fileFilter: imageFileFilter
});

// Middleware for handling single file upload (e.g., 'avatar' field)
export const handleSingleImageUpload = (fieldName: string) => {
  console.log(`Upload Middleware: Setting up single upload for field "${fieldName}"`);
  return uploadImage.single(fieldName);
};

// Middleware for handling multiple file uploads (e.g., 'gallery' field, max 10 files)
export const handleMultipleImageUpload = (fieldName: string, maxCount: number = 10) => {
  console.log(`Upload Middleware: Setting up multiple upload for field "${fieldName}" (max: ${maxCount})`);
  return uploadImage.array(fieldName, maxCount);
};

// You can create other multer instances for different file types or limits

console.log('Upload Middleware: Configuration loaded.');

// Note: You'll need to handle MulterErrors specifically in your route handlers
// or in the global error handler (error.middleware.ts) to provide user-friendly messages.
// Example in global error handler:
// if (err instanceof multer.MulterError) {
//   if (err.code === 'LIMIT_FILE_SIZE') {
//     return res.status(400).json({ message: 'File is too large.' });
//   }
//   if (err.code === 'LIMIT_UNEXPECTED_FILE') {
//     return res.status(400).json({ message: 'Invalid file type.' });
//   }
//   // Handle other multer errors
// }
