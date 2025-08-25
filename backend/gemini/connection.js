const { GoogleGenerativeAI } = require('@google/generative-ai');

// Gemini AI connection configuration
class GeminiConnection {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.genAI = null;
    this.model = null;
    this.isConnected = false;
    
    this.initialize();
  }

  // Initialize Gemini connection
  initialize() {
    try {
      if (!this.apiKey) {
        console.error('❌ GEMINI_API_KEY environment variable is required');
        this.isConnected = false;
        return;
      }

      this.genAI = new GoogleGenerativeAI(this.apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      this.isConnected = true;
      
      console.log('✅ Gemini AI connection initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Gemini AI connection:', error.message);
      this.isConnected = false;
    }
  }

  // Get Gemini model instance
  getModel() {
    if (!this.isConnected || !this.model) {
      throw new Error('Gemini AI connection not available');
    }
    return this.model;
  }

  // Check connection status
  isConnectionAvailable() {
    return this.isConnected && this.model !== null;
  }

  // Get connection status info
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      hasModel: this.model !== null,
      apiKey: this.apiKey ? '***' + this.apiKey.slice(-4) : 'Not set'
    };
  }

  // Test connection
  async testConnection() {
    try {
      if (!this.isConnectionAvailable()) {
        return { success: false, error: 'Connection not available' };
      }

      const result = await this.model.generateContent('Hello, test connection');
      const response = await result.response;
      const text = response.text();
      
      return { 
        success: true, 
        message: 'Connection test successful',
        response: text 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.message 
      };
    }
  }
}

// Create singleton instance
const geminiConnection = new GeminiConnection();

module.exports = geminiConnection; 
