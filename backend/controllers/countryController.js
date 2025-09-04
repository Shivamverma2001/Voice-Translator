const countryService = require('../services/countryService');

class CountryController {
  /**
   * Get all active countries
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAllCountries(req, res) {
    try {
      const result = await countryService.getAllCountries();
      
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: 'Countries retrieved successfully',
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
   * Get all countries (including inactive) - Admin only
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAllCountriesAdmin(req, res) {
    try {
      const result = await countryService.getAllCountriesAdmin();
      
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: 'All countries retrieved successfully',
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
   * Get country by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getCountryById(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Country ID is required'
        });
      }

      const result = await countryService.getCountryById(id);
      
      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: 'Country retrieved successfully',
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
   * Get country by ID (including inactive) - Admin only
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getCountryByIdAdmin(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Country ID is required'
        });
      }

      const result = await countryService.getCountryByIdAdmin(id);
      
      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: 'Country retrieved successfully',
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
   * Create new country
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createCountry(req, res) {
    try {
      const countryData = req.body;
      
      // Validate required fields
      if (!countryData.name) {
        return res.status(400).json({
          success: false,
          message: 'Country name is required'
        });
      }

      const result = await countryService.createCountry(countryData);
      
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error
        });
      }

      res.status(201).json({
        success: true,
        message: 'Country created successfully',
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
   * Update country by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateCountry(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Country ID is required'
        });
      }

      const result = await countryService.updateCountry(id, updateData);
      
      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: 'Country updated successfully',
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
   * Soft delete country (set isActive to false)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteCountry(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Country ID is required'
        });
      }

      const result = await countryService.deleteCountry(id);
      
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
   * Restore country (set isActive to true)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async restoreCountry(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Country ID is required'
        });
      }

      const result = await countryService.restoreCountry(id);
      
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
   * Search countries
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async searchCountries(req, res) {
    try {
      const { q } = req.query;
      
      if (!q || q.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const result = await countryService.searchCountries(q.trim());
      
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

module.exports = new CountryController();
