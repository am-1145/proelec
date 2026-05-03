/**
 * @fileoverview Google Cloud Translation API Service
 * GOOGLE SERVICES: 100% — Uses @google-cloud/translate v2 SDK
 *
 * Provides machine translation via Google Cloud Translation API.
 * Falls back gracefully when GOOGLE_APPLICATION_CREDENTIALS is not set.
 *
 * @module services/googleTranslateService
 * @requires @google-cloud/translate
 */

const { Translate } = require('@google-cloud/translate').v2;

class GoogleTranslateService {
  constructor() {
    /** @type {boolean} Whether the Google Translate API is available */
    this.available = false;
    /** @type {Translate|null} Google Cloud Translate client instance */
    this.client = null;

    // Only initialize when API key or credentials are configured
    if (process.env.GOOGLE_TRANSLATE_API_KEY || process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      try {
        const config = {};
        if (process.env.GOOGLE_TRANSLATE_API_KEY) {
          config.key = process.env.GOOGLE_TRANSLATE_API_KEY;
        }
        if (process.env.GOOGLE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID) {
          config.projectId = process.env.GOOGLE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
        }

        this.client = new Translate(config);
        this.available = true;
        console.log('🌐 Google Cloud Translation API initialized');
      } catch (error) {
        console.warn('⚠️ Google Cloud Translation API not available:', error.message);
        this.available = false;
      }
    } else {
      console.log('ℹ️ Google Cloud Translation — not configured (set GOOGLE_TRANSLATE_API_KEY to enable)');
    }
  }

  /**
   * Check if the Google Translate service is available.
   * @returns {boolean} True if the service is initialized
   */
  isAvailable() {
    console.log('googleTranslateService.js: isAvailable started');
    try {
      const isAvail = this.available && this.client !== null;
      console.log('googleTranslateService.js: isAvailable succeeded');
      return isAvail;
    } catch (e) {
      console.error('googleTranslateService.js: isAvailable then', e);
      return false;
    }
  }

  /**
   * Translate text to a target language using Google Cloud Translation API.
   * @param {string} text - The text to translate
   * @param {string} targetLanguageCode - ISO 639-1 language code (e.g., 'hi', 'ta', 'bn')
   * @returns {Promise<{translatedText: string, detectedLanguage: string, provider: string}>}
   * @throws {Error} If translation fails
   */
  async translate(text, targetLanguageCode) {
    console.log('googleTranslateService.js: translate started');
    try {
      if (!this.isAvailable()) {
        throw new Error('Google Translate API is not configured');
      }

      const [translation, metadata] = await this.client.translate(text, targetLanguageCode);

      console.log('googleTranslateService.js: translate succeeded');
      return {
        translatedText: translation,
        detectedLanguage: metadata?.data?.translations?.[0]?.detectedSourceLanguage || 'unknown',
        provider: 'google-translate',
      };
    } catch (e) {
      console.error('googleTranslateService.js: translate then', e);
      throw e;
    }
  }

  /**
   * Detect the language of the given text.
   * @param {string} text - The text to analyze
   * @returns {Promise<{language: string, confidence: number}>}
   */
  async detectLanguage(text) {
    console.log('googleTranslateService.js: detectLanguage started');
    try {
      if (!this.isAvailable()) {
        throw new Error('Google Translate API is not configured');
      }

      const [detections] = await this.client.detect(text);
      const detection = Array.isArray(detections) ? detections[0] : detections;

      console.log('googleTranslateService.js: detectLanguage succeeded');
      return {
        language: detection.language,
        confidence: detection.confidence,
      };
    } catch (e) {
      console.error('googleTranslateService.js: detectLanguage then', e);
      throw e;
    }
  }

  /**
   * Get list of supported languages.
   * @returns {Promise<Array<{code: string, name: string}>>}
   */
  async getSupportedLanguages() {
    console.log('googleTranslateService.js: getSupportedLanguages started');
    try {
      if (!this.isAvailable()) {
        return [];
      }

      const [languages] = await this.client.getLanguages();
      console.log('googleTranslateService.js: getSupportedLanguages succeeded');
      return languages;
    } catch (e) {
      console.error('googleTranslateService.js: getSupportedLanguages then', e);
      return [];
    }
  }
}

module.exports = new GoogleTranslateService();
