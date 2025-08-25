// Clerk Backend Integration
// This module provides complete Clerk authentication integration with your MongoDB backend

const clerkService = require('./clerkService');
const webhookHandler = require('./webhookHandler');
const config = require('../config');

module.exports = {
  // Service for user management
  clerkService,
  
  // Webhook handler for Clerk events
  webhookHandler,
  
  // Configuration
  config: config.clerk,
  
  // Initialize Clerk integration
  initialize: () => {
    try {
      console.log('🔐 Clerk Backend Integration Initialized');
      console.log(`📍 API URL: ${config.clerk.apiUrl}`);
      console.log(`🔑 Secret Key: ${config.clerk.secretKey ? '✅ Configured' : '❌ Missing'}`);
      console.log(`🔗 Webhook Secret: ${config.clerk.webhookSecret ? '✅ Configured' : '❌ Missing'}`);
      
      // Check if Clerk service is ready
      if (!clerkService.isReady()) {
        throw new Error('Clerk service not properly initialized');
      }
      
      console.log('✅ Clerk service is ready');
      
      return {
        service: clerkService,
        webhookHandler
      };
    } catch (error) {
      console.error('❌ Clerk initialization failed:', error);
      throw error;
    }
  }
};
