import fs from 'fs/promises';
import path from 'path';
import { storageConfig } from '@config/index'; // Use path alias for config
// Import necessary SDKs if using cloud storage
// import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner"; // For generating temporary URLs

// Define interfaces for storage configuration and options
// interface StorageProviderConfig {
//   type: 'local' | 'aws' | 'gcp' | 'azure';
//   basePath?: string; // For local storage
//   bucketName?: string; // For cloud storage
//   region?: string;
//   accessKeyId?: string;
//   secretAccessKey?: string;
//   // Add other provider-specific config
// }

// interface FileUploadOptions {
//   filePath: string; // Path to the temporary uploaded file
//   destinationPath: string; // Desired path within the storage (relative)
//   contentType?: string;
//   acl?: string; // Access control (e.g., 'public-read')
// }

// interface FileInfo {
//   path: string;
//   size: number;
//   lastModified: Date;
//   url?: string; // Public URL if applicable
// }

/**
 * Service responsible for managing file storage (local or cloud).
 */
export class StorageService {
  private readonly config: any; // Replace 'any' with StorageProviderConfig
  // private readonly storageClient: any; // Instance of the storage provider's client (e.g., S3Client)

  constructor() {
    this.config = storageConfig; // Assuming storageConfig is exported from config/index
    // Initialize the storage client based on config.type
    if (this.config.type === 'local') {
      if (!this.config.basePath) {
        throw new Error('Local storage requires a basePath configuration.');
      }
      console.log(`Initializing Local Storage Service at: ${this.config.basePath}`);
      // No specific client needed for local, just use fs/promises
    } else if (this.config.type === 'aws') {
      // this.storageClient = new S3Client({ region: this.config.region, credentials: { ... } });
      console.warn('AWS S3 Storage Service is using placeholder implementation.');
    } else {
      throw new Error(`Unsupported storage provider type: ${this.config.type}`);
    }
  }

  /**
   * Uploads a file to the configured storage.
   * @param options - Options for the file upload.
   * @returns A promise resolving to the public URL or storage path of the uploaded file.
   */
  async uploadFile(options: any /* Replace 'any' with FileUploadOptions */): Promise<string> {
    const finalDestination = this.getStoragePath(options.destinationPath);
    console.log(`Uploading file from ${options.filePath} to ${finalDestination}`);

    if (this.config.type === 'local') {
      try {
        await fs.mkdir(path.dirname(finalDestination), { recursive: true });
        await fs.rename(options.filePath, finalDestination); // Move the temp file
        // Return a relative path or construct a URL if served publicly
        return this.getPublicUrl(options.destinationPath);
      } catch (error) {
        console.error('Error uploading file locally:', error);
        // Attempt to clean up the temporary file if rename failed
        await fs.unlink(options.filePath).catch(e => console.error('Failed to delete temp file:', e));
        throw new Error(`Failed to upload file to local storage: ${options.destinationPath}`);
      }
    } else if (this.config.type === 'aws') {
      // Placeholder for AWS S3 upload
      // const fileStream = await fs.readFile(options.filePath);
      // const command = new PutObjectCommand({
      //   Bucket: this.config.bucketName,
      //   Key: options.destinationPath,
      //   Body: fileStream,
      //   ContentType: options.contentType || 'application/octet-stream',
      //   ACL: options.acl || 'private',
      // });
      // await this.storageClient.send(command);
      // await fs.unlink(options.filePath); // Delete temp file after successful upload
      // return this.getPublicUrl(options.destinationPath);
      console.warn(`AWS upload for ${options.destinationPath} not implemented.`);
      await fs.unlink(options.filePath).catch(e => console.error('Failed to delete temp file:', e));
      return this.getPublicUrl(options.destinationPath); // Placeholder URL
    } else {
      throw new Error('Upload not implemented for this storage type.');
    }
  }

  /**
   * Retrieves a file from storage.
   * @param storagePath - The relative path of the file in storage.
   * @returns A promise resolving to the file content (e.g., as a Buffer).
   */
  async getFile(storagePath: string): Promise<Buffer> {
    const fullPath = this.getStoragePath(storagePath);
    console.log(`Getting file from ${fullPath}`);

    if (this.config.type === 'local') {
      try {
        return await fs.readFile(fullPath);
      } catch (error: any) {
        if (error.code === 'ENOENT') {
          throw new Error(`File not found in local storage: ${storagePath}`);
        }
        console.error('Error reading file locally:', error);
        throw new Error(`Failed to retrieve file from local storage: ${storagePath}`);
      }
    } else if (this.config.type === 'aws') {
      // Placeholder for AWS S3 get
      // const command = new GetObjectCommand({ Bucket: this.config.bucketName, Key: storagePath });
      // const response = await this.storageClient.send(command);
      // return Buffer.from(await response.Body.transformToByteArray()); // Requires Node 18+ stream handling
      console.warn(`AWS get for ${storagePath} not implemented.`);
      throw new Error('File retrieval not implemented for AWS storage.');
    } else {
      throw new Error('Get file not implemented for this storage type.');
    }
  }

  /**
   * Deletes a file from storage.
   * @param storagePath - The relative path of the file in storage.
   * @returns A promise resolving when the deletion is complete.
   */
  async deleteFile(storagePath: string): Promise<void> {
    const fullPath = this.getStoragePath(storagePath);
    console.log(`Deleting file from ${fullPath}`);

    if (this.config.type === 'local') {
      try {
        await fs.unlink(fullPath);
      } catch (error: any) {
        if (error.code === 'ENOENT') {
          console.warn(`File not found for deletion: ${storagePath}`);
          return; // Ignore if file doesn't exist
        }
        console.error('Error deleting file locally:', error);
        throw new Error(`Failed to delete file from local storage: ${storagePath}`);
      }
    } else if (this.config.type === 'aws') {
      // Placeholder for AWS S3 delete
      // const command = new DeleteObjectCommand({ Bucket: this.config.bucketName, Key: storagePath });
      // await this.storageClient.send(command);
      console.warn(`AWS delete for ${storagePath} not implemented.`);
    } else {
      throw new Error('Delete file not implemented for this storage type.');
    }
  }

  /**
   * Lists files within a specific directory in storage.
   * @param directoryPath - The relative path of the directory in storage.
   * @returns A promise resolving to an array of file information objects.
   */
  async listFiles(directoryPath: string = ''): Promise<any[] /* Replace 'any' with FileInfo */> {
    const fullPath = this.getStoragePath(directoryPath);
    console.log(`Listing files in ${fullPath}`);

    if (this.config.type === 'local') {
      try {
        const entries = await fs.readdir(fullPath, { withFileTypes: true });
        const filesInfo = await Promise.all(
          entries.filter(e => e.isFile()).map(async (entry) => {
            const entryPath = path.join(fullPath, entry.name);
            const stats = await fs.stat(entryPath);
            const relativePath = path.join(directoryPath, entry.name).replace(/\\/g, '/');
            return {
              path: relativePath,
              size: stats.size,
              lastModified: stats.mtime,
              url: this.getPublicUrl(relativePath),
            };
          })
        );
        return filesInfo;
      } catch (error: any) {
        if (error.code === 'ENOENT') {
          return []; // Directory doesn't exist, return empty list
        }
        console.error('Error listing files locally:', error);
        throw new Error(`Failed to list files in local storage: ${directoryPath}`);
      }
    } else if (this.config.type === 'aws') {
      // Placeholder for AWS S3 list
      // const command = new ListObjectsV2Command({ Bucket: this.config.bucketName, Prefix: directoryPath });
      // const response = await this.storageClient.send(command);
      // return response.Contents?.map(obj => ({
      //   path: obj.Key,
      //   size: obj.Size,
      //   lastModified: obj.LastModified,
      //   url: this.getPublicUrl(obj.Key),
      // })) || [];
      console.warn(`AWS list for ${directoryPath} not implemented.`);
      return [];
    } else {
      throw new Error('List files not implemented for this storage type.');
    }
  }

  /**
   * Generates a public URL for a file in storage.
   * @param storagePath - The relative path of the file in storage.
   * @param expiresInSeconds - Optional duration for temporary signed URLs (for private files).
   * @returns The public or signed URL.
   */
  async getPublicUrl(storagePath: string, expiresInSeconds?: number): Promise<string> {
    if (this.config.type === 'local') {
      // Construct URL based on how local files are served (e.g., via a static file server)
      // This requires knowing the base URL where files are exposed.
      const publicBaseUrl = process.env.LOCAL_STORAGE_PUBLIC_URL || '/uploads'; // Example base URL
      return `${publicBaseUrl}/${storagePath.replace(/\\/g, '/')}`;
    } else if (this.config.type === 'aws') {
      // Generate pre-signed URL for private objects or construct public URL for public objects
      // if (expiresInSeconds) {
      //   const command = new GetObjectCommand({ Bucket: this.config.bucketName, Key: storagePath });
      //   return await getSignedUrl(this.storageClient, command, { expiresIn: expiresInSeconds });
      // } else {
      //   // Construct public URL (depends on bucket settings and region)
      //   return `https://${this.config.bucketName}.s3.${this.config.region}.amazonaws.com/${storagePath}`;
      // }
      console.warn(`AWS getPublicUrl for ${storagePath} not implemented.`);
      return `https://placeholder-bucket.s3.region.amazonaws.com/${storagePath}`; // Placeholder
    } else {
      throw new Error('Get public URL not implemented for this storage type.');
    }
  }

  /**
   * Gets the absolute path for a relative storage path based on config.
   */
  private getStoragePath(relativePath: string): string {
    if (this.config.type === 'local') {
      // Prevent path traversal attacks
      const safeSuffix = path.normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, '');
      return path.join(this.config.basePath, safeSuffix);
    }
    // For cloud storage, the relative path is often used directly as the Key/Blob name
    return relativePath;
  }

  // Add other methods as needed:
  // - Directory management (create, delete)
  // - Access control management
  // - File transformation (might belong in a separate service like ImageService)
  // - Cleanup procedures
}

// Export an instance or the class depending on DI strategy
export const storageService = new StorageService();
