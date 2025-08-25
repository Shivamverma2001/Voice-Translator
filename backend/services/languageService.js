const Language = require('../models/Language');

class LanguageService {
  /**
   * Create a new language
   * @param {Object} languageData - Language data
   * @returns {Promise<Object>} Created language
   */
  async createLanguage(languageData) {
    try {
      const language = new Language(languageData);
      const savedLanguage = await language.save();
      return savedLanguage;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('Language with this shortcode already exists');
      }
      throw error;
    }
  }

  /**
   * Get all languages with pagination and filtering
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Languages and pagination info
   */
  async getAllLanguages(options = {}) {
    try {
      const {
        page = 1,
        limit = 50,
        search = '',
        isActive = null,
        sortBy = 'name',
        sortOrder = 'asc'
      } = options;

      // Build query
      const query = {};
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { country: { $regex: search, $options: 'i' } },
          { shortcode: { $regex: search, $options: 'i' } }
        ];
      }
      if (isActive !== null) {
        query.isActive = isActive;
      }

      // Build sort object
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Execute query with pagination
      const skip = (page - 1) * limit;
      const [languages, total] = await Promise.all([
        Language.find(query)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
        Language.countDocuments(query)
      ]);

      return {
        languages,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get language by ID
   * @param {string} id - Language ID
   * @returns {Promise<Object>} Language object
   */
  async getLanguageById(id) {
    try {
      const language = await Language.findById(id);
      if (!language) {
        throw new Error('Language not found');
      }
      return language;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get language by shortcode
   * @param {string} shortcode - Language shortcode
   * @returns {Promise<Object>} Language object
   */
  async getLanguageByShortcode(shortcode) {
    try {
      const language = await Language.getByShortcode(shortcode);
      if (!language) {
        throw new Error('Language not found');
      }
      return language;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all active languages
   * @returns {Promise<Array>} Array of active languages
   */
  async getActiveLanguages() {
    try {
      return await Language.getActiveLanguages();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Search languages
   * @param {string} query - Search query
   * @returns {Promise<Array>} Array of matching languages
   */
  async searchLanguages(query) {
    try {
      return await Language.searchLanguages(query);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update language
   * @param {string} id - Language ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated language
   */
  async updateLanguage(id, updateData) {
    try {
      const language = await Language.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      if (!language) {
        throw new Error('Language not found');
      }
      return language;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('Language with this shortcode already exists');
      }
      throw error;
    }
  }

  /**
   * Toggle language active status
   * @param {string} id - Language ID
   * @returns {Promise<Object>} Updated language
   */
  async toggleLanguageStatus(id) {
    try {
      const language = await this.getLanguageById(id);
      return await language.toggleActive();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete language
   * @param {string} id - Language ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteLanguage(id) {
    try {
      const result = await Language.findByIdAndDelete(id);
      if (!result) {
        throw new Error('Language not found');
      }
      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Bulk create languages
   * @param {Array} languagesData - Array of language data
   * @returns {Promise<Array>} Array of created languages
   */
  async bulkCreateLanguages(languagesData) {
    try {
      const languages = await Language.insertMany(languagesData, { 
        ordered: false,
        rawResult: true 
      });
      return languages.insertedIds;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get language statistics
   * @returns {Promise<Object>} Language statistics
   */
  async getLanguageStats() {
    try {
      const [total, active, inactive] = await Promise.all([
        Language.countDocuments(),
        Language.countDocuments({ isActive: true }),
        Language.countDocuments({ isActive: false })
      ]);

      return {
        total,
        active,
        inactive,
        activePercentage: total > 0 ? Math.round((active / total) * 100) : 0
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Validate language data
   * @param {Object} languageData - Language data to validate
   * @returns {Promise<boolean>} Validation result
   */
  async validateLanguageData(languageData) {
    try {
      const language = new Language(languageData);
      await language.validate();
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new LanguageService();
