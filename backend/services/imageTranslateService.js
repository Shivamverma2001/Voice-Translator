const sharp = require('sharp');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Translate } = require('@google-cloud/translate').v2;

class ImageTranslateService {
  constructor() {
    // Initialize Google AI and Translate
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.translate = new Translate({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE,
    });

    // Language mapping for translation
    this.languages = {
      'en-US': 'English',
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese',
      'ru': 'Russian',
      'ja': 'Japanese',
      'ko': 'Korean',
      'zh': 'Chinese',
      'ar': 'Arabic',
      'hi': 'Hindi',
      'sa': 'Sanskrit',
      'mr': 'Marathi',
      'te': 'Telugu',
      'ml': 'Malayalam',
      'ur': 'Urdu',
      'pa': 'Punjabi',
    };
  }

  /**
   * Process and optimize image for OCR
   */
  async processImage(imageBuffer) {
    try {
      const processedImageBuffer = await sharp(imageBuffer)
        .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer();
      
      return {
        success: true,
        processedBuffer: processedImageBuffer
      };
    } catch (error) {
      console.error('❌ Image processing error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Extract text from image using Gemini Vision
   */
  async extractTextFromImage(imageBuffer, mimeType) {
    try {
      const base64Image = imageBuffer.toString('base64');
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `Please extract all text from this image. Return only the extracted text without any additional commentary or formatting. If there's no text in the image, return "No text found".`;
      
      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Image,
            mimeType: mimeType,
          },
        },
      ]);

      const response = await result.response;
      const extractedText = response.text().trim();
      
      if (!extractedText || extractedText === 'No text found') {
        return {
          success: true,
          extractedText: 'No text found in the image'
        };
      }

      return {
        success: true,
        extractedText: extractedText
      };
    } catch (error) {
      console.error('❌ Gemini Vision error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Clean extracted text using Gemini
   */
  async cleanExtractedText(text) {
    try {
      const textModel = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const cleaningPrompt = `Please clean and correct the following text extracted from an image. Fix any OCR errors, remove artifacts, and ensure proper formatting. Return only the cleaned text:

Text: "${text}"

Cleaned text:`;
      
      const cleaningResult = await textModel.generateContent(cleaningPrompt);
      const cleaningResponse = await cleaningResult.response;
      const cleanedText = cleaningResponse.text().trim();
      
      return {
        success: true,
        cleanedText: cleanedText
      };
    } catch (error) {
      console.error('❌ Text cleaning error:', error);
      // Continue with original text if cleaning fails
      return {
        success: true,
        cleanedText: text
      };
    }
  }

  /**
   * Translate text using Gemini
   */
  async translateText(text, sourceLang, targetLang) {
    try {
      const sourceLanguageName = this.languages[sourceLang] || 'English';
      const targetLanguageName = this.languages[targetLang] || 'Spanish';
      
      const translationModel = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const translationPrompt = `Translate the following text from ${sourceLanguageName} to ${targetLanguageName}. Return only the translated text without any additional commentary or formatting:

Text: "${text}"

Translation:`;
      
      const translationResult = await translationModel.generateContent(translationPrompt);
      const translationResponse = await translationResult.response;
      const translatedText = translationResponse.text().trim();
      
      return {
        success: true,
        translatedText: translatedText
      };
    } catch (error) {
      console.error('❌ Translation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Main method to process image and translate text
   */
  async processImageAndTranslate(imageBuffer, mimeType, sourceLang = 'en', targetLang = 'es') {
    try {
      // Step 1: Process image
      const processResult = await this.processImage(imageBuffer);
      if (!processResult.success) {
        return processResult;
      }

      // Step 2: Extract text
      const extractResult = await this.extractTextFromImage(processResult.processedBuffer, mimeType);
      if (!extractResult.success) {
        return extractResult;
      }

      if (extractResult.extractedText === 'No text found in the image') {
        return {
          success: true,
          extractedText: extractResult.extractedText,
          cleanedText: '',
          translatedText: ''
        };
      }

      // Step 3: Clean text
      const cleanResult = await this.cleanExtractedText(extractResult.extractedText);
      if (!cleanResult.success) {
        return cleanResult;
      }

      // Step 4: Translate text
      const translateResult = await this.translateText(cleanResult.cleanedText, sourceLang, targetLang);
      if (!translateResult.success) {
        return translateResult;
      }

      return {
        success: true,
        extractedText: extractResult.extractedText,
        cleanedText: cleanResult.cleanedText,
        translatedText: translateResult.translatedText
      };

    } catch (error) {
      console.error('❌ Image translation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new ImageTranslateService();
