const geminiConnection = require('../gemini/connection');

// Gemini AI Utility Functions
class GeminiUtils {
  constructor() {
    this.connection = geminiConnection;
  }

  // Validate text input
  validateTextInput(text) {
    if (!text || typeof text !== 'string') {
      return { valid: false, error: 'Text input must be a non-empty string' };
    }
    
    if (text.trim().length === 0) {
      return { valid: false, error: 'Text input cannot be empty' };
    }
    
    if (text.length > 10000) {
      return { valid: false, error: 'Text input too long (max 10,000 characters)' };
    }
    
    return { valid: true };
  }

  // Validate language codes
  validateLanguageCode(languageCode) {
    if (!languageCode || typeof languageCode !== 'string') {
      return { valid: false, error: 'Language code must be a non-empty string' };
    }
    
    const validLanguagePattern = /^[a-z]{2,5}(-[A-Z]{2})?$/;
    if (!validLanguagePattern.test(languageCode)) {
      return { valid: false, error: 'Invalid language code format' };
    }
    
    return { valid: true };
  }

  // Generate prompt template
  generatePromptTemplate(template, variables) {
    try {
      let prompt = template;
      
      // Replace variables in template
      Object.keys(variables).forEach(key => {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        prompt = prompt.replace(regex, variables[key]);
      });
      
      return prompt;
    } catch (error) {
      throw new Error(`Failed to generate prompt template: ${error.message}`);
    }
  }

  // Format Gemini response
  formatResponse(response, includeMetadata = true) {
    const formatted = {
      success: true,
      content: response.text().trim(),
      timestamp: new Date().toISOString()
    };

    if (includeMetadata) {
      formatted.metadata = {
        model: 'gemini-1.5-flash',
        responseTime: Date.now(),
        connectionStatus: this.connection.getConnectionStatus()
      };
    }

    return formatted;
  }

  // Handle Gemini errors
  handleError(error, context = {}) {
    const errorResponse = {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
      context: context
    };

    // Add connection status if available
    try {
      errorResponse.connectionStatus = this.connection.getConnectionStatus();
    } catch (e) {
      errorResponse.connectionStatus = 'Unable to retrieve';
    }

    return errorResponse;
  }

  // Check rate limits and quotas
  async checkQuotaStatus() {
    try {
      if (!this.connection.isConnectionAvailable()) {
        return { available: false, error: 'Connection not available' };
      }

      // This is a placeholder - actual quota checking would depend on Gemini API
      return {
        available: true,
        remainingQuota: 'Unknown',
        resetTime: 'Unknown',
        message: 'Quota checking not implemented for this API version'
      };
    } catch (error) {
      return { available: false, error: error.message };
    }
  }

  // Get system health status
  getSystemHealth() {
    return {
      timestamp: new Date().toISOString(),
      geminiConnection: this.connection.getConnectionStatus(),
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime()
    };
  }

  // Sanitize text for Gemini API
  sanitizeText(text) {
    if (!text) return '';
    
    return text
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/&/g, '&amp;') // Escape ampersands
      .replace(/"/g, '&quot;') // Escape quotes
      .replace(/'/g, '&#x27;') // Escape apostrophes
      .trim();
  }

  // Truncate text if too long
  truncateText(text, maxLength = 8000) {
    if (!text || text.length <= maxLength) {
      return text;
    }
    
    return text.substring(0, maxLength) + '...';
  }

  // Generate unique request ID
  generateRequestId() {
    return `gemini_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Log Gemini operations
  logOperation(operation, details) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      operation: operation,
      details: details,
      requestId: this.generateRequestId()
    };

    // In production, you might want to send this to a logging service
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Gemini Operation Log:', logEntry);
    }

    return logEntry;
  }
}

// Create singleton instance
const geminiUtils = new GeminiUtils();

module.exports = geminiUtils; 
