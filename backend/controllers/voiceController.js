const voiceService = require('../services/voiceService');

class VoiceController {
  /**
   * Get all active voices
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAllVoices(req, res) {
    try {
      const filters = {
        language: req.query.language,
        country: req.query.country,
        gender: req.query.gender
      };

      const result = await voiceService.getAllVoices(filters);
      
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: 'Voices retrieved successfully',
        data: result.data,
        count: result.count
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Get all voices (including inactive) - Admin only
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAllVoicesAdmin(req, res) {
    try {
      const filters = {
        language: req.query.language,
        country: req.query.country,
        gender: req.query.gender
      };

      const result = await voiceService.getAllVoicesAdmin(filters);
      
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: 'All voices retrieved successfully',
        data: result.data,
        count: result.count
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Get voice by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getVoiceById(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Voice ID is required'
        });
      }

      const result = await voiceService.getVoiceById(id);
      
      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: 'Voice retrieved successfully',
        data: result.data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Get voice by ID (including inactive) - Admin only
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getVoiceByIdAdmin(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Voice ID is required'
        });
      }

      const result = await voiceService.getVoiceByIdAdmin(id);
      
      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: 'Voice retrieved successfully',
        data: result.data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Get voices by language
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getVoicesByLanguage(req, res) {
    try {
      const { language } = req.params;
      
      if (!language) {
        return res.status(400).json({
          success: false,
          message: 'Language is required'
        });
      }

      const result = await voiceService.getVoicesByLanguage(language);
      
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: `Voices for language '${language}' retrieved successfully`,
        data: result.data,
        count: result.count
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Get voices by country
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getVoicesByCountry(req, res) {
    try {
      const { country } = req.params;
      
      if (!country) {
        return res.status(400).json({
          success: false,
          message: 'Country is required'
        });
      }

      const result = await voiceService.getVoicesByCountry(country);
      
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: `Voices for country '${country}' retrieved successfully`,
        data: result.data,
        count: result.count
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Get voices by gender
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getVoicesByGender(req, res) {
    try {
      const { gender } = req.params;
      
      if (!gender) {
        return res.status(400).json({
          success: false,
          message: 'Gender is required'
        });
      }

      const result = await voiceService.getVoicesByGender(gender);
      
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: `Voices for gender '${gender}' retrieved successfully`,
        data: result.data,
        count: result.count
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Create new voice
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createVoice(req, res) {
    try {
      const voiceData = req.body;
      
      // Validate required fields
      if (!voiceData.id || !voiceData.name || !voiceData.language) {
        return res.status(400).json({
          success: false,
          message: 'ID, name, and language are required'
        });
      }

      const result = await voiceService.createVoice(voiceData);
      
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error
        });
      }

      res.status(201).json({
        success: true,
        message: 'Voice created successfully',
        data: result.data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Update voice by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateVoice(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Voice ID is required'
        });
      }

      const result = await voiceService.updateVoice(id, updateData);
      
      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: 'Voice updated successfully',
        data: result.data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Soft delete voice (set isActive to false)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteVoice(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Voice ID is required'
        });
      }

      const result = await voiceService.deleteVoice(id);
      
      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Restore voice (set isActive to true)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async restoreVoice(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Voice ID is required'
        });
      }

      const result = await voiceService.restoreVoice(id);
      
      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Search voices
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async searchVoices(req, res) {
    try {
      const { q } = req.query;
      
      if (!q || q.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const result = await voiceService.searchVoices(q.trim());
      
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: 'Search completed successfully',
        data: result.data,
        count: result.count
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Get unique languages
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getUniqueLanguages(req, res) {
    try {
      const result = await voiceService.getUniqueLanguages();
      
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: 'Unique languages retrieved successfully',
        data: result.data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Get unique countries
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getUniqueCountries(req, res) {
    try {
      const result = await voiceService.getUniqueCountries();
      
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: 'Unique countries retrieved successfully',
        data: result.data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

module.exports = new VoiceController();
