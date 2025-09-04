const CountryCode = require('../models/CountryCode');

class CountryCodeService {
  /**
   * Get all active country codes
   * @returns {Promise<Object>} Array of active country codes
   */
  async getAllCountryCodes() {
    try {
      const countryCodes = await CountryCode.find({ isActive: true }).sort({ country: 1 });
      return {
        success: true,
        data: countryCodes,
        count: countryCodes.length
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get all country codes (including inactive) - for admin use
   * @returns {Promise<Object>} Array of all country codes
   */
  async getAllCountryCodesAdmin() {
    try {
      const countryCodes = await CountryCode.find({}).sort({ country: 1 });
      return {
        success: true,
        data: countryCodes,
        count: countryCodes.length
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get country code by ID (only if active)
   * @param {string} id - Country code ID
   * @returns {Promise<Object>} Country code object
   */
  async getCountryCodeById(id) {
    try {
      const countryCode = await CountryCode.findOne({ _id: id, isActive: true });
      if (!countryCode) {
        return {
          success: false,
          error: 'Country code not found or inactive'
        };
      }
      return {
        success: true,
        data: countryCode
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get country code by ID (including inactive) - for admin use
   * @param {string} id - Country code ID
   * @returns {Promise<Object>} Country code object
   */
  async getCountryCodeByIdAdmin(id) {
    try {
      const countryCode = await CountryCode.findById(id);
      if (!countryCode) {
        return {
          success: false,
          error: 'Country code not found'
        };
      }
      return {
        success: true,
        data: countryCode
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get country codes by dialing code
   * @param {string} dialingCode - Dialing code (e.g., +1, +91)
   * @returns {Promise<Object>} Array of country codes
   */
  async getByDialingCode(dialingCode) {
    try {
      const countryCodes = await CountryCode.getByDialingCode(dialingCode);
      return {
        success: true,
        data: countryCodes,
        count: countryCodes.length
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Create new country code
   * @param {Object} countryCodeData - Country code data
   * @returns {Promise<Object>} Created country code
   */
  async createCountryCode(countryCodeData) {
    try {
      const countryCode = new CountryCode(countryCodeData);
      const savedCountryCode = await countryCode.save();
      
      return {
        success: true,
        data: savedCountryCode
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update country code by ID
   * @param {string} id - Country code ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated country code
   */
  async updateCountryCode(id, updateData) {
    try {
      const countryCode = await CountryCode.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!countryCode) {
        return {
          success: false,
          error: 'Country code not found'
        };
      }

      return {
        success: true,
        data: countryCode
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Soft delete country code (set isActive to false)
   * @param {string} id - Country code ID
   * @returns {Promise<Object>} Result object
   */
  async deleteCountryCode(id) {
    try {
      const countryCode = await CountryCode.findByIdAndUpdate(
        id,
        { isActive: false, updatedAt: new Date() },
        { new: true }
      );

      if (!countryCode) {
        return {
          success: false,
          error: 'Country code not found'
        };
      }

      return {
        success: true,
        message: 'Country code deactivated successfully',
        data: countryCode
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Restore country code (set isActive to true)
   * @param {string} id - Country code ID
   * @returns {Promise<Object>} Result object
   */
  async restoreCountryCode(id) {
    try {
      const countryCode = await CountryCode.findByIdAndUpdate(
        id,
        { isActive: true, updatedAt: new Date() },
        { new: true }
      );

      if (!countryCode) {
        return {
          success: false,
          error: 'Country code not found'
        };
      }

      return {
        success: true,
        message: 'Country code restored successfully',
        data: countryCode
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Search country codes by country name or dialing code
   * @param {string} query - Search query
   * @returns {Promise<Object>} Search results
   */
  async searchCountryCodes(query) {
    try {
      const countryCodes = await CountryCode.searchCountryCodes(query);
      return {
        success: true,
        data: countryCodes,
        count: countryCodes.length
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new CountryCodeService();
