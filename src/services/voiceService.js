import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import { promisify } from 'util';
import ffmpeg from 'fluent-ffmpeg';
import dotenv from 'dotenv';
import prisma from '../db/prismaClient.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMP_DIR = path.join(__dirname, '../../temp');

// Ensure temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

/**
 * Downloads a voice file from Telegram
 * @param {string} fileUrl - The URL of the voice file
 * @param {string} userId - The user ID for unique file naming
 * @returns {Promise<string>} - Path to the downloaded file
 */
async function downloadVoiceFile(fileUrl, userId) {
  const timestamp = Date.now();
  const filePath = path.join(TEMP_DIR, `voice_${userId}_${timestamp}.ogg`);

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);

    https
      .get(fileUrl, (response) => {
        response.pipe(file);

        file.on('finish', () => {
          file.close();
          resolve(filePath);
        });

        file.on('error', (err) => {
          fs.unlink(filePath, () => {}); // Delete the file on error
          reject(err);
        });
      })
      .on('error', (err) => {
        fs.unlink(filePath, () => {}); // Delete the file on error
        reject(err);
      });
  });
}

/**
 * Converts an OGG voice file to WAV format using ffmpeg
 * @param {string} oggPath - Path to the OGG file
 * @returns {Promise<string>} - Path to the converted WAV file
 */
async function convertOggToWav(oggPath) {
  const wavPath = oggPath.replace('.ogg', '.wav');

  return new Promise((resolve, reject) => {
    ffmpeg(oggPath)
      .output(wavPath)
      .audioFrequency(16000)
      .audioChannels(1)
      .on('end', () => {
        resolve(wavPath);
      })
      .on('error', (err) => {
        console.error('Error converting audio:', err);
        reject(new Error('Failed to convert audio file'));
      })
      .run();
  });
}

/**
 * Transcribes a WAV file using Google Speech-to-Text API
 * @param {string} wavPath - Path to the WAV file
 * @param {string} languageCode - The language code to use for transcription
 * @returns {Promise<string>} - Transcribed text
 */
async function transcribeAudio(wavPath, languageCode = 'en-US') {
  try {
    // Import dynamically to avoid issues if the package is not installed yet
    const { SpeechClient } = await import('@google-cloud/speech');

    // Create client
    const client = new SpeechClient();

    // Read the audio file
    const file = fs.readFileSync(wavPath);
    const audioBytes = file.toString('base64');

    // Configure request
    const audio = {
      content: audioBytes,
    };

    const config = {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: languageCode,
    };

    const request = {
      audio: audio,
      config: config,
    };

    // Detect speech
    const [response] = await client.recognize(request);

    // Extract transcription
    const transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join(' ');

    console.log(`Transcription: ${transcription}`);

    return transcription;
  } catch (error) {
    console.error('Error during speech-to-text transcription:', error);

    // If Google Speech API fails, return a placeholder for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Using development fallback transcription');
      return '10000 Food, 5000 Transport';
    }

    throw new Error('Failed to transcribe audio');
  }
}

/**
 * Cleans up temporary files
 * @param {Array<string>} filePaths - Paths to files to delete
 */
function cleanupFiles(filePaths) {
  for (const filePath of filePaths) {
    try {
      fs.unlinkSync(filePath);
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error);
    }
  }
}

/**
 * Records a voice input in the database
 * @param {Object} data - Voice input data
 * @returns {Promise<Object>} - Created voice input record
 */
async function recordVoiceInput({ userId, audioUrl, transcript }) {
  return await prisma.voiceInput.create({
    data: {
      userId,
      audioUrl,
      transcript,
      processed: true,
    },
  });
}

/**
 * Maps ISO language codes to Google Speech API language codes
 * @param {string} isoCode - The ISO language code (e.g., 'en', 'ru', 'uz')
 * @returns {string} - Google Speech API language code
 */
function mapLanguageCodeForSpeech(isoCode) {
  const languageMap = {
    en: 'en-US',
    ru: 'ru-RU',
    uz: 'uz-UZ',
    // Add more languages as needed
  };

  return languageMap[isoCode] || 'en-US'; // Default to English if not found
}

/**
 * Process a voice message and convert it to text
 * @param {Object} ctx - Telegram context
 * @returns {Promise<string>} - Transcribed text
 */
export async function processVoiceMessage(ctx) {
  const user = ctx.from;
  const voiceFile = ctx.message.voice;

  if (!voiceFile) {
    throw new Error('No voice file found in message');
  }

  // Get file link from Telegram
  const fileLink = await ctx.telegram.getFileLink(voiceFile.file_id);

  // Get user's language for transcription
  const userLanguage = ctx.i18n.locale();
  const speechApiLanguage = mapLanguageCodeForSpeech(userLanguage);

  const filesToCleanup = [];
  try {
    // 1. Download the voice file
    const oggPath = await downloadVoiceFile(fileLink.href, user.id);
    filesToCleanup.push(oggPath);

    // 2. Convert OGG to WAV
    const wavPath = await convertOggToWav(oggPath);
    filesToCleanup.push(wavPath);

    // 3. Transcribe the audio using user's language
    const transcript = await transcribeAudio(wavPath, speechApiLanguage);

    // 4. Store in database
    await recordVoiceInput({
      userId: user.id.toString(),
      audioUrl: fileLink.href,
      transcript,
    });

    return transcript;
  } finally {
    // Clean up temporary files
    cleanupFiles(filesToCleanup);
  }
}
