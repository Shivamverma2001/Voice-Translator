const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Access token required',
        message: 'Please provide a valid authentication token'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Find user by ID
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid token',
        message: 'User not found'
      });
    }

    // Check if user is locked
    if (user.isLocked) {
      return res.status(423).json({ 
        error: 'Account locked',
        message: 'Your account has been temporarily locked due to multiple failed login attempts'
      });
    }

    // Check if user's email is verified (optional, can be disabled)
    if (process.env.REQUIRE_EMAIL_VERIFICATION === 'true' && !user.isEmailVerified) {
      return res.status(403).json({ 
        error: 'Email not verified',
        message: 'Please verify your email address before accessing this resource'
      });
    }

    // Add user to request object
    req.user = user;
    req.userId = user._id;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Invalid token',
        message: 'The provided token is invalid or expired'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired',
        message: 'Your session has expired. Please log in again'
      });
    }

    console.error('Authentication error:', error);
    return res.status(500).json({ 
      error: 'Authentication failed',
      message: 'An error occurred during authentication'
    });
  }
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user && !user.isLocked) {
        req.user = user;
        req.userId = user._id;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// Role-based access control middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'Please log in to access this resource'
      });
    }

    if (!roles.includes(req.user.subscription.plan)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        message: `This feature requires one of the following plans: ${roles.join(', ')}`
      });
    }

    next();
  };
};

// Subscription plan middleware
const requireSubscription = (minPlan = 'free') => {
  const planHierarchy = {
    'free': 0,
    'basic': 1,
    'premium': 2,
    'enterprise': 3
  };

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'Please log in to access this resource'
      });
    }

    const userPlanLevel = planHierarchy[req.user.subscription.plan] || 0;
    const requiredPlanLevel = planHierarchy[minPlan] || 0;

    if (userPlanLevel < requiredPlanLevel) {
      return res.status(403).json({ 
        error: 'Subscription required',
        message: `This feature requires at least a ${minPlan} subscription plan`
      });
    }

    next();
  };
};

// Rate limiting middleware for API calls
const rateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => { // 15 minutes
  const requests = new Map();

  return (req, res, next) => {
    const userId = req.userId || req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    if (requests.has(userId)) {
      const userRequests = requests.get(userId).filter(timestamp => timestamp > windowStart);
      requests.set(userId, userRequests);
    } else {
      requests.set(userId, []);
    }

    const userRequests = requests.get(userId);

    if (userRequests.length >= maxRequests) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded',
        message: `Too many requests. Please try again in ${Math.ceil(windowMs / 60000)} minutes`,
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }

    userRequests.push(now);
    next();
  };
};

// Usage limit middleware
const checkUsageLimit = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'Please log in to access this resource'
      });
    }

    // Check if user can make translation
    if (!req.user.canTranslate()) {
      return res.status(429).json({ 
        error: 'Usage limit exceeded',
        message: `You have reached your monthly limit of ${req.user.subscription.monthlyLimit} translations. Please upgrade your plan for unlimited access.`,
        currentUsage: req.user.subscription.usedThisMonth,
        limit: req.user.subscription.monthlyLimit,
        remaining: req.user.remainingTranslations
      });
    }

    next();
  } catch (error) {
    console.error('Usage limit check error:', error);
    next();
  }
};

// API key authentication middleware
const authenticateApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'] || req.query.apiKey;

    if (!apiKey) {
      return res.status(401).json({ 
        error: 'API key required',
        message: 'Please provide a valid API key'
      });
    }

    // Find user by API key
    const user = await User.findOne({
      'apiKeys.key': apiKey,
      'apiKeys.isActive': true
    }).select('-password');

    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid API key',
        message: 'The provided API key is invalid or inactive'
      });
    }

    // Check if API key has expired
    const apiKeyData = user.apiKeys.find(key => key.key === apiKey);
    if (apiKeyData.expiresAt && apiKeyData.expiresAt < new Date()) {
      return res.status(401).json({ 
        error: 'API key expired',
        message: 'The provided API key has expired'
      });
    }

    // Update last used timestamp
    apiKeyData.lastUsed = new Date();
    await user.save();

    // Add user to request object
    req.user = user;
    req.userId = user._id;
    req.apiKey = apiKeyData;
    
    next();
  } catch (error) {
    console.error('API key authentication error:', error);
    return res.status(500).json({ 
      error: 'Authentication failed',
      message: 'An error occurred during API key authentication'
    });
  }
};

// Device tracking middleware
const trackDevice = async (req, res, next) => {
  try {
    if (req.user) {
      const deviceInfo = {
        deviceId: req.headers['x-device-id'] || req.ip,
        deviceName: req.headers['x-device-name'] || 'Unknown',
        deviceType: req.headers['x-device-type'] || 'web',
        lastLogin: new Date()
      };

      // Check if device already exists
      const existingDevice = req.user.devices.find(d => d.deviceId === deviceInfo.deviceId);
      
      if (existingDevice) {
        existingDevice.lastLogin = deviceInfo.lastLogin;
        existingDevice.isActive = true;
      } else {
        req.user.devices.push(deviceInfo);
      }

      // Keep only last 10 devices
      if (req.user.devices.length > 10) {
        req.user.devices = req.user.devices
          .sort((a, b) => new Date(b.lastLogin) - new Date(a.lastLogin))
          .slice(0, 10);
      }

      await req.user.save();
    }
    
    next();
  } catch (error) {
    console.error('Device tracking error:', error);
    next();
  }
};

// Logging middleware
const logRequest = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      userId: req.userId || 'anonymous',
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      timestamp: new Date().toISOString()
    };

    // Log based on status code
    if (res.statusCode >= 400) {
      console.error('❌ Request failed:', logData);
    } else if (res.statusCode >= 300) {
      console.warn('⚠️ Request redirected:', logData);
    } else {
      console.log('✅ Request successful:', logData);
    }
  });

  next();
};

module.exports = {
  authenticateToken,
  optionalAuth,
  requireRole,
  requireSubscription,
  rateLimit,
  checkUsageLimit,
  authenticateApiKey,
  trackDevice,
  logRequest
};
