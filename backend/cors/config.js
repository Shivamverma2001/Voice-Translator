// CORS Configuration for Voice Translator Backend
// This file contains all CORS-related configuration and middleware

const cors = require('cors');

// Default allowed origins
const defaultOrigins = [
  'http://localhost:3000',
  'http://localhost:8081', // RN Metro
  'http://localhost:19006', // Expo dev
  'https://*.ngrok-free.app', // Allow all ngrok URLs
  'https://*.ngrok.io', // Allow legacy ngrok URLs
];

// Get origins from environment variable
const envOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

// Combine default and environment origins
const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

// CORS options for Express app
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., mobile apps, curl)
    if (!origin) return callback(null, true);
    
    // Always allow ngrok domains
    if (origin.includes('ngrok-free.app') || origin.includes('ngrok.io')) {
      return callback(null, true);
    }
    
    const isAllowed = allowedOrigins.some((allowed) => {
      if (allowed === '*') return true;
      // Simple exact match for other domains
      return origin === allowed;
    });
    
    if (isAllowed) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200,
};

// CORS options for Socket.IO
const socketCorsOptions = {
  cors: {
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g., mobile apps, curl)
      if (!origin) return callback(null, true);
      
      // Always allow ngrok domains
      if (origin.includes('ngrok-free.app') || origin.includes('ngrok.io')) {
        return callback(null, true);
      }
      
      // Allow localhost and other allowed origins
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:8081',
        'http://localhost:19006'
      ];
      
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      return callback(null, true); // Allow all for development
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  }
};

// Apply CORS middleware to Express app
const applyCors = (app) => {
  app.use(cors(corsOptions));
  console.log('✅ CORS middleware applied to Express app');
  console.log('🌐 Allowed origins:', allowedOrigins);
};

// Create Socket.IO server with CORS
const createSocketServer = (httpServer) => {
  const socketIo = require('socket.io');
  const io = socketIo(httpServer, socketCorsOptions);
  console.log('✅ Socket.IO server created with CORS configuration');
  return io;
};

// Get CORS configuration info
const getCorsInfo = () => {
  return {
    allowedOrigins,
    defaultOrigins,
    envOrigins,
    corsOptions: {
      credentials: corsOptions.credentials,
      methods: corsOptions.methods,
      allowedHeaders: corsOptions.allowedHeaders
    },
    socketCors: {
      methods: socketCorsOptions.cors.methods,
      credentials: socketCorsOptions.cors.credentials
    }
  };
};

module.exports = {
  applyCors,
  createSocketServer,
  getCorsInfo,
  corsOptions,
  socketCorsOptions
}; 
