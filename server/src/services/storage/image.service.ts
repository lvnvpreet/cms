import sharp from 'sharp'; // Image processing library
import { StorageService, storageService } from './storage.service'; // Assuming singleton export
import path from 'path';
import fs from 'fs/promises';

// Define interfaces for image processing options
// interface ResizeOptions {
//   width?: number;
//   height?: number;
//   fit?: keyof sharp.FitEnum; // e.g., 'cover', 'contain', 'fill', 'inside', 'outside'
//   position?: string | number; // e.g., 'top', 'right top', 'centre', 'entropy', 'attention'
//   background?: sharp.Color; // Background color for 'contain' or 'embed' fit
// }

// interface OptimizationOptions {
//   quality?: number; // 1-100
//   format?: keyof sharp.FormatEnum; // e.g., 'jpeg', 'png', 'webp', 'avif'
//   lossless?: boolean; // For webp, png
//   progressive?: boolean; // For jpeg
// }

/**
 * Service responsible for image transformations and optimizations.
 * Relies on an underlying StorageService for file access.
 */
export class ImageService {
  private storage: StorageService;

  constructor(storageSvc: StorageService) {
    this.storage = storageSvc;
    // Check if sharp is installed and working
    if (typeof sharp !== 'function') {
        console.warn('Sharp library might not be properly installed or available.');
    }
  }

  /**
   * Resizes an image stored in the storage service.
   * @param sourceStoragePath - The path of the original image in storage.
   * @param targetStoragePath - The path where the resized image should be saved in storage.
   * @param options - Resize options (width, height, fit, etc.).
   * @returns A promise resolving to the storage path of the resized image.
   */
  async resizeImage(
    sourceStoragePath: string,
    targetStoragePath: string,
    options: any /* Replace 'any' with ResizeOptions */
  ): Promise<string> {
    console.log(`Resizing image ${sourceStoragePath} to ${targetStoragePath} with options:`, options);
    try {
      const imageBuffer = await this.storage.getFile(sourceStoragePath);
      const sharpInstance = sharp(imageBuffer);

      sharpInstance.resize({
        width: options.width,
        height: options.height,
        fit: options.fit || 'cover', // Default fit strategy
        position: options.position,
        background: options.background,
      });

      const resizedBuffer = await sharpInstance.toBuffer();

      // Upload the resized buffer to a temporary path first
      const tempFilePath = path.join(process.cwd(), `temp_resized_${Date.now()}${path.extname(targetStoragePath)}`); // Use OS temp dir ideally
      await fs.writeFile(tempFilePath, resizedBuffer);

      // Use storage service to upload the temp file
      const finalPath = await this.storage.uploadFile({
          filePath: tempFilePath,
          destinationPath: targetStoragePath,
          contentType: `image/${path.extname(targetStoragePath).substring(1)}` // Infer content type
      });

      return finalPath; // Return the final storage path/URL from storage service

    } catch (error) {
      console.error(`Error resizing image ${sourceStoragePath}:`, error);
      throw new Error(`Failed to resize image: ${sourceStoragePath}`);
    }
  }

  /**
   * Optimizes an image stored in the storage service.
   * @param sourceStoragePath - The path of the original image in storage.
   * @param targetStoragePath - The path where the optimized image should be saved.
   * @param options - Optimization options (quality, format, etc.).
   * @returns A promise resolving to the storage path of the optimized image.
   */
  async optimizeImage(
    sourceStoragePath: string,
    targetStoragePath: string,
    options: any /* Replace 'any' with OptimizationOptions */ = {}
  ): Promise<string> {
    console.log(`Optimizing image ${sourceStoragePath} to ${targetStoragePath} with options:`, options);
    try {
      const imageBuffer = await this.storage.getFile(sourceStoragePath);
      let sharpInstance = sharp(imageBuffer);

      const targetFormat = options.format || path.extname(sourceStoragePath).substring(1).toLowerCase() as keyof sharp.FormatEnum;

      switch (targetFormat) {
        case 'jpeg':
        case 'jpg':
          sharpInstance = sharpInstance.jpeg({
            quality: options.quality || 80,
            progressive: options.progressive ?? true,
          });
          break;
        case 'png':
          sharpInstance = sharpInstance.png({
            quality: options.quality || 90, // Higher quality for lossless/near-lossless
            compressionLevel: options.lossless ? 9 : 6, // Adjust compression based on lossless flag
            progressive: false, // Not applicable to PNG
          });
          break;
        case 'webp':
          sharpInstance = sharpInstance.webp({
            quality: options.quality || 75,
            lossless: options.lossless ?? false,
          });
          break;
        case 'avif':
           sharpInstance = sharpInstance.avif({
             quality: options.quality || 50, // AVIF often needs lower quality number for similar perception
             lossless: options.lossless ?? false,
           });
           break;
        // Add other formats like gif, tiff if needed
        default:
          console.warn(`Unsupported target format for optimization: ${targetFormat}. Keeping original format.`);
          // Optionally just copy the file or apply generic settings
          break;
      }

      const optimizedBuffer = await sharpInstance.toBuffer();

      // Upload the optimized buffer to a temporary path first
      const tempFilePath = path.join(process.cwd(), `temp_optimized_${Date.now()}${path.extname(targetStoragePath)}`); // Use OS temp dir ideally
      await fs.writeFile(tempFilePath, optimizedBuffer);

       // Use storage service to upload the temp file
       const finalPath = await this.storage.uploadFile({
        filePath: tempFilePath,
        destinationPath: targetStoragePath,
        contentType: `image/${targetFormat}`
      });

      return finalPath; // Return the final storage path/URL

    } catch (error) {
      console.error(`Error optimizing image ${sourceStoragePath}:`, error);
      throw new Error(`Failed to optimize image: ${sourceStoragePath}`);
    }
  }

  /**
   * Retrieves image metadata (dimensions, format, etc.).
   * @param storagePath - The path of the image in storage.
   * @returns A promise resolving to the image metadata.
   */
  async getImageMetadata(storagePath: string): Promise<sharp.Metadata> {
    console.log(`Getting metadata for image ${storagePath}`);
    try {
      const imageBuffer = await this.storage.getFile(storagePath);
      const metadata = await sharp(imageBuffer).metadata();
      return metadata;
    } catch (error) {
      console.error(`Error getting metadata for image ${storagePath}:`, error);
      throw new Error(`Failed to get metadata for image: ${storagePath}`);
    }
  }
}

// Export an instance, injecting the storage service instance
export const imageService = new ImageService(storageService);
