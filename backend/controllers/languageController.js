const languageService = require('../services/languageService');

class LanguageController {
  /**
   * Create a new language
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createLanguage(req, res) {
    try {
      const languageData = req.body;
      const language = await languageService.createLanguage(languageData);
      
      res.status(201).json({
        success: true,
        message: 'Language created successfully',
        data: language
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  /**
   * Get all languages with pagination and filtering
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAllLanguages(req, res) {
    try {
      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 50,
        search: req.query.search || '',
        isActive: req.query.isActive !== undefined ? req.query.isActive === 'true' : null,
        sortBy: req.query.sortBy || 'name',
        sortOrder: req.query.sortOrder || 'asc'
      };

      const result = await languageService.getAllLanguages(options);
      
      res.status(200).json({
        success: true,
        message: 'Languages retrieved successfully',
        data: result.languages,
        pagination: result.pagination
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve languages',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  /**
   * Get language by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getLanguageById(req, res) {
    try {
      const { id } = req.params;
      const language = await languageService.getLanguageById(id);
      
      res.status(200).json({
        success: true,
        message: 'Language retrieved successfully',
        data: language
      });
    } catch (error) {
      if (error.message === 'Language not found') {
        res.status(404).json({
          success: false,
          message: 'Language not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to retrieve language',
          error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
      }
    }
  }

  /**
   * Get language by shortcode
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getLanguageByShortcode(req, res) {
    try {
      const { shortcode } = req.params;
      const language = await languageService.getLanguageByShortcode(shortcode);
      
      res.status(200).json({
        success: true,
        message: 'Language retrieved successfully',
        data: language
      });
    } catch (error) {
      if (error.message === 'Language not found') {
        res.status(404).json({
          success: false,
          message: 'Language not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to retrieve language',
          error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
      }
    }
  }

  /**
   * Get all active languages
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getActiveLanguages(req, res) {
    try {
      const languages = await languageService.getActiveLanguages();
      
      res.status(200).json({
        success: true,
        message: 'Active languages retrieved successfully',
        data: languages
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve active languages',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  /**
   * Search languages
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async searchLanguages(req, res) {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const languages = await languageService.searchLanguages(q);
      
      res.status(200).json({
        success: true,
        message: 'Languages search completed',
        data: languages,
        query: q
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to search languages',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  /**
   * Update language
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateLanguage(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const language = await languageService.updateLanguage(id, updateData);
      
      res.status(200).json({
        success: true,
        message: 'Language updated successfully',
        data: language
      });
    } catch (error) {
      if (error.message === 'Language not found') {
        res.status(404).json({
          success: false,
          message: 'Language not found'
        });
      } else if (error.message.includes('already exists')) {
        res.status(400).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to update language',
          error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
      }
    }
  }

  /**
   * Toggle language active status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async toggleLanguageStatus(req, res) {
    try {
      const { id } = req.params;
      const language = await languageService.toggleLanguageStatus(id);
      
      res.status(200).json({
        success: true,
        message: `Language ${language.isActive ? 'activated' : 'deactivated'} successfully`,
        data: language
      });
    } catch (error) {
      if (error.message === 'Language not found') {
        res.status(404).json({
          success: false,
          message: 'Language not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to toggle language status',
          error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
      }
    }
  }

  /**
   * Delete language
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteLanguage(req, res) {
    try {
      const { id } = req.params;
      await languageService.deleteLanguage(id);
      
      res.status(200).json({
        success: true,
        message: 'Language deleted successfully'
      });
    } catch (error) {
      if (error.message === 'Language not found') {
        res.status(404).json({
          success: false,
          message: 'Language not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to delete language',
          error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
      }
    }
  }

  /**
   * Bulk create languages
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async bulkCreateLanguages(req, res) {
    try {
      const { languages } = req.body;
      if (!Array.isArray(languages) || languages.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Languages array is required and must not be empty'
        });
      }

      const result = await languageService.bulkCreateLanguages(languages);
      
      res.status(201).json({
        success: true,
        message: `${Object.keys(result).length} languages created successfully`,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Failed to create languages',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  /**
   * Get language statistics
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getLanguageStats(req, res) {
    try {
      const stats = await languageService.getLanguageStats();
      
      res.status(200).json({
        success: true,
        message: 'Language statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve language statistics',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  /**
   * Validate language data
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async validateLanguageData(req, res) {
    try {
      const languageData = req.body;
      await languageService.validateLanguageData(languageData);
      
      res.status(200).json({
        success: true,
        message: 'Language data is valid'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Language data validation failed',
        errors: error.errors || error.message
      });
    }
  }
}

module.exports = new LanguageController();
