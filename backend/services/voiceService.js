const Voice = require('../models/Voice');

class VoiceService {
  /**
   * Get all active voices
   * @param {Object} filters - Optional filters (language, country, gender)
   * @returns {Promise<Object>} Array of active voices
   */
  async getAllVoices(filters = {}) {
    try {
      const query = { isActive: true };
      
      // Apply filters
      if (filters.language) {
        query.language = new RegExp(filters.language, 'i');
      }
      if (filters.country) {
        query.country = new RegExp(filters.country, 'i');
      }
      if (filters.gender) {
        query.gender = new RegExp(filters.gender, 'i');
      }

      const voices = await Voice.find(query).sort({ language: 1, country: 1, gender: 1 });
      return {
        success: true,
        data: voices,
        count: voices.length
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get all voices (including inactive) - for admin use
   * @param {Object} filters - Optional filters
   * @returns {Promise<Object>} Array of all voices
   */
  async getAllVoicesAdmin(filters = {}) {
    try {
      const query = {};
      
      // Apply filters
      if (filters.language) {
        query.language = new RegExp(filters.language, 'i');
      }
      if (filters.country) {
        query.country = new RegExp(filters.country, 'i');
      }
      if (filters.gender) {
        query.gender = new RegExp(filters.gender, 'i');
      }

      const voices = await Voice.find(query).sort({ language: 1, country: 1, gender: 1 });
      return {
        success: true,
        data: voices,
        count: voices.length
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get voice by ID (only if active)
   * @param {string} id - Voice ID
   * @returns {Promise<Object>} Voice object
   */
  async getVoiceById(id) {
    try {
      const voice = await Voice.findOne({ _id: id, isActive: true });
      if (!voice) {
        return {
          success: false,
          error: 'Voice not found or inactive'
        };
      }
      return {
        success: true,
        data: voice
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get voice by ID (including inactive) - for admin use
   * @param {string} id - Voice ID
   * @returns {Promise<Object>} Voice object
   */
  async getVoiceByIdAdmin(id) {
    try {
      const voice = await Voice.findById(id);
      if (!voice) {
        return {
          success: false,
          error: 'Voice not found'
        };
      }
      return {
        success: true,
        data: voice
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get voices by language
   * @param {string} language - Language name
   * @returns {Promise<Object>} Array of voices for the language
   */
  async getVoicesByLanguage(language) {
    try {
      const voices = await Voice.find({ 
        language: new RegExp(language, 'i'), 
        isActive: true 
      }).sort({ country: 1, gender: 1 });
      
      return {
        success: true,
        data: voices,
        count: voices.length
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get voices by country
   * @param {string} country - Country name
   * @returns {Promise<Object>} Array of voices for the country
   */
  async getVoicesByCountry(country) {
    try {
      const voices = await Voice.find({ 
        country: new RegExp(country, 'i'), 
        isActive: true 
      }).sort({ language: 1, gender: 1 });
      
      return {
        success: true,
        data: voices,
        count: voices.length
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get voices by gender
   * @param {string} gender - Gender (Male/Female)
   * @returns {Promise<Object>} Array of voices for the gender
   */
  async getVoicesByGender(gender) {
    try {
      const voices = await Voice.find({ 
        gender: new RegExp(gender, 'i'), 
        isActive: true 
      }).sort({ language: 1, country: 1 });
      
      return {
        success: true,
        data: voices,
        count: voices.length
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Create new voice
   * @param {Object} voiceData - Voice data
   * @returns {Promise<Object>} Created voice
   */
  async createVoice(voiceData) {
    try {
      // Check if voice with same id already exists
      const existingVoice = await Voice.findOne({ id: voiceData.id });
      if (existingVoice) {
        return {
          success: false,
          error: 'Voice with this ID already exists'
        };
      }

      const voice = new Voice(voiceData);
      const savedVoice = await voice.save();
      
      return {
        success: true,
        data: savedVoice
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update voice by ID
   * @param {string} id - Voice ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated voice
   */
  async updateVoice(id, updateData) {
    try {
      const voice = await Voice.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!voice) {
        return {
          success: false,
          error: 'Voice not found'
        };
      }

      return {
        success: true,
        data: voice
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Soft delete voice (set isActive to false)
   * @param {string} id - Voice ID
   * @returns {Promise<Object>} Result object
   */
  async deleteVoice(id) {
    try {
      const voice = await Voice.findByIdAndUpdate(
        id,
        { isActive: false, updatedAt: new Date() },
        { new: true }
      );

      if (!voice) {
        return {
          success: false,
          error: 'Voice not found'
        };
      }

      return {
        success: true,
        message: 'Voice deactivated successfully',
        data: voice
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Restore voice (set isActive to true)
   * @param {string} id - Voice ID
   * @returns {Promise<Object>} Result object
   */
  async restoreVoice(id) {
    try {
      const voice = await Voice.findByIdAndUpdate(
        id,
        { isActive: true, updatedAt: new Date() },
        { new: true }
      );

      if (!voice) {
        return {
          success: false,
          error: 'Voice not found'
        };
      }

      return {
        success: true,
        message: 'Voice restored successfully',
        data: voice
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Search voices by name, language, country, or description
   * @param {string} query - Search query
   * @returns {Promise<Object>} Search results
   */
  async searchVoices(query) {
    try {
      const voices = await Voice.searchVoices(query);
      return {
        success: true,
        data: voices,
        count: voices.length
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get unique languages from active voices
   * @returns {Promise<Object>} Array of unique languages
   */
  async getUniqueLanguages() {
    try {
      const languages = await Voice.distinct('language', { isActive: true });
      return {
        success: true,
        data: languages.sort()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get unique countries from active voices
   * @returns {Promise<Object>} Array of unique countries
   */
  async getUniqueCountries() {
    try {
      const countries = await Voice.distinct('country', { isActive: true });
      return {
        success: true,
        data: countries.sort()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new VoiceService();
