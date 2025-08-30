// Server Startup Configuration
// This file centralizes server startup logic and Firebase initialization

const config = require('../config');
const { connectDB } = require('../db/connection');
const { initializeFirebase } = require('../config/firebase');

/**
 * Start the server with all required initializations
 * @param {Object} server - HTTP server instance
 * @param {Object} gemini - Gemini AI instance
 */
const startServer = async (server, gemini) => {
  try {
    // Connect to database
    await connectDB();
    
    // Initialize Firebase integration
    try {
      console.log('🔐 Initializing Firebase integration...');
      initializeFirebase();
      console.log('🔐 Firebase Authentication: Initialized', {
        timestamp: new Date().toISOString(),
        firebaseConfig: {
          hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
          hasServiceAccount: !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY
        }
      });
    } catch (error) {
      console.error('❌ Firebase initialization failed:', error);
      // Don't exit - Firebase might not be critical for basic functionality
    }
    
    // Start listening
    server.listen(config.server.port, () => {
      console.log('🚀 Voice Translator Backend Server Started');
      console.log(`📍 Port: ${config.server.port}`);
      console.log(`🌐 Environment: ${config.server.environment}`);
      console.log(`🌍 Host: ${config.server.host}`);
      console.log(`📊 Database: MongoDB Connected`);
      console.log(`🔌 Gemini AI: ${gemini.getStatus()}`);
      console.log(`🔐 Firebase Authentication: Ready`);
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
