const { verifyIdToken, getUserByUid } = require('../config/firebase');
const User = require('../models/User');

// Firebase authentication middleware
const authenticateFirebaseToken = async (req, res, next) => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'Authorization header missing'
      });
    }

    // Check if it's a Bearer token
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Invalid authorization header format. Use: Bearer <token>'
      });
    }

    // Extract the token
    const idToken = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      // Verify the Firebase ID token
      const decodedToken = await verifyIdToken(idToken);
      
      // Get user from Firebase
      const firebaseUser = await getUserByUid(decodedToken.uid);
      
      if (!firebaseUser) {
        return res.status(401).json({
          success: false,
          error: 'Firebase user not found'
        });
      }

      // Check if user is disabled
      if (firebaseUser.disabled) {
        return res.status(401).json({
          success: false,
          error: 'User account is disabled'
        });
      }

      // Find or create user in MongoDB
      let user = await User.findOne({ firebaseUid: decodedToken.uid });
      
      if (!user) {
        // Create new user in MongoDB
        user = new User({
          firebaseUid: decodedToken.uid,
          isFirebaseUser: true,
          email: firebaseUser.email,
          firstName: firebaseUser.displayName?.split(' ')[0] || '',
          lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
          firebaseMetadata: {
            lastSync: new Date(),
            firebaseData: {
              uid: firebaseUser.uid,
              emailVerified: firebaseUser.emailVerified,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              providerData: firebaseUser.providerData
            }
          }
        });
        
        await user.save();
        console.log('✅ New Firebase user created in MongoDB:', user._id);
      } else {
        // Update existing user's Firebase metadata
        user.firebaseMetadata = {
          lastSync: new Date(),
          firebaseData: {
            uid: firebaseUser.uid,
            emailVerified: firebaseUser.emailVerified,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            providerData: firebaseUser.providerData
          }
        };
        
        // Update email if it changed
        if (user.email !== firebaseUser.email) {
          user.email = firebaseUser.email;
        }
        
        await user.save();
        console.log('✅ Firebase user updated in MongoDB:', user._id);
      }

      // Add user info to request
      req.user = {
        id: user._id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
        firebaseUser: firebaseUser
      };

      next();
    } catch (firebaseError) {
      console.error('❌ Firebase token verification failed:', firebaseError);
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }
  } catch (error) {
    console.error('❌ Firebase authentication middleware error:', error);
    return res.status(500).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};

// Optional authentication middleware (for routes that can work with or without auth)
const optionalFirebaseAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided, continue without authentication
      req.user = null;
      return next();
    }

    // Try to authenticate, but don't fail if it doesn't work
    try {
      const idToken = authHeader.substring(7);
      const decodedToken = await verifyIdToken(idToken);
      const firebaseUser = await getUserByUid(decodedToken.uid);
      
      if (firebaseUser && !firebaseUser.disabled) {
        let user = await User.findOne({ firebaseUid: decodedToken.uid });
        
        if (user) {
          req.user = {
            id: user._id,
            firebaseUid: user.firebaseUid,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isActive: user.isActive,
            firebaseUser: firebaseUser
          };
        }
      }
    } catch (error) {
      // Authentication failed, but that's okay for optional auth
      console.log('ℹ️ Optional authentication failed:', error.message);
    }
    
    next();
  } catch (error) {
    console.error('❌ Optional Firebase authentication error:', error);
    next();
  }
};

// Role-based access control middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      });
    }

    next();
  };
};

module.exports = {
  authenticateFirebaseToken,
  optionalFirebaseAuth,
  requireRole
};
