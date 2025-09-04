const Gender = require('../models/Gender');

class GenderService {
  /**
   * Get all active genders
   * @returns {Promise<Array>} Array of active genders
   */
  async getAllGenders() {
    try {
      const genders = await Gender.find({ isActive: true }).sort({ displayName: 1 });
      return {
        success: true,
        data: genders,
        count: genders.length
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get all genders (including inactive) - for admin use
   * @returns {Promise<Array>} Array of all genders
   */
  async getAllGendersAdmin() {
    try {
      const genders = await Gender.find({}).sort({ displayName: 1 });
      return {
        success: true,
        data: genders,
        count: genders.length
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get gender by ID (only if active)
   * @param {string} id - Gender ID
   * @returns {Promise<Object>} Gender object
   */
  async getGenderById(id) {
    try {
      const gender = await Gender.findOne({ _id: id, isActive: true });
      if (!gender) {
        return {
          success: false,
          error: 'Gender not found or inactive'
        };
      }
      return {
        success: true,
        data: gender
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get gender by ID (including inactive) - for admin use
   * @param {string} id - Gender ID
   * @returns {Promise<Object>} Gender object
   */
  async getGenderByIdAdmin(id) {
    try {
      const gender = await Gender.findById(id);
      if (!gender) {
        return {
          success: false,
          error: 'Gender not found'
        };
      }
      return {
        success: true,
        data: gender
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Create new gender
   * @param {Object} genderData - Gender data
   * @returns {Promise<Object>} Created gender
   */
  async createGender(genderData) {
    try {
      // Check if gender with same id already exists
      const existingGender = await Gender.findOne({ id: genderData.id });
      if (existingGender) {
        return {
          success: false,
          error: 'Gender with this ID already exists'
        };
      }

      const gender = new Gender(genderData);
      const savedGender = await gender.save();
      
      return {
        success: true,
        data: savedGender
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update gender by ID
   * @param {string} id - Gender ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated gender
   */
  async updateGender(id, updateData) {
    try {
      const gender = await Gender.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!gender) {
        return {
          success: false,
          error: 'Gender not found'
        };
      }

      return {
        success: true,
        data: gender
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Soft delete gender (set isActive to false)
   * @param {string} id - Gender ID
   * @returns {Promise<Object>} Result object
   */
  async deleteGender(id) {
    try {
      const gender = await Gender.findByIdAndUpdate(
        id,
        { isActive: false, updatedAt: new Date() },
        { new: true }
      );

      if (!gender) {
        return {
          success: false,
          error: 'Gender not found'
        };
      }

      return {
        success: true,
        message: 'Gender deactivated successfully',
        data: gender
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Restore gender (set isActive to true)
   * @param {string} id - Gender ID
   * @returns {Promise<Object>} Result object
   */
  async restoreGender(id) {
    try {
      const gender = await Gender.findByIdAndUpdate(
        id,
        { isActive: true, updatedAt: new Date() },
        { new: true }
      );

      if (!gender) {
        return {
          success: false,
          error: 'Gender not found'
        };
      }

      return {
        success: true,
        message: 'Gender restored successfully',
        data: gender
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Search genders by display name or description
   * @param {string} query - Search query
   * @returns {Promise<Object>} Search results
   */
  async searchGenders(query) {
    try {
      const genders = await Gender.searchGenders(query);
      return {
        success: true,
        data: genders,
        count: genders.length
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new GenderService();
