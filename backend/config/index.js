require('dotenv').config();

const config = {
  // Server Configuration
  server: {
    port: process.env.PORT || 5001,
    environment: process.env.NODE_ENV || 'development',
    host: process.env.HOST || 'localhost'
  },

  // Database Configuration
  database: {
    uri: process.env.MONGODB_URI,
    options: {
      maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE) || 10,
      serverSelectionTimeoutMS: parseInt(process.env.MONGODB_SERVER_SELECTION_TIMEOUT) || 5000,
      socketTimeoutMS: parseInt(process.env.MONGODB_SOCKET_TIMEOUT) || 45000,
      retryWrites: true,
      w: 'majority'
    }
  },

  // AI Services Configuration
  ai: {
    gemini: {
      apiKey: process.env.GEMINI_API_KEY,
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
      maxTokens: parseInt(process.env.GEMINI_MAX_TOKENS) || 1000
    },
    speechmatics: {
      apiKey: process.env.SPEECHMATICS_API_KEY,
      region: process.env.SPEECHMATICS_REGION || 'us-east-1'
    }
  },

  // Security Configuration
  security: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12,
    corsOrigins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:3000']
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
  },

  // File Upload Configuration
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
    allowedFileTypes: process.env.ALLOWED_FILE_TYPES ? process.env.ALLOWED_FILE_TYPES.split(',') : ['pdf', 'docx', 'txt', 'jpg', 'png', 'gif', 'bmp', 'tiff', 'webp'],
    uploadPath: process.env.UPLOAD_PATH || './uploads'
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'combined',
    file: process.env.LOG_FILE || './logs/app.log'
  }
};

// Validation
const requiredEnvVars = [
  'MONGODB_URI',
  'GEMINI_API_KEY',
  'SPEECHMATICS_API_KEY',
  'JWT_SECRET'
];

for (const envVar of requiredEnvVars) {
  if (!config.database.uri && envVar === 'MONGODB_URI') {
    throw new Error('MONGODB_URI environment variable is required');
  }
  if (!config.ai.gemini.apiKey && envVar === 'GEMINI_API_KEY') {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }
  if (!config.ai.speechmatics.apiKey && envVar === 'SPEECHMATICS_API_KEY') {
    throw new Error('SPEECHMATICS_API_KEY environment variable is required');
  }
  if (!config.security.jwtSecret && envVar === 'JWT_SECRET') {
    throw new Error('JWT_SECRET environment variable is required');
  }
}

module.exports = config;
