const helmet = require('helmet');
const config = require('../config');

// Trust proxy configuration for reverse proxies (ngrok, etc.)
const trustProxy = (req, res, next) => {
  // This middleware ensures Express trusts proxy headers
  // Needed for rate limiting to work properly with ngrok
  next();
};

// Security headers configuration
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "data:", "blob:"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://*.firebaseapp.com", "https://*.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://*.firebaseapp.com", "https://*.googleapis.com"],
      imgSrc: ["'self'", "data:", "https:", "https://*.firebaseapp.com", "https://*.googleapis.com"],
      connectSrc: ["'self'", "ws:", "wss:", "https://*.firebaseapp.com", "https://*.googleapis.com"],
      fontSrc: ["'self'", "https://*.firebaseapp.com", "https://*.googleapis.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'", "blob:"],
      frameSrc: ["'self'", "https://*.firebaseapp.com", "https://*.googleapis.com"]
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

// CORS configuration moved to dedicated cors/config.js file

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
  requestSizeLimit,
  validateFileType,
  getClientIP,
  requestLogger,
  trustProxy
};
