const geminiConnection = require('./connection');
const geminiUtils = require('../utils/gemini');

// Gemini AI Text Processing Service
class GeminiTextProcessor {
  constructor() {
    this.connection = geminiConnection;
    this.utils = geminiUtils;
  }

  // Clean and improve text using Gemini AI
  async cleanText(text, language = 'en') {
    try {
      // Validate input using utils
      const validation = this.utils.validateTextInput(text);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      if (!this.connection.isConnectionAvailable()) {
        throw new Error('Gemini AI connection not available');
      }

      const model = this.connection.getModel();
      
      const prompt = `
        Please clean and improve the following text. 
        Language: ${language}
        Requirements:
        - Fix spelling and grammar errors
        - Improve sentence structure and flow
        - Remove unnecessary repetitions
        - Maintain the original meaning and intent
        - Keep the same language
        - Return only the cleaned text, no explanations
        
        Text to clean: "${text}"
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const cleanedText = response.text().trim();

      return {
        success: true,
        originalText: text,
        cleanedText: cleanedText,
        language: language,
        processingTime: Date.now()
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        originalText: text,
        language: language
      };
    }
  }

  // Translate text using Gemini AI
  async translateText(text, sourceLanguage, targetLanguage) {
    try {
      // Validate inputs using utils
      const textValidation = this.utils.validateTextInput(text);
      if (!textValidation.valid) {
        return { success: false, error: textValidation.error };
      }

      const sourceValidation = this.utils.validateLanguageCode(sourceLanguage);
      if (!sourceValidation.valid) {
        return { success: false, error: `Invalid source language: ${sourceValidation.error}` };
      }

      const targetValidation = this.utils.validateLanguageCode(targetLanguage);
      if (!targetValidation.valid) {
        return { success: false, error: `Invalid target language: ${targetValidation.error}` };
      }

      if (!this.connection.isConnectionAvailable()) {
        throw new Error('Gemini AI connection not available');
      }

      const model = this.connection.getModel();
      
      // Use the EXACT language mapping from your index.js
      const languages = {
        'en': 'English', 'en-US': 'English', 'es': 'Spanish', 'fr': 'French', 'de': 'German',
        'it': 'Italian', 'pt': 'Portuguese', 'ru': 'Russian', 'ja': 'Japanese',
        'ko': 'Korean', 'zh': 'Chinese', 'ar': 'Arabic', 'hi': 'Hindi',
        'sa': 'Sanskrit', 'mr': 'Marathi', 'te': 'Telugu', 'ml': 'Malayalam',
        'ur': 'Urdu', 'pa': 'Punjabi'
      };
      
      const sourceLang = languages[sourceLanguage] || 'English';
      const targetLang = languages[targetLanguage] || 'English';
      
      // Use the EXACT prompt from your index.js
      const prompt = `
      Please translate the following text from ${sourceLanguage} to ${targetLanguage}.
      Requirements:
      - Maintain the original meaning and context
      - Use natural, fluent language
      - Preserve any special formatting or structure
      - Return only the translated text, no explanations
      
      Text to translate: "${text}"
      Source language: ${sourceLanguage}
      Target language: ${targetLanguage}
    `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const translatedText = response.text().trim();

      return {
        success: true,
        originalText: text,
        translatedText: translatedText,
        sourceLanguage: sourceLanguage,
        targetLanguage: targetLanguage,
        processingTime: Date.now()
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        originalText: text,
        sourceLanguage: sourceLanguage,
        targetLanguage: targetLanguage
      };
    }
  }

  // Analyze text sentiment using Gemini AI
  async analyzeSentiment(text, language = 'en') {
    try {
      if (!this.connection.isConnectionAvailable()) {
        throw new Error('Gemini AI connection not available');
      }

      const model = this.connection.getModel();
      
      const prompt = `
        Please analyze the sentiment of the following text.
        Language: ${language}
        Requirements:
        - Analyze the emotional tone (positive, negative, neutral)
        - Provide a confidence score (0-100%)
        - Identify key emotional indicators
        - Return result in JSON format: {"sentiment": "positive/negative/neutral", "confidence": 85, "indicators": ["word1", "word2"]}
        
        Text to analyze: "${text}"
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const analysisText = response.text().trim();

      // Try to parse JSON response
      try {
        const analysis = JSON.parse(analysisText);
        return {
          success: true,
          text: text,
          analysis: analysis,
          language: language,
          processingTime: Date.now()
        };
      } catch (parseError) {
        // If JSON parsing fails, return the raw text
        return {
          success: true,
          text: text,
          analysis: { rawResponse: analysisText },
          language: language,
          processingTime: Date.now()
        };
      }

    } catch (error) {
      return {
        success: false,
        error: error.message,
        text: text,
        language: language
      };
    }
  }

  // Extract key information from text using Gemini AI
  async extractKeyInfo(text, language = 'en') {
    try {
      if (!this.connection.isConnectionAvailable()) {
        throw new Error('Gemini AI connection not available');
      }

      const model = this.connection.getModel();
      
      const prompt = `
        Please extract key information from the following text.
        Language: ${language}
        Requirements:
        - Identify main topics and themes
        - Extract key entities (names, places, dates, etc.)
        - Identify important facts or statements
        - Return result in JSON format: {"topics": ["topic1", "topic2"], "entities": ["entity1", "entity2"], "facts": ["fact1", "fact2"]}
        
        Text to analyze: "${text}"
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const extractionText = response.text().trim();

      // Try to parse JSON response
      try {
        const extraction = JSON.parse(extractionText);
        return {
          success: true,
          text: text,
          extraction: extraction,
          language: language,
          processingTime: Date.now()
        };
      } catch (parseError) {
        // If JSON parsing fails, return the raw text
        return {
          success: true,
          text: text,
          extraction: { rawResponse: extractionText },
          language: language,
          processingTime: Date.now()
        };
      }

    } catch (error) {
      return {
        success: false,
        error: error.message,
        text: text,
        language: language
      };
    }
  }

  // Speech translation using Gemini AI (EXACTLY as used in your index.js)
  async speechTranslation(text, userLanguage, targetLanguage) {
    try {
      // Validate inputs using utils
      const textValidation = this.utils.validateTextInput(text);
      if (!textValidation.valid) {
        return { success: false, error: textValidation.error };
      }

      if (!this.connection.isConnectionAvailable()) {
        throw new Error('Gemini AI connection not available');
      }

      const model = this.connection.getModel();
      
      // Use the EXACT language mapping from your index.js
      const languages = {
        'en': 'English', 'en-US': 'English', 'es': 'Spanish', 'fr': 'French', 'de': 'German',
        'it': 'Italian', 'pt': 'Portuguese', 'ru': 'Russian', 'ja': 'Japanese',
        'ko': 'Korean', 'zh': 'Chinese', 'ar': 'Arabic', 'hi': 'Hindi',
        'sa': 'Sanskrit', 'mr': 'Marathi', 'te': 'Telugu', 'ml': 'Malayalam',
        'ur': 'Urdu', 'pa': 'Punjabi'
      };
      
      // Normalize language codes (EXACTLY as in your index.js)
      const normalizeLang = (lang) => {
        if (lang === 'en-US') return 'en';
        return lang;
      };
      
      const sourceLang = languages[userLanguage] || 'English';
      const targetLang = languages[targetLanguage] || 'English';
      
      // First, clean the transcribed text using Gemini (EXACT prompt from your index.js)
      const cleaningPrompt = `Clean and correct the following transcribed text. If it's in English, fix spelling, grammar, and punctuation. If it's in another language (like Hindi, Spanish, etc.), convert it to proper text in that language. Return only the cleaned text without any additional commentary:

Text: "${text}"

Cleaned text:`;
      
      const cleaningResult = await model.generateContent(cleaningPrompt);
      const cleanedText = cleaningResult.response.text().trim();
      
      // Now translate the cleaned text (EXACT prompt from your index.js)
      const translationPrompt = `Translate the following text from ${sourceLang} to ${targetLang}. Return only the translated text without any additional commentary or formatting:

Text: "${cleanedText}"

Translation:`;
      
      const translationResult = await model.generateContent(translationPrompt);
      const translatedText = translationResult.response.text().trim();
      
      return {
        success: true,
        originalText: text,
        cleanedText: cleanedText,
        translatedText: translatedText,
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
        processingTime: Date.now()
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        originalText: text,
        userLanguage: userLanguage,
        targetLanguage: targetLanguage
      };
    }
  }

  // Get processing statistics
  getStats() {
    return {
      connectionStatus: this.connection.getConnectionStatus(),
      availableMethods: [
        'cleanText',
        'translateText', 
        'analyzeSentiment',
        'extractKeyInfo',
        'speechTranslation'
      ]
    };
  }
}

// Create singleton instance
const geminiTextProcessor = new GeminiTextProcessor();

module.exports = geminiTextProcessor;
