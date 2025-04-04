// Import necessary services (SiteService, StorageService) and utilities
import { siteService } from './site.service';
import { storageService } from '../storage/storage.service';
import fs from 'fs/promises';
import path from 'path';
import archiver from 'archiver'; // For creating zip archives
import { createReadStream, createWriteStream } from 'fs';
// import { pipeline } from 'stream/promises'; // For stream piping

// Define interfaces for backup options, status, etc.
// interface BackupOptions {
//   siteId: string;
//   includeMedia?: boolean; // Whether to include uploaded media files
//   backupName?: string; // Custom name for the backup
//   storagePathPrefix?: string; // Where to store backups in the storage service
// }

// interface RestoreOptions {
//   siteId: string; // Target site ID to restore into (might create new if doesn't exist)
//   backupStoragePath: string; // Path to the backup file in storage
//   overwrite?: boolean; // Whether to overwrite existing site data
// }

// interface BackupInfo {
//   id: string; // Unique ID for the backup
//   siteId: string;
//   timestamp: Date;
//   storagePath: string; // Path in the storage service
//   size?: number;
//   status: 'pending' | 'running' | 'completed' | 'failed';
//   error?: string;
// }

/**
 * Service responsible for site backup and restoration.
 */
export class BackupService {
  private readonly defaultStoragePrefix = 'backups';

  constructor() {
    // Initialize dependencies
  }

  /**
   * Creates a backup of a specific site.
   * @param options - Options for the backup process.
   * @returns A promise resolving to information about the created backup.
   */
  async createBackup(options: any /* Replace 'any' with BackupOptions */): Promise<any /* Replace 'any' with BackupInfo */> {
    const siteId = options.siteId;
    console.log(`Starting backup for site: ${siteId}`);
    const timestamp = new Date();
    const backupId = `backup-${siteId}-${timestamp.toISOString().replace(/[:.]/g, '-')}`;
    const backupName = options.backupName || `${siteId}-backup-${timestamp.toLocaleDateString().replace(/\//g, '-')}.zip`;
    const storagePathPrefix = options.storagePathPrefix || this.defaultStoragePrefix;
    const finalStoragePath = path.join(storagePathPrefix, siteId, backupName).replace(/\\/g, '/');

    const backupInfo: any /* BackupInfo */ = {
      id: backupId,
      siteId: siteId,
      timestamp: timestamp,
      storagePath: finalStoragePath,
      status: 'running',
    };

    // Use a temporary directory for staging backup files
    const tempBackupDir = path.join(process.cwd(), 'temp_backups', backupId); // Use OS temp dir ideally

    try {
      await fs.mkdir(tempBackupDir, { recursive: true });

      // 1. Fetch site data (structure, settings, pages, etc.)
      // This might involve calling SiteService or directly querying the database
      const siteData = await siteService.getSiteById(siteId); // Example
      if (!siteData) throw new Error(`Site not found: ${siteId}`);
      // Fetch site structure, pages, components etc. based on your data model
      const siteStructure = { /* ... fetch site structure ... */ };

      // 2. Serialize site data (e.g., to JSON files)
      await fs.writeFile(path.join(tempBackupDir, 'site_data.json'), JSON.stringify(siteData, null, 2));
      await fs.writeFile(path.join(tempBackupDir, 'site_structure.json'), JSON.stringify(siteStructure, null, 2));
      console.log('Serialized site data and structure.');

      // 3. Optionally include media files
      if (options.includeMedia) {
        console.log('Including media files...');
        // Copy media files from storage service to temp backup dir
        // This is complex if media is in cloud storage - might need to download first
        // Assuming media is stored relative to a site ID in storageService
        const mediaFiles = await storageService.listFiles(`media/${siteId}`); // Example path structure
        const mediaDir = path.join(tempBackupDir, 'media');
        await fs.mkdir(mediaDir, { recursive: true });
        for (const fileInfo of mediaFiles) {
          try {
            const fileBuffer = await storageService.getFile(fileInfo.path);
            await fs.writeFile(path.join(mediaDir, path.basename(fileInfo.path)), fileBuffer);
          } catch (mediaError) {
             console.warn(`Could not include media file ${fileInfo.path} in backup:`, mediaError);
          }
        }
        console.log('Media files included.');
      }

      // 4. Create a compressed archive (e.g., zip)
      const tempZipPath = path.join(process.cwd(), 'temp_backups', `${backupId}.zip`); // Temp zip location
      await this.createZipArchive(tempBackupDir, tempZipPath);
      console.log(`Created temporary archive: ${tempZipPath}`);

      // 5. Upload the archive to the storage service
      const uploadedPath = await storageService.uploadFile({
        filePath: tempZipPath,
        destinationPath: finalStoragePath,
        contentType: 'application/zip',
      });
      console.log(`Backup archive uploaded to: ${uploadedPath}`);

      // 6. Update backup status and info
      backupInfo.status = 'completed';
      const stats = await fs.stat(tempZipPath);
      backupInfo.size = stats.size;

      // Optionally, record backup info in a database
      // await backupQueries.create(backupInfo);

      return backupInfo;

    } catch (error: any) {
      console.error(`Backup failed for site ${siteId}:`, error);
      backupInfo.status = 'failed';
      backupInfo.error = error.message;
      // Optionally record failure in DB
      // await backupQueries.update(backupInfo.id, { status: 'failed', error: error.message });
      throw new Error(`Backup creation failed for site ${siteId}: ${error.message}`);
    } finally {
      // 7. Clean up temporary files/directories
      await fs.rm(tempBackupDir, { recursive: true, force: true }).catch(e => console.error('Failed to clean temp backup dir:', e));
      await fs.unlink(path.join(process.cwd(), 'temp_backups', `${backupId}.zip`)).catch(e => console.error('Failed to clean temp zip file:', e));
      console.log('Cleaned up temporary backup files.');
    }
  }

  /**
   * Restores a site from a backup.
   * @param options - Options for the restoration process.
   * @returns A promise resolving when restoration is complete.
   */
  async restoreFromBackup(options: any /* Replace 'any' with RestoreOptions */): Promise<void> {
    const { siteId, backupStoragePath, overwrite = false } = options;
    console.log(`Starting restore for site ${siteId} from backup: ${backupStoragePath}`);

    // Use a temporary directory for extracting backup files
    const tempExtractDir = path.join(process.cwd(), 'temp_restores', `restore-${siteId}-${Date.now()}`);

    try {
      // 1. Check if target site exists and handle overwrite logic
      const existingSite = await siteService.getSiteById(siteId);
      if (existingSite && !overwrite) {
        throw new Error(`Site ${siteId} already exists. Use overwrite option to replace.`);
      }
      if (!existingSite && overwrite) {
         console.warn(`Target site ${siteId} does not exist, cannot overwrite. Proceeding with creation/restore.`);
      }

      // 2. Download the backup archive from storage
      const backupBuffer = await storageService.getFile(backupStoragePath);
      const tempZipPath = path.join(process.cwd(), 'temp_restores', path.basename(backupStoragePath));
      await fs.writeFile(tempZipPath, backupBuffer);
      console.log(`Downloaded backup archive to: ${tempZipPath}`);

      // 3. Extract the archive
      await fs.mkdir(tempExtractDir, { recursive: true });
      await this.extractZipArchive(tempZipPath, tempExtractDir); // Implement extraction logic
      console.log(`Extracted backup archive to: ${tempExtractDir}`);

      // 4. Read deserialized data (site_data.json, site_structure.json)
      const siteDataBuffer = await fs.readFile(path.join(tempExtractDir, 'site_data.json'));
      const siteStructureBuffer = await fs.readFile(path.join(tempExtractDir, 'site_structure.json'));
      const restoredSiteData = JSON.parse(siteDataBuffer.toString());
      const restoredSiteStructure = JSON.parse(siteStructureBuffer.toString());
      console.log('Read site data and structure from backup.');

      // 5. Restore site data (update or create site in DB)
      // Ensure the restored data uses the target siteId if overwriting
      restoredSiteData.id = siteId; // Overwrite ID
      // Remove fields that shouldn't be restored directly (like createdAt)
      delete restoredSiteData.createdAt;
      restoredSiteData.updatedAt = new Date();

      if (existingSite) {
        await siteService.updateSite(siteId, restoredSiteData); // Update existing
      } else {
        // Need a way to create a site with specific data (might need adjustment in SiteService)
        // await siteService.createSite({ ...restoredSiteData, ownerId: existingSite?.ownerId || 'UNKNOWN' }); // Need owner info
        console.warn(`Site creation from backup data needs implementation in SiteService.`);
      }
      // Restore site structure (update pages, components etc.)
      // await siteStructureService.updateStructure(siteId, restoredSiteStructure);
      console.log(`Restored site data and structure for site: ${siteId}`);

      // 6. Restore media files (if included in backup)
      const mediaDir = path.join(tempExtractDir, 'media');
      try {
        await fs.access(mediaDir); // Check if media directory exists
        console.log('Restoring media files...');
        // Clear existing media for the site first? (Optional)
        // await storageService.deleteDirectory(`media/${siteId}`);
        const mediaFiles = await fs.readdir(mediaDir);
        for (const fileName of mediaFiles) {
          const tempFilePath = path.join(mediaDir, fileName);
          const destinationPath = `media/${siteId}/${fileName}`; // Example path
          await storageService.uploadFile({ filePath: tempFilePath, destinationPath });
        }
        console.log('Media files restored.');
      } catch (e) {
         console.log('No media directory found in backup or error accessing it.');
      }

      console.log(`Restore completed successfully for site: ${siteId}`);

    } catch (error: any) {
      console.error(`Restore failed for site ${siteId}:`, error);
      throw new Error(`Restore failed: ${error.message}`);
    } finally {
      // 7. Clean up temporary files/directories
      await fs.rm(tempExtractDir, { recursive: true, force: true }).catch(e => console.error('Failed to clean temp restore dir:', e));
      await fs.unlink(path.join(process.cwd(), 'temp_restores', path.basename(backupStoragePath))).catch(e => console.error('Failed to clean temp zip file:', e));
      console.log('Cleaned up temporary restore files.');
    }
  }

  /**
   * Lists available backups for a site.
   * @param siteId - The ID of the site.
   * @returns A promise resolving to an array of backup information objects.
   */
  async listBackups(siteId: string): Promise<any[] /* Replace 'any' with BackupInfo */> {
    console.log(`Listing backups for site: ${siteId}`);
    const storagePathPrefix = path.join(this.defaultStoragePrefix, siteId).replace(/\\/g, '/');

    // List files in the storage service under the site's backup prefix
    // This might require filtering by name convention or reading metadata if stored in DB
    const files = await storageService.listFiles(storagePathPrefix);

    // Map storage file info to BackupInfo structure (basic mapping)
    return files.map(file => ({
      id: path.basename(file.path, '.zip'), // Infer ID from filename
      siteId: siteId,
      timestamp: file.lastModified,
      storagePath: file.path,
      size: file.size,
      status: 'completed', // Assume completed if listed
    }));
  }

  /**
   * Helper to create a zip archive from a directory.
   */
  private createZipArchive(sourceDir: string, outPath: string): Promise<void> {
    const archive = archiver('zip', { zlib: { level: 9 } });
    const stream = createWriteStream(outPath);

    return new Promise((resolve, reject) => {
      archive
        .directory(sourceDir, false)
        .on('error', err => reject(err))
        .pipe(stream);

      stream.on('close', () => resolve());
      archive.finalize();
    });
  }

   /**
   * Helper to extract a zip archive. Requires an extraction library like 'extract-zip' or 'unzipper'.
   * Placeholder implementation.
   */
   private async extractZipArchive(zipPath: string, outDir: string): Promise<void> {
     console.warn('Zip extraction requires an external library (e.g., extract-zip) and is not implemented.');
     // Example using extract-zip (install it first: npm install extract-zip)
     // try {
     //   const extract = require('extract-zip');
     //   await extract(zipPath, { dir: outDir });
     // } catch (err) {
     //   console.error('Extraction failed:', err);
     //   throw new Error('Failed to extract backup archive.');
     // }
   }

  // Add other methods as described:
  // - Scheduled backup configuration
  // - Backup storage management (e.g., retention policies, cleanup)
  // - Version handling for backups
  // - Differential backups (more complex)
  // - Emergency recovery procedures documentation/helpers
}

// Export an instance or the class depending on DI strategy
export const backupService = new BackupService();
