const { clerkClient } = require('@clerk/backend');
const User = require('../models/User');

// Clerk authentication middleware
const authenticateClerkUser = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Access token required',
        message: 'Please provide a valid Clerk authentication token'
      });
    }

    // Verify Clerk session token
    const session = await clerkClient.sessions.verifySession(token);
    
    if (!session || !session.userId) {
      return res.status(401).json({ 
        error: 'Invalid token',
        message: 'Invalid or expired session'
      });
    }

    // Get user from Clerk
    const clerkUser = await clerkClient.users.getUser(session.userId);
    
    if (!clerkUser) {
      return res.status(401).json({ 
        error: 'User not found',
        message: 'User not found in Clerk'
      });
    }

    // Find or create user in MongoDB
    let user = await User.findOne({ clerkId: clerkUser.id });
    
    if (!user) {
      // Create user if they don't exist in MongoDB
      user = await User.create({
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        username: clerkUser.username || `user_${clerkUser.id}`,
        firstName: clerkUser.firstName || '',
        lastName: clerkUser.lastName || '',
        isClerkUser: true,
        clerkMetadata: {
          lastSync: new Date(),
          clerkData: {
            id: clerkUser.id,
            createdAt: clerkUser.createdAt,
            updatedAt: clerkUser.updatedAt,
            imageUrl: clerkUser.imageUrl
          }
        }
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(423).json({ 
        error: 'Account deactivated',
        message: 'Your account has been deactivated'
      });
    }

    // Add user to request object
    req.user = user;
    req.userId = user._id;
    req.clerkUser = clerkUser;
    
    next();
  } catch (error) {
    console.error('Clerk authentication error:', error);
    
    if (error.status === 401) {
      return res.status(401).json({ 
        error: 'Invalid token',
        message: 'The provided token is invalid or expired'
      });
    }
    
    return res.status(500).json({ 
      error: 'Authentication failed',
      message: 'An error occurred during authentication'
    });
  }
};

// Optional authentication middleware (doesn't fail if no token)
const optionalClerkAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const session = await clerkClient.sessions.verifySession(token);
      
      if (session && session.userId) {
        const clerkUser = await clerkClient.users.getUser(session.userId);
        const user = await User.findOne({ clerkId: clerkUser.id });
        
        if (user && user.isActive) {
          req.user = user;
          req.userId = user._id;
          req.clerkUser = clerkUser;
        }
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

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        message: 'You do not have permission to access this resource'
      });
    }

    next();
  };
};

// Admin-only middleware
const requireAdmin = (req, res, next) => {
  return requireRole(['admin'])(req, res, next);
};

// User or admin middleware
const requireUserOrAdmin = (req, res, next) => {
  return requireRole(['user', 'admin'])(req, res, next);
};

module.exports = {
  authenticateClerkUser,
  optionalClerkAuth,
  requireRole,
  requireAdmin,
  requireUserOrAdmin
};
