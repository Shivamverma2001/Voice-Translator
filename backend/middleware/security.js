const helmet = require('helmet');
const config = require('../config');

// Security headers configuration
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "data:", "blob:"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://*.clerk.com", "https://*.clerk.accounts.dev"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://*.clerk.com", "https://*.clerk.accounts.dev"],
      imgSrc: ["'self'", "data:", "https:", "https://*.clerk.com", "https://*.clerk.accounts.dev"],
      connectSrc: ["'self'", "ws:", "wss:", "https://*.clerk.com", "https://*.clerk.accounts.dev"],
      fontSrc: ["'self'", "https://*.clerk.com", "https://*.clerk.accounts.dev"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'", "blob:"],
      frameSrc: ["'self'", "https://*.clerk.com", "https://*.clerk.accounts.dev"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  frameguard: { action: 'sameorigin' },
  xssFilter: true,
  hidePoweredBy: true
});

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (config.security.corsOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
};

// Request size limiter
const requestSizeLimit = (req, res, next) => {
  const contentLength = parseInt(req.headers['content-length'] || '0');
  
  if (contentLength > config.upload.maxFileSize) {
    return res.status(413).json({
      success: false,
      error: {
        message: `Request entity too large. Maximum size allowed: ${config.upload.maxFileSize / (1024 * 1024)}MB`,
        code: 'REQUEST_TOO_LARGE'
      }
    });
  }
  
  next();
};

// File type validator
const validateFileType = (req, res, next) => {
  if (!req.file) return next();
  
  const fileExtension = req.file.originalname.split('.').pop().toLowerCase();
  
  if (!config.upload.allowedFileTypes.includes(fileExtension)) {
    return res.status(400).json({
      success: false,
      error: {
        message: `File type not allowed. Allowed types: ${config.upload.allowedFileTypes.join(', ')}`,
        code: 'INVALID_FILE_TYPE'
      }
    });
  }
  
  next();
};

// IP address extractor
const getClientIP = (req, res, next) => {
  req.clientIP = req.ip || 
                 req.connection.remoteAddress || 
                 req.socket.remoteAddress || 
                 req.connection.socket?.remoteAddress ||
                 'unknown';
  next();
};

// Request logger
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.clientIP || req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    };
  });
  
  next();
};

module.exports = {
  securityHeaders,
  corsOptions,
  requestSizeLimit,
  validateFileType,
  getClientIP,
  requestLogger
};
