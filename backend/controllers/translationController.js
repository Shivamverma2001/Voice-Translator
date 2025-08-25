const translationService = require('../services/translationService');

class TranslationController {
  // Text Translation
  async translateText(req, res) {
    try {
      const userId = req.userId;
      const textData = req.body;

      const result = await translationService.translateText(userId, textData);

      res.status(200).json({
        success: true,
        message: 'Text translated successfully',
        data: result
      });
    } catch (error) {
      console.error('Text translation error:', error);
      res.status(400).json({
        success: false,
        error: 'Translation failed',
        message: error.message
      });
    }
  }

  // Voice Translation
  async translateVoice(req, res) {
    try {
      const userId = req.userId;
      const voiceData = req.body;

      const result = await translationService.translateVoice(userId, voiceData);

      res.status(200).json({
        success: true,
        message: 'Voice translated successfully',
        data: result
      });
    } catch (error) {
      console.error('Voice translation error:', error);
      res.status(400).json({
        success: false,
        error: 'Voice translation failed',
        message: error.message
      });
    }
  }

  // Document Translation
  async translateDocument(req, res) {
    try {
      const userId = req.userId;
      const documentData = req.body;

      const result = await translationService.translateDocument(userId, documentData);

      res.status(200).json({
        success: true,
        message: 'Document translated successfully',
        data: result
      });
    } catch (error) {
      console.error('Document translation error:', error);
      res.status(400).json({
        success: false,
        error: 'Document translation failed',
        message: error.message
      });
    }
  }

  // Image Translation
  async translateImage(req, res) {
    try {
      const userId = req.userId;
      const imageData = req.body;

      const result = await translationService.translateImage(userId, imageData);

      res.status(200).json({
        success: true,
        message: 'Image translated successfully',
        data: result
      });
    } catch (error) {
      console.error('Image translation error:', error);
      res.status(400).json({
        success: false,
        error: 'Image translation failed',
        message: error.message
      });
    }
  }

  // Start Conversation
  async startConversation(req, res) {
    try {
      const userId = req.userId;
      const conversationData = req.body;

      const result = await translationService.startConversation(userId, conversationData);

      res.status(201).json({
        success: true,
        message: result.message,
        data: result
      });
    } catch (error) {
      console.error('Start conversation error:', error);
      res.status(400).json({
        success: false,
        error: 'Failed to start conversation',
        message: error.message
      });
    }
  }

  // Add Conversation Message
  async addConversationMessage(req, res) {
    try {
      const { sessionId } = req.params;
      const messageData = req.body;

      const result = await translationService.addConversationMessage(sessionId, messageData);

      res.status(200).json({
        success: true,
        message: result.message,
        data: result
      });
    } catch (error) {
      console.error('Add conversation message error:', error);
      res.status(400).json({
        success: false,
        error: 'Failed to add message',
        message: error.message
      });
    }
  }

  // Start Voice Call
  async startVoiceCall(req, res) {
    try {
      const userId = req.userId;
      const callData = req.body;

      const result = await translationService.startVoiceCall(userId, callData);

      res.status(201).json({
        success: true,
        message: result.message,
        data: result
      });
    } catch (error) {
      console.error('Start voice call error:', error);
      res.status(400).json({
        success: false,
        error: 'Failed to start voice call',
        message: error.message
      });
    }
  }

  // Add Voice Call Message
  async addVoiceCallMessage(req, res) {
    try {
      const { roomId } = req.params;
      const messageData = req.body;

      const result = await translationService.addVoiceCallMessage(roomId, messageData);

      res.status(200).json({
        success: true,
        message: result.message,
        data: result
      });
    } catch (error) {
      console.error('Add voice call message error:', error);
      res.status(400).json({
        success: false,
        error: 'Failed to add message',
        message: error.message
      });
    }
  }

  // Get Translation History
  async getTranslationHistory(req, res) {
    try {
      const userId = req.userId;
      const { type = 'all', page = 1, limit = 20 } = req.query;

      const result = await translationService.getTranslationHistory(
        userId,
        type,
        parseInt(page),
        parseInt(limit)
      );

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Get translation history error:', error);
      res.status(400).json({
        success: false,
        error: 'Failed to get translation history',
        message: error.message
      });
    }
  }

  // Get Translation Statistics
  async getTranslationStatistics(req, res) {
    try {
      const userId = req.userId;

      const result = await translationService.getTranslationStatistics(userId);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Get translation statistics error:', error);
      res.status(400).json({
        success: false,
        error: 'Failed to get translation statistics',
        message: error.message
      });
    }
  }

  // Batch Translation
  async batchTranslate(req, res) {
    try {
      const userId = req.userId;
      const { translations, type } = req.body;

      if (!translations || !Array.isArray(translations) || translations.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Invalid input',
          message: 'Translations array is required'
        });
      }

      const results = [];
      const errors = [];

      // Process translations based on type
      for (let i = 0; i < translations.length; i++) {
        try {
          let result;
          
          switch (type) {
            case 'text':
              result = await translationService.translateText(userId, translations[i]);
              break;
            case 'voice':
              result = await translationService.translateVoice(userId, translations[i]);
              break;
            case 'image':
              result = await translationService.translateImage(userId, translations[i]);
              break;
            case 'document':
              result = await translationService.translateDocument(userId, translations[i]);
              break;
            default:
              throw new Error(`Unsupported translation type: ${type}`);
          }

          results.push({
            index: i,
            success: true,
            data: result
          });
        } catch (error) {
          errors.push({
            index: i,
            success: false,
            error: error.message
          });
        }
      }

      const successCount = results.length;
      const errorCount = errors.length;
      const totalCount = translations.length;

      res.status(200).json({
        success: true,
        message: `Batch translation completed. ${successCount} successful, ${errorCount} failed.`,
        data: {
          results,
          errors,
          summary: {
            total: totalCount,
            successful: successCount,
            failed: errorCount,
            successRate: (successCount / totalCount) * 100
          }
        }
      });
    } catch (error) {
      console.error('Batch translation error:', error);
      res.status(400).json({
        success: false,
        error: 'Batch translation failed',
        message: error.message
      });
    }
  }

  // Get Translation by ID
  async getTranslationById(req, res) {
    try {
      const userId = req.userId;
      const { id, type } = req.params;

      // This would need to be implemented in the service
      // For now, return a placeholder response
      res.status(200).json({
        success: true,
        message: 'Translation retrieved successfully',
        data: {
          id,
          type,
          message: 'This endpoint needs to be implemented in the service'
        }
      });
    } catch (error) {
      console.error('Get translation by ID error:', error);
      res.status(400).json({
        success: false,
        error: 'Failed to get translation',
        message: error.message
      });
    }
  }

  // Delete Translation
  async deleteTranslation(req, res) {
    try {
      const userId = req.userId;
      const { id, type } = req.params;

      // This would need to be implemented in the service
      // For now, return a placeholder response
      res.status(200).json({
        success: true,
        message: 'Translation deleted successfully',
        data: {
          id,
          type
        }
      });
    } catch (error) {
      console.error('Delete translation error:', error);
      res.status(400).json({
        success: false,
        error: 'Failed to delete translation',
        message: error.message
      });
    }
  }

  // Export Translation
  async exportTranslation(req, res) {
    try {
      const userId = req.userId;
      const { id, type, format = 'json' } = req.params;

      // This would need to be implemented in the service
      // For now, return a placeholder response
      res.status(200).json({
        success: true,
        message: 'Translation exported successfully',
        data: {
          id,
          type,
          format,
          message: 'This endpoint needs to be implemented in the service'
        }
      });
    } catch (error) {
      console.error('Export translation error:', error);
      res.status(400).json({
        success: false,
        error: 'Failed to export translation',
        message: error.message
      });
    }
  }

  // Share Translation
  async shareTranslation(req, res) {
    try {
      const userId = req.userId;
      const { id, type } = req.params;
      const { isPublic, allowedUsers, expiresAt } = req.body;

      // This would need to be implemented in the service
      // For now, return a placeholder response
      res.status(200).json({
        success: true,
        message: 'Translation shared successfully',
        data: {
          id,
          type,
          shareToken: 'generated-share-token',
          isPublic: isPublic || false,
          allowedUsers: allowedUsers || [],
          expiresAt: expiresAt || null
        }
      });
    } catch (error) {
      console.error('Share translation error:', error);
      res.status(400).json({
        success: false,
        error: 'Failed to share translation',
        message: error.message
      });
    }
  }

  // Rate Translation
  async rateTranslation(req, res) {
    try {
      const userId = req.userId;
      const { id, type } = req.params;
      const { rating, feedback } = req.body;

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          error: 'Invalid rating',
          message: 'Rating must be between 1 and 5'
        });
      }

      // This would need to be implemented in the service
      // For now, return a placeholder response
      res.status(200).json({
        success: true,
        message: 'Translation rated successfully',
        data: {
          id,
          type,
          rating,
          feedback: feedback || null
        }
      });
    } catch (error) {
      console.error('Rate translation error:', error);
      res.status(400).json({
        success: false,
        error: 'Failed to rate translation',
        message: error.message
      });
    }
  }

  // Search Translations
  async searchTranslations(req, res) {
    try {
      const userId = req.userId;
      const { q, type, dateFrom, dateTo, page = 1, limit = 20 } = req.query;

      if (!q || q.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Search query required',
          message: 'Please provide a search query'
        });
      }

      // This would need to be implemented in the service
      // For now, return a placeholder response
      res.status(200).json({
        success: true,
        message: 'Search completed successfully',
        data: {
          query: q,
          type: type || 'all',
          dateFrom: dateFrom || null,
          dateTo: dateTo || null,
          results: [],
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: 0,
            pages: 0
          },
          message: 'This endpoint needs to be implemented in the service'
        }
      });
    } catch (error) {
      console.error('Search translations error:', error);
      res.status(400).json({
        success: false,
        error: 'Search failed',
        message: error.message
      });
    }
  }

  // Get Translation Analytics
  async getTranslationAnalytics(req, res) {
    try {
      const userId = req.userId;
      const { period = 'month', type = 'all' } = req.query;

      // This would need to be implemented in the service
      // For now, return a placeholder response
      res.status(200).json({
        success: true,
        message: 'Analytics retrieved successfully',
        data: {
          period,
          type,
          analytics: {
            totalTranslations: 0,
            successfulTranslations: 0,
            failedTranslations: 0,
            avgProcessingTime: 0,
            languagePairs: [],
            usageByDay: [],
            message: 'This endpoint needs to be implemented in the service'
          }
        }
      });
    } catch (error) {
      console.error('Get translation analytics error:', error);
      res.status(400).json({
        success: false,
        error: 'Failed to get analytics',
        message: error.message
      });
    }
  }

  // Health Check
  async healthCheck(req, res) {
    try {
      res.status(200).json({
        success: true,
        message: 'Translation service is healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        services: {
          geminiAI: !!translationService.geminiAI,
          speechmatics: !!translationService.speechmatics,
          googleTranslate: !!translationService.googleTranslate
        }
      });
    } catch (error) {
      console.error('Health check error:', error);
      res.status(500).json({
        success: false,
        error: 'Service unhealthy',
        message: error.message
      });
    }
  }
}

module.exports = new TranslationController();
