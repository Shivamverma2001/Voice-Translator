const Theme = require('../models/Theme');

class ThemeService {
  /**
   * Get all active themes
   * @param {Object} filters - Optional filters (category)
   * @returns {Promise<Object>} Array of active themes
   */
  async getAllThemes(filters = {}) {
    try {
      const query = { isActive: true };
      
      // Apply filters
      if (filters.category) {
        query.category = new RegExp(filters.category, 'i');
      }

      const themes = await Theme.find(query).sort({ category: 1, displayName: 1 });
      return {
        success: true,
        data: themes,
        count: themes.length
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get all themes (including inactive) - for admin use
   * @param {Object} filters - Optional filters
   * @returns {Promise<Object>} Array of all themes
   */
  async getAllThemesAdmin(filters = {}) {
    try {
      const query = {};
      
      // Apply filters
      if (filters.category) {
        query.category = new RegExp(filters.category, 'i');
      }

      const themes = await Theme.find(query).sort({ category: 1, displayName: 1 });
      return {
        success: true,
        data: themes,
        count: themes.length
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get theme by ID (only if active)
   * @param {string} id - Theme ID
   * @returns {Promise<Object>} Theme object
   */
  async getThemeById(id) {
    try {
      const theme = await Theme.findOne({ _id: id, isActive: true });
      if (!theme) {
        return {
          success: false,
          error: 'Theme not found or inactive'
        };
      }
      return {
        success: true,
        data: theme
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get theme by ID (including inactive) - for admin use
   * @param {string} id - Theme ID
   * @returns {Promise<Object>} Theme object
   */
  async getThemeByIdAdmin(id) {
    try {
      const theme = await Theme.findById(id);
      if (!theme) {
        return {
          success: false,
          error: 'Theme not found'
        };
      }
      return {
        success: true,
        data: theme
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get themes by category
   * @param {string} category - Theme category (Light, Dark, etc.)
   * @returns {Promise<Object>} Array of themes for the category
   */
  async getThemesByCategory(category) {
    try {
      const themes = await Theme.find({ 
        category: new RegExp(category, 'i'), 
        isActive: true 
      }).sort({ displayName: 1 });
      
      return {
        success: true,
        data: themes,
        count: themes.length
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get default theme (first active theme)
   * @returns {Promise<Object>} Default theme
   */
  async getDefaultTheme() {
    try {
      const theme = await Theme.findOne({ isActive: true }).sort({ createdAt: 1 });
      if (!theme) {
        return {
          success: false,
          error: 'No active theme found'
        };
      }
      return {
        success: true,
        data: theme
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Create new theme
   * @param {Object} themeData - Theme data
   * @returns {Promise<Object>} Created theme
   */
  async createTheme(themeData) {
    try {
      // Check if theme with same id already exists
      const existingTheme = await Theme.findOne({ id: themeData.id });
      if (existingTheme) {
        return {
          success: false,
          error: 'Theme with this ID already exists'
        };
      }

      const theme = new Theme(themeData);
      const savedTheme = await theme.save();
      
      return {
        success: true,
        data: savedTheme
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update theme by ID
   * @param {string} id - Theme ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated theme
   */
  async updateTheme(id, updateData) {
    try {
      const theme = await Theme.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!theme) {
        return {
          success: false,
          error: 'Theme not found'
        };
      }

      return {
        success: true,
        data: theme
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Soft delete theme (set isActive to false)
   * @param {string} id - Theme ID
   * @returns {Promise<Object>} Result object
   */
  async deleteTheme(id) {
    try {
      const theme = await Theme.findByIdAndUpdate(
        id,
        { isActive: false, updatedAt: new Date() },
        { new: true }
      );

      if (!theme) {
        return {
          success: false,
          error: 'Theme not found'
        };
      }

      return {
        success: true,
        message: 'Theme deactivated successfully',
        data: theme
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Restore theme (set isActive to true)
   * @param {string} id - Theme ID
   * @returns {Promise<Object>} Result object
   */
  async restoreTheme(id) {
    try {
      const theme = await Theme.findByIdAndUpdate(
        id,
        { isActive: true, updatedAt: new Date() },
        { new: true }
      );

      if (!theme) {
        return {
          success: false,
          error: 'Theme not found'
        };
      }

      return {
        success: true,
        message: 'Theme restored successfully',
        data: theme
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Search themes by display name, category, or description
   * @param {string} query - Search query
   * @returns {Promise<Object>} Search results
   */
  async searchThemes(query) {
    try {
      const themes = await Theme.searchThemes(query);
      return {
        success: true,
        data: themes,
        count: themes.length
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get unique categories from active themes
   * @returns {Promise<Object>} Array of unique categories
   */
  async getUniqueCategories() {
    try {
      const categories = await Theme.distinct('category', { isActive: true });
      return {
        success: true,
        data: categories.sort()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new ThemeService();
