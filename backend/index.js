require('dotenv').config({ path: '../.env' });

const express = require('express');

const config = require('./config');
const gemini = require('./gemini/gemini');

// Import initialization modules
const { initializeMiddleware } = require('./middleware/init');
const { initializeRoutes } = require('./routes/init');
const { initializeServer } = require('./server/init');
const { startServer } = require('./server/startup');

// Import error handling middleware
const { globalErrorHandler, notFound } = require('./middleware/errorHandler');

if (!gemini || typeof gemini.getStatus !== 'function') {
  console.error('❌ Failed to load Gemini AI module properly');
  process.exit(1);
}

// Environment variables are validated in the startup process

const app = express();

// Initialize all middleware
initializeMiddleware(app, config);

// Initialize server and Socket.IO
const { server, io } = initializeServer(app);

// Initialize all routes
initializeRoutes(app);

// 404 handler - must be after all routes
app.use(notFound);

// Global error handler - must be last
app.use(globalErrorHandler);

// Socket events are now handled in socket/connection.js

// Start the server
startServer(server, gemini);

server.on('error', (error) => {
  console.error('❌ Server error:', error);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
