const User = require('../models/User');
const { getFirebaseAuth, getUserByUid } = require('../config/firebase');

class FirebaseAuthController {
  // Health check endpoint
  healthCheck(req, res) {
    res.status(200).json({
      success: true,
      message: 'Firebase authentication is healthy',
      timestamp: new Date().toISOString()
    });
  }

  // Get current user profile (requires authentication)
  async getCurrentUser(req, res) {
    try {
      const user = await User.findById(req.user.id).select('-password');
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        user: {
          id: user._id,
          firebaseUid: user.firebaseUid,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          age: user.age,
          phoneNumber: user.phoneNumber,
          gender: user.gender,
          avatar: user.avatar,
          role: user.role,
          isActive: user.isActive,
          country: user.country,
          state: user.state,
          preferredLanguage: user.preferredLanguage,
          recommendedVoice: user.recommendedVoice,
          settings: user.settings,
          firebaseMetadata: user.firebaseMetadata,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      });
    } catch (error) {
      console.error('❌ Error getting user profile:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get user profile'
      });
    }
  }

  // Update user profile (requires authentication)
  async updateProfile(req, res) {
    try {
      const allowedUpdates = [
        'firstName', 'lastName', 'age', 'phoneNumber', 'gender',
        'country', 'state', 'preferredLanguage', 'recommendedVoice',
        'settings'
      ];

      const updates = {};
      Object.keys(req.body).forEach(key => {
        if (allowedUpdates.includes(key)) {
          updates[key] = req.body[key];
        }
      });

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No valid fields to update'
        });
      }

      // Get current user to check if we need to sync with Firebase
      const currentUser = await User.findById(req.user.id);
      if (!currentUser) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Update MongoDB user
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { $set: updates },
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Sync with Firebase if name fields changed
      if (updates.firstName || updates.lastName) {
        try {
          const firebaseAuth = getFirebaseAuth();
          const newDisplayName = `${updates.firstName || user.firstName} ${updates.lastName || user.lastName}`.trim();
          
          await firebaseAuth.updateUser(currentUser.firebaseUid, {
            displayName: newDisplayName
          });
          
          console.log('✅ Firebase profile synced successfully');
        } catch (firebaseError) {
          console.error('❌ Firebase profile sync failed:', firebaseError);
          // Don't fail the request if Firebase sync fails
        }
      }

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user: user
      });
    } catch (error) {
      console.error('❌ Error updating user profile:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update user profile'
      });
    }
  }

  // Get user by Firebase UID
  async getUserByFirebaseUid(req, res) {
    try {
      const { firebaseUid } = req.params;
      
      if (!firebaseUid) {
        return res.status(400).json({
          success: false,
          error: 'Firebase UID is required'
        });
      }

      const user = await User.findOne({ firebaseUid }).select('-password');
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // If authenticated user is requesting their own profile, return full data
      if (req.user && req.user.firebaseUid === firebaseUid) {
        return res.status(200).json({
          success: true,
          user: {
            id: user._id,
            firebaseUid: user.firebaseUid,
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            age: user.age,
            phoneNumber: user.phoneNumber,
            gender: user.gender,
            avatar: user.avatar,
            role: user.role,
            isActive: user.isActive,
            country: user.country,
            state: user.state,
            preferredLanguage: user.preferredLanguage,
            recommendedVoice: user.recommendedVoice,
            settings: user.settings,
            firebaseMetadata: user.firebaseMetadata,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          }
        });
      }

      // For other users, return limited public data
      res.status(200).json({
        success: true,
        user: {
          id: user._id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar,
          country: user.country,
          state: user.state,
          preferredLanguage: user.preferredLanguage,
          createdAt: user.createdAt
        }
      });
    } catch (error) {
      console.error('❌ Error getting user by Firebase UID:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get user'
      });
    }
  }

  // Get combined Firebase + MongoDB user data
  async getCombinedProfile(req, res) {
    try {
      // Get MongoDB user data
      const mongoUser = await User.findById(req.user.id).select('-password');
      
      if (!mongoUser) {
        return res.status(404).json({
          success: false,
          error: 'User not found in MongoDB'
        });
      }

      // Get Firebase user data
      const firebaseUser = await getUserByUid(mongoUser.firebaseUid);

      if (!firebaseUser) {
        return res.status(404).json({
          success: false,
          error: 'User not found in Firebase'
        });
      }

      // Combine the data
      const combinedUser = {
        // MongoDB custom fields
        id: mongoUser._id,
        firebaseUid: mongoUser.firebaseUid,
        firstName: mongoUser.firstName,
        lastName: mongoUser.lastName,
        age: mongoUser.age,
        phoneNumber: mongoUser.phoneNumber,
        gender: mongoUser.gender,
        avatar: mongoUser.avatar,
        role: mongoUser.role,
        isActive: mongoUser.isActive,
        country: mongoUser.country,
        state: mongoUser.state,
        preferredLanguage: mongoUser.preferredLanguage,
        recommendedVoice: mongoUser.recommendedVoice,
        settings: mongoUser.settings,
        createdAt: mongoUser.createdAt,
        updatedAt: mongoUser.updatedAt,
        
        // Firebase authentication data
        email: firebaseUser.email,
        emailVerified: firebaseUser.emailVerified,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        providerData: firebaseUser.providerData,
        disabled: firebaseUser.disabled,
        metadata: firebaseUser.metadata,
        
        // Firebase metadata from MongoDB
        firebaseMetadata: mongoUser.firebaseMetadata
      };

      res.status(200).json({
        success: true,
        user: combinedUser
      });
    } catch (error) {
      console.error('❌ Error getting combined user profile:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get combined user profile'
      });
    }
  }

  // Sync user data between Firebase and MongoDB
  async syncUserData(req, res) {
    try {
      // Get current MongoDB user
      const mongoUser = await User.findById(req.user.id);
      if (!mongoUser) {
        return res.status(404).json({
          success: false,
          error: 'User not found in MongoDB'
        });
      }

      // Get Firebase user data
      const firebaseUser = await getUserByUid(mongoUser.firebaseUid);
      if (!firebaseUser) {
        return res.status(404).json({
          success: false,
          error: 'User not found in Firebase'
        });
      }

      // Update MongoDB with latest Firebase data
      mongoUser.firebaseMetadata = {
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
      if (mongoUser.email !== firebaseUser.email) {
        mongoUser.email = firebaseUser.email;
      }

      await mongoUser.save();

      res.status(200).json({
        success: true,
        message: 'User data synced successfully',
        user: {
          id: mongoUser._id,
          firebaseUid: mongoUser.firebaseUid,
          email: mongoUser.email,
          firstName: mongoUser.firstName,
          lastName: mongoUser.lastName,
          lastSync: mongoUser.firebaseMetadata.lastSync
        }
      });
    } catch (error) {
      console.error('❌ Error syncing user data:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to sync user data'
      });
    }
  }

  // Delete user account (requires authentication)
  async deleteAccount(req, res) {
    try {
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Soft delete - mark as inactive instead of removing
      user.isActive = false;
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Account deactivated successfully'
      });
    } catch (error) {
      console.error('❌ Error deactivating account:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to deactivate account'
      });
    }
  }

  // Create user manually (for testing/development)
  async createUserManually(req, res) {
    try {
      const { email, password, firstName, lastName } = req.body;

      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: email, password, firstName, lastName'
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: 'User with this email already exists'
        });
      }

      // Create Firebase user
      const firebaseAuth = getFirebaseAuth();
      const firebaseUser = await firebaseAuth.createUser({
        email,
        password,
        displayName: `${firstName} ${lastName}`,
        emailVerified: false
      });

      // Create MongoDB user
      const user = new User({
        firebaseUid: firebaseUser.uid,
        isFirebaseUser: true,
        email: firebaseUser.email,
        firstName: firebaseUser.displayName?.split(' ')[0] || firstName,
        lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || lastName,
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

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        user: {
          id: user._id,
          firebaseUid: user.firebaseUid,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }
      });
    } catch (error) {
      console.error('❌ Error creating user manually:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create user',
        details: error.message
      });
    }
  }

  // Create test user (for development/testing)
  async createTestUser(req, res) {
    try {
      // Create a test user to verify the model works
      const testUser = new User({
        firebaseUid: 'test-uid-123',
        isFirebaseUser: true,
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        age: 25,
        phoneNumber: '+1234567890',
        gender: 'prefer-not-to-say',
        country: 'Test Country',
        state: 'Test State',
        preferredLanguage: 'en',
        recommendedVoice: 'en-US-Standard-A',
        firebaseMetadata: {
          lastSync: new Date(),
          firebaseData: {
            uid: 'test-uid-123',
            emailVerified: false,
            displayName: 'Test User',
            photoURL: null,
            providerData: []
          }
        }
      });

      await testUser.save();
      
      res.status(200).json({
        success: true,
        message: 'Test user created successfully',
        user: testUser
      });
    } catch (error) {
      console.error('❌ Error creating test user:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create test user: ' + error.message
      });
    }
  }
}

module.exports = new FirebaseAuthController();
