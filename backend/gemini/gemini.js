// Gemini AI Module Exports
// Simple export file for Gemini functionality

const geminiConnection = require('./connection');
const geminiTextProcessor = require('./textProcessor');

module.exports = {
  connection: geminiConnection,
  textProcessor: geminiTextProcessor,
  
  // Direct access to main functions
  cleanText: geminiTextProcessor.cleanText.bind(geminiTextProcessor),
  translateText: geminiTextProcessor.translateText.bind(geminiTextProcessor),
  analyzeSentiment: geminiTextProcessor.analyzeSentiment.bind(geminiTextProcessor),
  extractKeyInfo: geminiTextProcessor.extractKeyInfo.bind(geminiTextProcessor),
  speechTranslation: geminiTextProcessor.speechTranslation.bind(geminiTextProcessor),
  
  // Connection status
  isConnected: () => geminiConnection.isConnectionAvailable(),
  getStatus: () => geminiConnection.getConnectionStatus(),
  testConnection: () => geminiConnection.testConnection()
};
