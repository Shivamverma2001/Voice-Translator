// Server Initialization
// This file centralizes server setup and socket initialization

const http = require('http');
const { createSocketServer } = require('../cors/config');
const socketConnection = require('../socket');

/**
 * Initialize HTTP server and Socket.IO
 * @param {Express} app - Express app instance
 * @returns {Object} - Server and Socket.IO instances
 */
const initializeServer = (app) => {
  // Create HTTP server
  const server = http.createServer(app);

  // Create Socket.IO server with CORS
  const io = createSocketServer(server);

  // Initialize socket connection
  socketConnection.initialize(server, io);

  console.log('✅ Server and Socket.IO initialized successfully');

  return { server, io };
};

module.exports = {
  initializeServer
};
