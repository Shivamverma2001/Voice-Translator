const VoiceMode = require('../models/VoiceMode');
const DocumentMode = require('../models/DocumentMode');
const TextMode = require('../models/TextMode');
const ImageMode = require('../models/ImageMode');
const ConversationMode = require('../models/ConversationMode');
const VoiceCallMode = require('../models/VoiceCallMode');
const User = require('../models/User');
const { getLanguageByCode } = require('../master/languages');

class TranslationService {
  constructor() {
    // Initialize AI services
    this.geminiAI = null;
    this.speechmatics = null;
    this.googleTranslate = null;
    
    this.initializeAIServices();
  }

  // Initialize AI Services
  async initializeAIServices() {
    try {
      // Initialize Gemini AI
      if (process.env.GEMINI_API_KEY) {
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        this.geminiAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      }

      // Initialize Speechmatics
      if (process.env.SPEECHMATICS_API_KEY) {
        // Initialize Speechmatics client
        this.speechmatics = {
          transcribe: async (audioBuffer) => {
            // Implement Speechmatics transcription
            // This is a placeholder - implement actual Speechmatics integration
            return { text: 'Transcribed text', confidence: 0.9 };
          }
        };
      }

      // Initialize Google Translate
      if (process.env.GOOGLE_TRANSLATE_API_KEY) {
        const { Translate } = require('@google-cloud/translate').v2;
        this.googleTranslate = new Translate({
          key: process.env.GOOGLE_TRANSLATE_API_KEY
        });
      }

      console.log('✅ AI services initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize AI services:', error);
    }
  }

  // Text Translation Service
  async translateText(userId, textData) {
    try {
      const startTime = Date.now();
      
      // Validate input
      if (!textData.text || !textData.sourceLanguage || !textData.targetLanguage) {
        throw new Error('Missing required fields: text, sourceLanguage, targetLanguage');
      }

      // Create text mode record
      const textMode = new TextMode({
        userId,
        originalText: textData.text,
        sourceLanguage: textData.sourceLanguage,
        targetLanguage: textData.targetLanguage,
        status: 'processing'
      });

      await textMode.save();

      // Text cleaning (if enabled)
      let cleanedText = textData.text;
      let cleaningTime = 0;
      
      if (textData.autoClean !== false) {
        const cleaningStart = Date.now();
        cleanedText = await this.cleanText(textData.text, textData.sourceLanguage);
        cleaningTime = Date.now() - cleaningStart;
        textMode.cleanedText = cleanedText;
        textMode.processingTime.cleaning = cleaningTime;
      }

      // Translation
      const translationStart = Date.now();
      const translatedText = await this.translateTextContent(
        cleanedText, 
        textData.sourceLanguage, 
        textData.targetLanguage,
        textData.quality || 'balanced'
      );
      const translationTime = Date.now() - translationStart;

      // Update text mode record
      textMode.translatedText = translatedText;
      textMode.processingTime.translation = translationTime;
      textMode.status = 'completed';
      textMode.aiProcessing.confidence.translation = 0.9;
      textMode.aiProcessing.confidence.cleaning = 0.9;

      await textMode.save();

      // Update user usage
      await this.updateUserUsage(userId, 'text');

      const totalTime = Date.now() - startTime;

      return {
        success: true,
        originalText: textData.text,
        cleanedText: cleanedText,
        translatedText: translatedText,
        sourceLanguage: textData.sourceLanguage,
        targetLanguage: textData.targetLanguage,
        processingTime: {
          cleaning: cleaningTime,
          translation: translationTime,
          total: totalTime
        },
        textId: textMode._id
      };
    } catch (error) {
      console.error('Text translation error:', error);
      throw new Error(`Text translation failed: ${error.message}`);
    }
  }

  // Voice Translation Service
  async translateVoice(userId, voiceData) {
    try {
      const startTime = Date.now();
      
      // Validate input
      if (!voiceData.audioBuffer || !voiceData.sourceLanguage || !voiceData.targetLanguage) {
        throw new Error('Missing required fields: audioBuffer, sourceLanguage, targetLanguage');
      }

      // Create voice mode record
      const voiceMode = new VoiceMode({
        userId,
        sessionId: `voice-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sourceLanguage: voiceData.sourceLanguage,
        targetLanguage: voiceData.targetLanguage,
        audioFormat: voiceData.audioFormat || 'webm',
        audioQuality: voiceData.audioQuality || 'medium',
        status: 'processing'
      });

      await voiceMode.save();

      // Speech-to-Text transcription
      const transcriptionStart = Date.now();
      const transcriptionResult = await this.transcribeAudio(voiceData.audioBuffer, voiceData.sourceLanguage);
      const transcriptionTime = Date.now() - transcriptionStart;

      if (!transcriptionResult.text) {
        throw new Error('Failed to transcribe audio');
      }

      voiceMode.originalText = transcriptionResult.text;
      voiceMode.processingTime.transcription = transcriptionTime;
      voiceMode.aiProcessing.confidence.transcription = transcriptionResult.confidence;

      // Text cleaning
      const cleaningStart = Date.now();
      const cleanedText = await this.cleanText(transcriptionResult.text, voiceData.sourceLanguage);
      const cleaningTime = Date.now() - cleaningStart;

      voiceMode.cleanedText = cleanedText;
      voiceMode.processingTime.cleaning = cleaningTime;
      voiceMode.aiProcessing.confidence.cleaning = 0.9;

      // Translation
      const translationStart = Date.now();
      const translatedText = await this.translateTextContent(
        cleanedText,
        voiceData.sourceLanguage,
        voiceData.targetLanguage,
        voiceData.quality || 'balanced'
      );
      const translationTime = Date.now() - translationStart;

      voiceMode.translatedText = translatedText;
      voiceMode.processingTime.translation = translationTime;
      voiceMode.aiProcessing.confidence.translation = 0.9;
      voiceMode.status = 'completed';

      await voiceMode.save();

      // Update user usage
      await this.updateUserUsage(userId, 'voice');

      const totalTime = Date.now() - startTime;

      return {
        success: true,
        originalText: transcriptionResult.text,
        cleanedText: cleanedText,
        translatedText: translatedText,
        sourceLanguage: voiceData.sourceLanguage,
        targetLanguage: voiceData.targetLanguage,
        processingTime: {
          transcription: transcriptionTime,
          cleaning: cleaningTime,
          translation: translationTime,
          total: totalTime
        },
        sessionId: voiceMode.sessionId,
        voiceId: voiceMode._id
      };
    } catch (error) {
      console.error('Voice translation error:', error);
      throw new Error(`Voice translation failed: ${error.message}`);
    }
  }

  // Document Translation Service
  async translateDocument(userId, documentData) {
    try {
      const startTime = Date.now();
      
      // Validate input
      if (!documentData.documents || !Array.isArray(documentData.documents) || documentData.documents.length === 0) {
        throw new Error('Documents array is required');
      }

      // Create document mode record
      const documentMode = new DocumentMode({
        userId,
        documents: documentData.documents,
        sourceLanguage: documentData.sourceLanguage,
        targetLanguage: documentData.targetLanguage,
        batchInfo: {
          totalDocuments: documentData.documents.length
        },
        processingConfig: documentData.processingConfig || {},
        status: 'processing'
      });

      await documentMode.save();

      const results = [];
      
      // Process each document
      for (let i = 0; i < documentData.documents.length; i++) {
        const document = documentData.documents[i];
        
        try {
          // Extract text from document
          const extractionStart = Date.now();
          const extractedText = await this.extractTextFromDocument(document);
          const extractionTime = Date.now() - extractionStart;

          // Text cleaning
          const cleaningStart = Date.now();
          const cleanedText = await this.cleanText(extractedText, documentData.sourceLanguage);
          const cleaningTime = Date.now() - cleaningStart;

          // Translation
          const translationStart = Date.now();
          const translatedText = await this.translateTextContent(
            cleanedText,
            documentData.sourceLanguage,
            documentData.targetLanguage,
            documentData.processingConfig?.quality || 'balanced'
          );
          const translationTime = Date.now() - translationStart;

          // Add result
          const result = {
            documentIndex: i,
            originalName: document.originalName,
            extractedText,
            cleanedText,
            translatedText,
            status: 'completed',
            processingTime: {
              extraction: extractionTime,
              cleaning: cleaningTime,
              translation: translationTime,
              total: extractionTime + cleaningTime + translationTime
            }
          };

          results.push(result);
          documentMode.results.push(result);

        } catch (error) {
          console.error(`Document ${i} processing error:`, error);
          
          // Add failed result
          const failedResult = {
            documentIndex: i,
            originalName: document.originalName,
            status: 'failed',
            errors: [{
              stage: 'extraction',
              message: error.message,
              code: 'PROCESSING_ERROR'
            }]
          };

          results.push(failedResult);
          documentMode.results.push(failedResult);
        }
      }

      // Update document mode status
      documentMode.status = results.every(r => r.status === 'completed') ? 'completed' : 'partially-completed';
      await documentMode.save();

      // Update user usage
      await this.updateUserUsage(userId, 'document');

      const totalTime = Date.now() - startTime;

      return {
        success: true,
        results,
        sourceLanguage: documentData.sourceLanguage,
        targetLanguage: documentData.targetLanguage,
        processingTime: totalTime,
        documentId: documentMode._id,
        status: documentMode.status
      };
    } catch (error) {
      console.error('Document translation error:', error);
      throw new Error(`Document translation failed: ${error.message}`);
    }
  }

  // Image Translation Service
  async translateImage(userId, imageData) {
    try {
      const startTime = Date.now();
      
      // Validate input
      if (!imageData.image || !imageData.sourceLanguage || !imageData.targetLanguage) {
        throw new Error('Missing required fields: image, sourceLanguage, targetLanguage');
      }

      // Create image mode record
      const imageMode = new ImageMode({
        userId,
        image: imageData.image,
        sourceLanguage: imageData.sourceLanguage,
        targetLanguage: imageData.targetLanguage,
        status: 'processing'
      });

      await imageMode.save();

      // Image optimization
      const optimizationStart = Date.now();
      const optimizedImage = await this.optimizeImage(imageData.image);
      const optimizationTime = Date.now() - optimizationStart;

      imageMode.processingTime.imageOptimization = optimizationTime;

      // OCR text extraction
      const ocrStart = Date.now();
      const ocrResult = await this.extractTextFromImage(optimizedImage);
      const ocrTime = Date.now() - ocrStart;

      if (!ocrResult.text) {
        throw new Error('No text found in image');
      }

      imageMode.ocrResults.extractedText = ocrResult.text;
      imageMode.ocrResults.confidence.overall = ocrResult.confidence;
      imageMode.processingTime.ocr = ocrTime;
      imageMode.aiProcessing.confidence.ocr = ocrResult.confidence;

      // Text cleaning
      const cleaningStart = Date.now();
      const cleanedText = await this.cleanText(ocrResult.text, imageData.sourceLanguage);
      const cleaningTime = Date.now() - cleaningStart;

      imageMode.ocrResults.cleanedText = cleanedText;
      imageMode.processingTime.textCleaning = cleaningTime;
      imageMode.aiProcessing.confidence.cleaning = 0.9;

      // Translation
      const translationStart = Date.now();
      const translatedText = await this.translateTextContent(
        cleanedText,
        imageData.sourceLanguage,
        imageData.targetLanguage,
        imageData.processingConfig?.quality || 'balanced'
      );
      const translationTime = Date.now() - translationStart;

      imageMode.ocrResults.translatedText = translatedText;
      imageMode.processingTime.translation = translationTime;
      imageMode.aiProcessing.confidence.translation = 0.9;
      imageMode.status = 'completed';

      await imageMode.save();

      // Update user usage
      await this.updateUserUsage(userId, 'image');

      const totalTime = Date.now() - startTime;

      return {
        success: true,
        extractedText: ocrResult.text,
        cleanedText: cleanedText,
        translatedText: translatedText,
        sourceLanguage: imageData.sourceLanguage,
        targetLanguage: imageData.targetLanguage,
        processingTime: {
          optimization: optimizationTime,
          ocr: ocrTime,
          cleaning: cleaningTime,
          translation: translationTime,
          total: totalTime
        },
        imageId: imageMode._id
      };
    } catch (error) {
      console.error('Image translation error:', error);
      throw new Error(`Image translation failed: ${error.message}`);
    }
  }

  // Conversation Mode Service
  async startConversation(userId, conversationData) {
    try {
      // Create conversation record
      const conversation = new ConversationMode({
        userId,
        sessionId: `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sourceLanguage: conversationData.sourceLanguage,
        targetLanguage: conversationData.targetLanguage,
        settings: conversationData.settings || {},
        status: 'active'
      });

      await conversation.save();

      return {
        success: true,
        sessionId: conversation.sessionId,
        conversationId: conversation._id,
        message: 'Conversation started successfully'
      };
    } catch (error) {
      console.error('Start conversation error:', error);
      throw new Error(`Failed to start conversation: ${error.message}`);
    }
  }

  // Add Message to Conversation
  async addConversationMessage(sessionId, messageData) {
    try {
      const conversation = await ConversationMode.findOne({ sessionId });
      
      if (!conversation) {
        throw new Error('Conversation not found');
      }

      if (conversation.status !== 'active') {
        throw new Error('Conversation is not active');
      }

      // Add message to conversation
      await conversation.addMessage(messageData);

      return {
        success: true,
        messageId: messageData.id,
        message: 'Message added successfully'
      };
    } catch (error) {
      console.error('Add conversation message error:', error);
      throw new Error(`Failed to add message: ${error.message}`);
    }
  }

  // Voice Call Service
  async startVoiceCall(userId, callData) {
    try {
      // Create voice call record
      const voiceCall = new VoiceCallMode({
        roomId: callData.roomId,
        creator: {
          userId,
          username: callData.username,
          sourceLanguage: callData.sourceLanguage,
          targetLanguage: callData.targetLanguage
        },
        settings: callData.settings || {},
        status: 'waiting'
      });

      await voiceCall.save();

      return {
        success: true,
        roomId: voiceCall.roomId,
        callId: voiceCall._id,
        message: 'Voice call created successfully'
      };
    } catch (error) {
      console.error('Start voice call error:', error);
      throw new Error(`Failed to start voice call: ${error.message}`);
    }
  }

  // Add Message to Voice Call
  async addVoiceCallMessage(roomId, messageData) {
    try {
      const voiceCall = await VoiceCallMode.findOne({ roomId });
      
      if (!voiceCall) {
        throw new Error('Voice call not found');
      }

      if (voiceCall.status !== 'active') {
        throw new Error('Voice call is not active');
      }

      // Add message to voice call
      await voiceCall.addMessage(messageData);

      return {
        success: true,
        messageId: messageData.id,
        message: 'Message added successfully'
      };
    } catch (error) {
      console.error('Add voice call message error:', error);
      throw new Error(`Failed to add message: ${error.message}`);
    }
  }

  // AI Service Methods

  // Text Cleaning
  async cleanText(text, language) {
    try {
      if (!this.geminiAI) {
        // Fallback to basic cleaning
        return text.trim().replace(/\s+/g, ' ');
      }

      const model = this.geminiAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `Clean and normalize the following ${language} text. Remove unnecessary spaces, fix punctuation, and make it more readable while preserving the original meaning:

Text: "${text}"

Return only the cleaned text without any explanations.`;

      const result = await model.generateContent(prompt);
      const cleanedText = result.response.text().trim();

      return cleanedText || text;
    } catch (error) {
      console.error('Text cleaning error:', error);
      // Return original text if cleaning fails
      return text;
    }
  }

  // Text Translation
  async translateTextContent(text, sourceLanguage, targetLanguage, quality = 'balanced') {
    try {
      // Try Google Translate first
      if (this.googleTranslate) {
        try {
          const [translation] = await this.googleTranslate.translate(text, {
            from: sourceLanguage,
            to: targetLanguage
          });
          return translation;
        } catch (error) {
          console.warn('Google Translate failed, falling back to Gemini:', error);
        }
      }

      // Fallback to Gemini AI
      if (this.geminiAI) {
        const model = this.geminiAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
        const prompt = `Translate the following text from ${sourceLanguage} to ${targetLanguage}. Maintain the original meaning, tone, and context. Use ${quality} quality translation.

Text: "${text}"

Return only the translated text without any explanations.`;

        const result = await model.generateContent(prompt);
        const translatedText = result.response.text().trim();

        return translatedText || text;
      }

      throw new Error('No translation service available');
    } catch (error) {
      console.error('Text translation error:', error);
      throw new Error(`Translation failed: ${error.message}`);
    }
  }

  // Audio Transcription
  async transcribeAudio(audioBuffer, language) {
    try {
      if (this.speechmatics) {
        const result = await this.speechmatics.transcribe(audioBuffer);
        return result;
      }

      // Fallback to Gemini AI for audio transcription
      if (this.geminiAI) {
        const model = this.geminiAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
        // Convert audio buffer to base64 or use appropriate format
        const audioData = audioBuffer.toString('base64');
        
        const prompt = `Transcribe the following audio content in ${language}. Return only the transcribed text without any explanations.`;
        
        const result = await model.generateContent([prompt, { inlineData: { data: audioData, mimeType: 'audio/webm' } }]);
        const transcribedText = result.response.text().trim();

        return {
          text: transcribedText,
          confidence: 0.8
        };
      }

      throw new Error('No transcription service available');
    } catch (error) {
      console.error('Audio transcription error:', error);
      throw new Error(`Transcription failed: ${error.message}`);
    }
  }

  // Document Text Extraction
  async extractTextFromDocument(document) {
    try {
      // This is a placeholder - implement actual document processing
      // You would use libraries like pdf-parse, mammoth, etc.
      
      if (document.mimetype === 'application/pdf') {
        // Extract text from PDF
        return 'Extracted text from PDF document';
      } else if (document.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // Extract text from DOCX
        return 'Extracted text from DOCX document';
      } else if (document.mimetype === 'text/plain') {
        // Return plain text
        return document.content || 'Plain text document';
      } else {
        throw new Error('Unsupported document type');
      }
    } catch (error) {
      console.error('Document text extraction error:', error);
      throw new Error(`Text extraction failed: ${error.message}`);
    }
  }

  // Image Text Extraction (OCR)
  async extractTextFromImage(image) {
    try {
      if (this.geminiAI) {
        const model = this.geminiAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
        const prompt = 'Extract all text from this image. Return only the extracted text without any explanations.';
        
        // Convert image to base64 or use appropriate format
        const imageData = image.path ? require('fs').readFileSync(image.path) : image.buffer;
        const base64Image = imageData.toString('base64');
        
        const result = await model.generateContent([prompt, { inlineData: { data: base64Image, mimeType: image.mimetype } }]);
        const extractedText = result.response.text().trim();

        return {
          text: extractedText,
          confidence: 0.9
        };
      }

      throw new Error('No OCR service available');
    } catch (error) {
      console.error('Image text extraction error:', error);
      throw new Error(`Text extraction failed: ${error.message}`);
    }
  }

  // Image Optimization
  async optimizeImage(image) {
    try {
      // This is a placeholder - implement actual image optimization
      // You would use libraries like sharp, jimp, etc.
      return image;
    } catch (error) {
      console.error('Image optimization error:', error);
      return image; // Return original if optimization fails
    }
  }

  // Update User Usage
  async updateUserUsage(userId, type) {
    try {
      const user = await User.findById(userId);
      if (user) {
        await user.incrementUsage(type);
      }
    } catch (error) {
      console.error('Failed to update user usage:', error);
    }
  }

  // Get Translation History
  async getTranslationHistory(userId, type = 'all', page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;
      let results = [];

      switch (type) {
        case 'voice':
          results = await VoiceMode.findByUser(userId, limit, skip);
          break;
        case 'text':
          results = await TextMode.findByUser(userId, limit, skip);
          break;
        case 'document':
          results = await DocumentMode.findByUser(userId, limit, skip);
          break;
        case 'image':
          results = await ImageMode.findByUser(userId, limit, skip);
          break;
        case 'conversation':
          results = await ConversationMode.findByUser(userId, limit, skip);
          break;
        case 'call':
          results = await VoiceCallMode.findByUser(userId, limit, skip);
          break;
        default:
          // Get all types
          const [voice, text, document, image, conversation, call] = await Promise.all([
            VoiceMode.findByUser(userId, Math.ceil(limit / 6), 0),
            TextMode.findByUser(userId, Math.ceil(limit / 6), 0),
            DocumentMode.findByUser(userId, Math.ceil(limit / 6), 0),
            ImageMode.findByUser(userId, Math.ceil(limit / 6), 0),
            ConversationMode.findByUser(userId, Math.ceil(limit / 6), 0),
            VoiceCallMode.findByUser(userId, Math.ceil(limit / 6), 0)
          ]);

          results = [...voice, ...text, ...document, ...image, ...conversation, ...call]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, limit);
      }

      return {
        success: true,
        results,
        pagination: {
          page,
          limit,
          total: results.length
        }
      };
    } catch (error) {
      console.error('Get translation history error:', error);
      throw new Error(`Failed to get translation history: ${error.message}`);
    }
  }

  // Get Translation Statistics
  async getTranslationStatistics(userId) {
    try {
      const [voiceStats, textStats, documentStats, imageStats, conversationStats, callStats] = await Promise.all([
        VoiceMode.getUserStats(userId),
        TextMode.getUserStats(userId),
        DocumentMode.getUserStats(userId),
        ImageMode.getUserStats(userId),
        ConversationMode.getUserStats(userId),
        VoiceCallMode.getUserStats(userId)
      ]);

      return {
        success: true,
        statistics: {
          voice: voiceStats[0] || {},
          text: textStats[0] || {},
          document: documentStats[0] || {},
          image: imageStats[0] || {},
          conversation: conversationStats[0] || {},
          call: callStats[0] || {}
        }
      };
    } catch (error) {
      console.error('Get translation statistics error:', error);
      throw new Error(`Failed to get translation statistics: ${error.message}`);
    }
  }
}

module.exports = new TranslationService();
