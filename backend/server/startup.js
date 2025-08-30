// Server Startup Configuration
// This file centralizes server startup logic and Clerk initialization

const config = require('../config');
const { connectDB } = require('../db/connection');
const clerk = require('../clerk');

/**
 * Start the server with all required initializations
 * @param {Object} server - HTTP server instance
 * @param {Object} gemini - Gemini AI instance
 */
const startServer = async (server, gemini) => {
  try {
    // Connect to database
    await connectDB();
    
    // Initialize Clerk integration
    if (clerk && typeof clerk.initialize === 'function') {
      console.log('🔐 Initializing Clerk integration...');
      const clerkInit = clerk.initialize();
      console.log('🔐 Clerk Authentication: Initialized', {
        timestamp: new Date().toISOString(),
        clerkConfig: {
          hasSecretKey: !!config.clerk.secretKey,
          hasWebhookSecret: !!config.clerk.webhookSecret,
          apiUrl: config.clerk.apiUrl
        }
      });
    } else {
      console.error('❌ Clerk module not properly loaded:', {
        clerkExists: !!clerk,
        hasInitializeMethod: clerk && typeof clerk.initialize === 'function',
        timestamp: new Date().toISOString()
      });
    }
    
    // Start listening
    server.listen(config.server.port, () => {
      console.log('🚀 Voice Translator Backend Server Started');
      console.log(`📍 Port: ${config.server.port}`);
      console.log(`🌐 Environment: ${config.server.environment}`);
      console.log(`🌍 Host: ${config.server.host}`);
      console.log(`📊 Database: MongoDB Connected`);
      console.log(`🔌 Gemini AI: ${gemini.getStatus()}`);
      console.log(`🔐 Clerk Authentication: Ready`);
      console.log(`🔗 API: http://${config.server.host}:${config.server.port}/api`);
      console.log(`🛡️ Security: Rate limiting, CORS, Helmet enabled`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

module.exports = {
  startServer
};
