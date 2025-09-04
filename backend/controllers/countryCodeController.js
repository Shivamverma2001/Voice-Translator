const countryCodeService = require('../services/countryCodeService');

class CountryCodeController {
  /**
   * Get all active country codes
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAllCountryCodes(req, res) {
    try {
      const result = await countryCodeService.getAllCountryCodes();
      
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: 'Country codes retrieved successfully',
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
   * Get all country codes (including inactive) - Admin only
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAllCountryCodesAdmin(req, res) {
    try {
      const result = await countryCodeService.getAllCountryCodesAdmin();
      
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: 'All country codes retrieved successfully',
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
   * Get country code by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getCountryCodeById(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Country code ID is required'
        });
      }

      const result = await countryCodeService.getCountryCodeById(id);
      
      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: 'Country code retrieved successfully',
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
   * Get country code by ID (including inactive) - Admin only
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getCountryCodeByIdAdmin(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Country code ID is required'
        });
      }

      const result = await countryCodeService.getCountryCodeByIdAdmin(id);
      
      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: 'Country code retrieved successfully',
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
   * Get country codes by dialing code
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getByDialingCode(req, res) {
    try {
      const { dialingCode } = req.params;
      
      if (!dialingCode) {
        return res.status(400).json({
          success: false,
          message: 'Dialing code is required'
        });
      }

      const result = await countryCodeService.getByDialingCode(dialingCode);
      
      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: 'Country codes retrieved successfully',
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
   * Create new country code
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createCountryCode(req, res) {
    try {
      const countryCodeData = req.body;
      
      // Validate required fields
      if (!countryCodeData.country || !countryCodeData.countryCode || !countryCodeData.dialingCode) {
        return res.status(400).json({
          success: false,
          message: 'Country, country code, and dialing code are required'
        });
      }

      const result = await countryCodeService.createCountryCode(countryCodeData);
      
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error
        });
      }

      res.status(201).json({
        success: true,
        message: 'Country code created successfully',
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
   * Update country code by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateCountryCode(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Country code ID is required'
        });
      }

      const result = await countryCodeService.updateCountryCode(id, updateData);
      
      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: 'Country code updated successfully',
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
   * Soft delete country code (set isActive to false)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteCountryCode(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Country code ID is required'
        });
      }

      const result = await countryCodeService.deleteCountryCode(id);
      
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
   * Restore country code (set isActive to true)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async restoreCountryCode(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Country code ID is required'
        });
      }

      const result = await countryCodeService.restoreCountryCode(id);
      
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
   * Search country codes
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async searchCountryCodes(req, res) {
    try {
      const { q } = req.query;
      
      if (!q || q.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const result = await countryCodeService.searchCountryCodes(q.trim());
      
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
}

module.exports = new CountryCodeController();
