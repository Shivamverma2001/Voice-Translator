// Middleware Initialization
// This file centralizes all middleware setup for the Express app

const { securityHeaders, requestLogger, getClientIP, trustProxy } = require('./security');
const { applyCors } = require('../cors/config');

/**
 * Initialize all middleware for the Express app
 * @param {Express} app - Express app instance
 * @param {Object} config - Application configuration
 */
const initializeMiddleware = (app, config) => {
  // Apply security middleware first
  app.use(securityHeaders);
  app.use(trustProxy); // Trust proxy headers for ngrok
  app.use(getClientIP);
  app.use(requestLogger);

  // Apply CORS middleware
  applyCors(app);

  // Apply body parsing middleware
  app.use(require('express').json({ limit: config.upload.maxFileSize }));

  console.log('✅ All middleware initialized successfully');
};

module.exports = {
  initializeMiddleware
};
