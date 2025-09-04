const Country = require('../models/Country');

class CountryService {
  /**
   * Get all active countries
   * @returns {Promise<Object>} Array of active countries
   */
  async getAllCountries() {
    try {
      const countries = await Country.find({ isActive: true }).sort({ name: 1 });
      return {
        success: true,
        data: countries,
        count: countries.length
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get all countries (including inactive) - for admin use
   * @returns {Promise<Object>} Array of all countries
   */
  async getAllCountriesAdmin() {
    try {
      const countries = await Country.find({}).sort({ name: 1 });
      return {
        success: true,
        data: countries,
        count: countries.length
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get country by ID (only if active)
   * @param {string} id - Country ID
   * @returns {Promise<Object>} Country object
   */
  async getCountryById(id) {
    try {
      const country = await Country.findOne({ _id: id, isActive: true });
      if (!country) {
        return {
          success: false,
          error: 'Country not found or inactive'
        };
      }
      return {
        success: true,
        data: country
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get country by ID (including inactive) - for admin use
   * @param {string} id - Country ID
   * @returns {Promise<Object>} Country object
   */
  async getCountryByIdAdmin(id) {
    try {
      const country = await Country.findById(id);
      if (!country) {
        return {
          success: false,
          error: 'Country not found'
        };
      }
      return {
        success: true,
        data: country
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Create new country
   * @param {Object} countryData - Country data
   * @returns {Promise<Object>} Created country
   */
  async createCountry(countryData) {
    try {
      const country = new Country(countryData);
      const savedCountry = await country.save();
      
      return {
        success: true,
        data: savedCountry
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update country by ID
   * @param {string} id - Country ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated country
   */
  async updateCountry(id, updateData) {
    try {
      const country = await Country.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!country) {
        return {
          success: false,
          error: 'Country not found'
        };
      }

      return {
        success: true,
        data: country
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Soft delete country (set isActive to false)
   * @param {string} id - Country ID
   * @returns {Promise<Object>} Result object
   */
  async deleteCountry(id) {
    try {
      const country = await Country.findByIdAndUpdate(
        id,
        { isActive: false, updatedAt: new Date() },
        { new: true }
      );

      if (!country) {
        return {
          success: false,
          error: 'Country not found'
        };
      }

      return {
        success: true,
        message: 'Country deactivated successfully',
        data: country
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Restore country (set isActive to true)
   * @param {string} id - Country ID
   * @returns {Promise<Object>} Result object
   */
  async restoreCountry(id) {
    try {
      const country = await Country.findByIdAndUpdate(
        id,
        { isActive: true, updatedAt: new Date() },
        { new: true }
      );

      if (!country) {
        return {
          success: false,
          error: 'Country not found'
        };
      }

      return {
        success: true,
        message: 'Country restored successfully',
        data: country
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Search countries by name
   * @param {string} query - Search query
   * @returns {Promise<Object>} Search results
   */
  async searchCountries(query) {
    try {
      const countries = await Country.searchCountries(query);
      return {
        success: true,
        data: countries,
        count: countries.length
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new CountryService();
