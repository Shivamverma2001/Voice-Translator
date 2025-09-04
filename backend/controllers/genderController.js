const genderService = require('../services/genderService');

class GenderController {
  /**
   * Get all active genders
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAllGenders(req, res) {
    try {
      const result = await genderService.getAllGenders();
      
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: 'Genders retrieved successfully',
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
   * Get all genders (including inactive) - Admin only
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAllGendersAdmin(req, res) {
    try {
      const result = await genderService.getAllGendersAdmin();
      
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: 'All genders retrieved successfully',
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
   * Get gender by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getGenderById(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Gender ID is required'
        });
      }

      const result = await genderService.getGenderById(id);
      
      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: 'Gender retrieved successfully',
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
   * Get gender by ID (including inactive) - Admin only
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getGenderByIdAdmin(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Gender ID is required'
        });
      }

      const result = await genderService.getGenderByIdAdmin(id);
      
      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: 'Gender retrieved successfully',
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
   * Create new gender
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createGender(req, res) {
    try {
      const genderData = req.body;
      
      // Validate required fields
      if (!genderData.id || !genderData.displayName) {
        return res.status(400).json({
          success: false,
          message: 'ID and displayName are required'
        });
      }

      const result = await genderService.createGender(genderData);
      
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error
        });
      }

      res.status(201).json({
        success: true,
        message: 'Gender created successfully',
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
   * Update gender by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateGender(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Gender ID is required'
        });
      }

      const result = await genderService.updateGender(id, updateData);
      
      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: 'Gender updated successfully',
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
   * Soft delete gender (set isActive to false)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteGender(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Gender ID is required'
        });
      }

      const result = await genderService.deleteGender(id);
      
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
   * Restore gender (set isActive to true)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async restoreGender(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Gender ID is required'
        });
      }

      const result = await genderService.restoreGender(id);
      
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
   * Search genders
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async searchGenders(req, res) {
    try {
      const { q } = req.query;
      
      if (!q || q.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const result = await genderService.searchGenders(q.trim());
      
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

module.exports = new GenderController();
