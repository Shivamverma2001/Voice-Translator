const express = require('express');
const router = express.Router();
const { authenticateFirebaseToken, optionalFirebaseAuth } = require('../middleware/firebaseAuth');
const User = require('../models/User');

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Firebase authentication is healthy',
    timestamp: new Date().toISOString()
  });
});

// Get current user profile (requires authentication)
router.get('/me', authenticateFirebaseToken, async (req, res) => {
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
});

// Update user profile (requires authentication)
router.put('/profile', authenticateFirebaseToken, async (req, res) => {
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

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
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
    console.error('❌ Error updating user profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
  }
});

// Delete user account (requires authentication)
router.delete('/account', authenticateFirebaseToken, async (req, res) => {
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
});

// Get user by Firebase UID (optional authentication)
router.get('/user/:firebaseUid', optionalFirebaseAuth, async (req, res) => {
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
});

// Test endpoint to verify User model with Firebase data
router.post('/test-user-model', async (req, res) => {
  try {
    // Test creating a Firebase user (without saving to database)
    const testUser = new User({
      firebaseUid: 'test_firebase_uid_123',
      isFirebaseUser: true,
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      username: 'testuser',
      phoneNumber: '+1234567890',
      country: 'US',
      state: 'CA'
    });
    
    // Validate the user data
    const validationError = testUser.validateSync();
    
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: 'User model validation failed',
        errors: validationError.errors
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'User model validation passed',
      userData: {
        firebaseUid: testUser.firebaseUid,
        isFirebaseUser: testUser.isFirebaseUser,
        email: testUser.email,
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        username: testUser.username,
        phoneNumber: testUser.phoneNumber,
        country: testUser.country,
        state: testUser.state
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
