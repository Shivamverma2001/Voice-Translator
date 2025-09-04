const themeService = require('../services/themeService');

class ThemeController {
  /**
   * Get all active themes
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAllThemes(req, res) {
    try {
      const filters = {
        category: req.query.category
      };

      const result = await themeService.getAllThemes(filters);
      
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: 'Themes retrieved successfully',
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
   * Get all themes (including inactive) - Admin only
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAllThemesAdmin(req, res) {
    try {
      const filters = {
        category: req.query.category
      };

      const result = await themeService.getAllThemesAdmin(filters);
      
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: 'All themes retrieved successfully',
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
   * Get theme by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getThemeById(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Theme ID is required'
        });
      }

      const result = await themeService.getThemeById(id);
      
      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: 'Theme retrieved successfully',
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
   * Get theme by ID (including inactive) - Admin only
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getThemeByIdAdmin(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Theme ID is required'
        });
      }

      const result = await themeService.getThemeByIdAdmin(id);
      
      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: 'Theme retrieved successfully',
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
   * Get themes by category
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getThemesByCategory(req, res) {
    try {
      const { category } = req.params;
      
      if (!category) {
        return res.status(400).json({
          success: false,
          message: 'Category is required'
        });
      }

      const result = await themeService.getThemesByCategory(category);
      
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: `Themes for category '${category}' retrieved successfully`,
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
   * Get default theme
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getDefaultTheme(req, res) {
    try {
      const result = await themeService.getDefaultTheme();
      
      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: 'Default theme retrieved successfully',
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
   * Create new theme
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createTheme(req, res) {
    try {
      const themeData = req.body;
      
      // Validate required fields
      if (!themeData.id || !themeData.displayName || !themeData.category) {
        return res.status(400).json({
          success: false,
          message: 'ID, displayName, and category are required'
        });
      }

      const result = await themeService.createTheme(themeData);
      
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error
        });
      }

      res.status(201).json({
        success: true,
        message: 'Theme created successfully',
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
   * Update theme by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateTheme(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Theme ID is required'
        });
      }

      const result = await themeService.updateTheme(id, updateData);
      
      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: 'Theme updated successfully',
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
   * Soft delete theme (set isActive to false)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteTheme(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Theme ID is required'
        });
      }

      const result = await themeService.deleteTheme(id);
      
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
   * Restore theme (set isActive to true)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async restoreTheme(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Theme ID is required'
        });
      }

      const result = await themeService.restoreTheme(id);
      
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
   * Search themes
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async searchThemes(req, res) {
    try {
      const { q } = req.query;
      
      if (!q || q.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const result = await themeService.searchThemes(q.trim());
      
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
   * Get unique categories
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getUniqueCategories(req, res) {
    try {
      const result = await themeService.getUniqueCategories();
      
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: 'Unique categories retrieved successfully',
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

module.exports = new ThemeController();
