require('dotenv').config();

const express = require('express');
const http = require('http');

const config = require('./config');
const { connectDB } = require('./db/connection');
const { applyCors, createSocketServer } = require('./cors/config');
const gemini = require('./gemini/gemini');
const socketConnection = require('./socket');
const translationService = require('./services/translationService');

// Import middleware
const { globalErrorHandler, notFound } = require('./middleware/errorHandler');
const { apiLimiter, translationLimiter } = require('./middleware/rateLimiter');
const { securityHeaders, requestLogger, getClientIP } = require('./middleware/security');

if (typeof applyCors !== 'function' || typeof createSocketServer !== 'function') {
  console.error('❌ Failed to load CORS module properly');
  process.exit(1);
}

if (!gemini || typeof gemini.getStatus !== 'function') {
  console.error('❌ Failed to load Gemini AI module properly');
  process.exit(1);
}

const requiredEnvVars = [
  'SPEECHMATICS_API_KEY',
  'GEMINI_API_KEY', 
  'MONGODB_URI'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`${envVar} environment variable is required`);
    process.exit(1);
  }
}

const app = express();
const server = http.createServer(app);

// Apply security middleware
app.use(securityHeaders);
app.use(getClientIP);
app.use(requestLogger);

// Apply CORS and parsing
applyCors(app);
app.use(express.json({ limit: config.upload.maxFileSize }));

// Rate limiting is handled in individual route files

const io = createSocketServer(server);
socketConnection.initialize(server, io);

app.get('/', (req, res) => {
  res.redirect('/api');
});

app.use('/api', require('./routes'));

// 404 handler - must be after all routes
app.use(notFound);

// Global error handler - must be last
app.use(globalErrorHandler);

io.on('connection', (socket) => {
  socket.connectedAt = new Date();
  
  socket.on('disconnect', () => {
  });

  socket.on('transcribe-text', (data) => {
    translationService.handleTranscribeText(socket, data);
  });

  socket.on('speech-translation', (data) => {
    translationService.handleSpeechTranslation(socket, data);
  });
});

const startServer = async () => {
  try {
    await connectDB();
    
    server.listen(config.server.port, () => {
      console.log('🚀 Voice Translator Backend Server Started');
      console.log(`📍 Port: ${config.server.port}`);
      console.log(`🌐 Environment: ${config.server.environment}`);
      console.log(`🌍 Host: ${config.server.host}`);
      console.log(`📊 Database: MongoDB Connected`);
      console.log(`🔌 Gemini AI: ${gemini.getStatus()}`);
      console.log(`🔗 API: http://${config.server.host}:${config.server.port}/api`);
      console.log(`🛡️ Security: Rate limiting, CORS, Helmet enabled`);
    });
    } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

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

startServer();
