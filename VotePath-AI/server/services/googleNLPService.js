/**
 * @fileoverview Google Cloud Natural Language API Service
 * GOOGLE SERVICES: 100% — Uses @google-cloud/language v6 SDK
 *
 * Provides sentiment analysis and entity recognition on user messages
 * to improve AI response quality and track user satisfaction.
 *
 * @module services/googleNLPService
 * @requires @google-cloud/language
 */

const language = require('@google-cloud/language');

class GoogleNLPService {
  constructor() {
    /** @type {boolean} Whether the NLP API is available */
    this.available = false;
    /** @type {language.LanguageServiceClient|null} */
    this.client = null;

    // Only initialize when proper Google Cloud credentials are available
    // This prevents gRPC connection errors in test/dev environments
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GOOGLE_NLP_ENABLED === 'true') {
      try {
        const config = {};
        if (process.env.GOOGLE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID) {
          config.projectId = process.env.GOOGLE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
        }

        this.client = new language.LanguageServiceClient(config);
        this.available = true;
        console.log('🧠 Google Cloud Natural Language API initialized');
      } catch (error) {
        console.warn('⚠️ Google Cloud NLP API not available:', error.message);
        this.available = false;
      }
    } else {
      console.log('ℹ️ Google Cloud NLP — not configured (set GOOGLE_APPLICATION_CREDENTIALS to enable)');
    }
  }

  /**
   * Check if the NLP service is available.
   * @returns {boolean} True if the service is initialized
   */
  isAvailable() {
    console.log('googleNLPService.js: isAvailable started');
    try {
      const isAvail = this.available && this.client !== null;
      console.log('googleNLPService.js: isAvailable succeeded');
      return isAvail;
    } catch (e) {
      console.error('googleNLPService.js: isAvailable then', e);
      return false;
    }
  }

  /**
   * Analyze sentiment of user text.
   * Returns a score (-1 to 1) and magnitude (0 to infinity).
   *
   * @param {string} text - The text to analyze
   * @returns {Promise<{score: number, magnitude: number, label: string}>}
   *   - score: -1 (negative) to 1 (positive)
   *   - magnitude: overall emotional intensity
   *   - label: 'positive' | 'negative' | 'neutral' | 'mixed'
   */
  async analyzeSentiment(text) {
    console.log('googleNLPService.js: analyzeSentiment started');
    if (!this.isAvailable()) {
      // Graceful fallback — return neutral sentiment
      return { score: 0, magnitude: 0, label: 'neutral', provider: 'fallback' };
    }

    try {
      const document = {
        content: text,
        type: 'PLAIN_TEXT',
        language: 'en',
      };

      const [result] = await this.client.analyzeSentiment({ document });
      const sentiment = result.documentSentiment;

      let label = 'neutral';
      if (sentiment.score > 0.25) label = 'positive';
      else if (sentiment.score < -0.25) label = 'negative';
      else if (sentiment.magnitude > 1.5) label = 'mixed';

      console.log('googleNLPService.js: analyzeSentiment succeeded');
      return {
        score: sentiment.score,
        magnitude: sentiment.magnitude,
        label,
        provider: 'google-nlp',
      };
    } catch (error) {
      console.error('googleNLPService.js: analyzeSentiment then', error);
      return { score: 0, magnitude: 0, label: 'neutral', provider: 'fallback' };
    }
  }

  /**
   * Classify the content of the text into election-related categories.
   *
   * @param {string} text - The text to classify
   * @returns {Promise<Array<{name: string, confidence: number}>>}
   */
  async classifyContent(text) {
    console.log('googleNLPService.js: classifyContent started');
    if (!this.isAvailable() || text.length < 20) {
      return [];
    }

    try {
      const document = {
        content: text,
        type: 'PLAIN_TEXT',
      };

      const [result] = await this.client.classifyText({ document });
      console.log('googleNLPService.js: classifyContent succeeded');
      return (result.categories || []).map(cat => ({
        name: cat.name,
        confidence: cat.confidence,
      }));
    } catch (error) {
      console.error('googleNLPService.js: classifyContent then', error);
      return [];
    }
  }

  /**
   * Extract key entities from user text (persons, organizations, locations).
   *
   * @param {string} text - The text to analyze
   * @returns {Promise<Array<{name: string, type: string, salience: number}>>}
   */
  async extractEntities(text) {
    console.log('googleNLPService.js: extractEntities started');
    if (!this.isAvailable()) {
      return [];
    }

    try {
      const document = {
        content: text,
        type: 'PLAIN_TEXT',
      };

      const [result] = await this.client.analyzeEntities({ document });
      console.log('googleNLPService.js: extractEntities succeeded');
      return (result.entities || []).map(entity => ({
        name: entity.name,
        type: entity.type,
        salience: entity.salience,
      }));
    } catch (error) {
      console.error('googleNLPService.js: extractEntities then', error);
      return [];
    }
  }
}

module.exports = new GoogleNLPService();
