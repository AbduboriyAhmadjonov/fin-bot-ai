import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMP_DIR = path.join(__dirname, '../temp');

/**
 * Cleanup temporary files from the temp directory
 * Keeps the directory but removes all files
 */
async function cleanupTempFiles() {
  console.log('Cleaning up temporary files...');

  try {
    // Ensure temp directory exists
    if (!fs.existsSync(TEMP_DIR)) {
      console.log('Temp directory does not exist. Creating it...');
      fs.mkdirSync(TEMP_DIR, { recursive: true });
      console.log('Temp directory created.');
      return;
    }

    // Read all files in the temp directory
    const files = fs.readdirSync(TEMP_DIR);

    if (files.length === 0) {
      console.log('No files to clean up.');
      return;
    }

    console.log(`Found ${files.length} files to clean up.`);

    // Delete each file
    for (const file of files) {
      const filePath = path.join(TEMP_DIR, file);

      // Skip directories
      if (fs.statSync(filePath).isDirectory()) {
        console.log(`Skipping directory: ${file}`);
        continue;
      }

      // Delete the file
      fs.unlinkSync(filePath);
      console.log(`Deleted: ${file}`);
    }

    console.log('Cleanup completed successfully.');
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
}

// Run the cleanup
cleanupTempFiles();
